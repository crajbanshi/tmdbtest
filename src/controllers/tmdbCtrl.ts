"use strict";

/**
 *  Handle request call for top seried and top episodes
 * 
 */

// import library
import axios from 'axios';
import https from 'https';

import { config, redisClient } from '../config';
import { Tmdbs, Episodes, Logs } from '../models';

var api_url = process.env.API_URL;

const APIKEY = process.env.API_KEY;

// Calling api.themoviedb.org API to get Tv details
var callApi = (showid: number) => {

    return new Promise(async (resolve) => {

        axios.get(api_url + "/3/tv/" + showid + "?api_key=" + APIKEY + "&language=en-US", {
            headers: { "lang": "en-US" },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
            // Handling response
            .then(async (response) => {
                var body = response.data;
                var tmdbObj = new Tmdbs({ ...body });
                await tmdbObj.save();

                // geting episodes by season
                body.seasons.forEach((season) => {
                    axios.get(api_url + "/3/tv/" + showid + "/season/" + season.season_number + "?api_key=" + APIKEY + "&language=en-US", {
                        headers: { "lang": "en-US" },
                        httpsAgent: new https.Agent({
                            rejectUnauthorized: false
                        })
                    })
                        // Handling season episodes response
                        .then(async (resp) => {
                            var data = resp.data;

                            data.episodes.forEach(async (episode) => {
                                var episodeObj = new Episodes({ ...episode });
                                await episodeObj.save();
                            });

                        })
                        // handle error
                        .catch((error) => {
                            console.log(error);
                        });

                });
                resolve(true);
            })
            // Handaling Http error
            .catch((error) => {
                console.log(error);
            });
    });
}

/**
 * save data to DB
 */
var saveTmdb = async () => {

    var promises = [];
    var i = 1, max = 110000;

    for (i = 1; i <= max; i++) {
        promises.push(callApi(i));
    }

    Promise.all(promises)
        .then(() => {
            console.log("all saved")
        })
        .catch((e) => {
            console.error("Not saved", e);
        });
}

/**
 * sorting by vote_average, returning top 20 episodes if there are more than 20 episodes
 * 
 * @param showid 
 * @param seriesId 
 */
var episodeGetRequest = async (showid: number, seriesId: number) => {
    let res = { data: { episodes: [] } };
    try {
        let url = `${api_url}/3/tv/${showid}/season/${seriesId}?api_key=${APIKEY}&language=en-US`;

        // calling themoviedb,org api to get episodes
        res = await axios.get(url, {
            headers: { "lang": "en-US" },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }
    // default error handler
    catch (err) {
        // Return if error 
        return {
            "success": false,
            "status_code": 34,
            "status_message": "The resource you requested could not be found."
        };
    }


    var episodes = res.data.episodes;

    // sorting by vote_average
    episodes.sort(function (a: any, b: any) { return b.vote_average - a.vote_average; });

    // returning top 20 episodes if there are more than 20 episodes
    return episodes.slice(0, 20);

}


var topEpisodes = async (req: any, res: any, next: any) => {
    let seriesId = req.params.id;
    let showid = req.query.showid;

    // validating show id
    if (!showid) {
        res.send({
            status: false,
            message: "Show id is missing, add query string showid"
        });
        res.end();
        return;
    }
    let data: any;
    const value = await redisClient.get(`topEpisodes${showid}-${seriesId}`);
    if (value) {
        data = value;
    } else {
        // getting episode details
        data = await episodeGetRequest(showid, seriesId);
        await redisClient.set(`topEpisodes${showid}-${seriesId}`, data);
    }
    // Log data payload
    let logData = {
        callurl: "topEpisodes",
        data: data,
        time: Date().toString()
    }

    // Loging data to db
    var log = new Logs({ ...logData });
    await log.save();

    res.send(data);
    res.end();
}

/**
 *  retunr top 5 popular TV series
 * 
 * @param req 
 * @param res 
 * @param next 
 */
var popularSeries = async (req: any, res: any, next: any) => {
    const value = await redisClient.get(`popularSeries`);
    if (value) {
        let resp = value;
        // Log data payload
        let logData = {
            callurl: "popularSeries",
            data: resp,
            time: Date().toString()
        }

        // Loging data to db
        var log = new Logs({ ...logData });
        await log.save();

        // sending response
        res.send(resp);
        res.end();

    } else {
        // calling themoviedb,org api to get top rated series
        axios.get(`${api_url}/3/tv/top_rated?api_key=${APIKEY}&language=en-US`, {
            headers: { "lang": "en-US" },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
            // handeling response
            .then(async (response) => {
                var data = response.data;

                var results = data.results;

                // soring by vote_average decending order
                results.sort(function (a: any, b: any) { return b.vote_average - a.vote_average; });

                let resp = {
                    "total_results": data.total_results,
                    "showing": "top 5",
                    "results": results.slice(0, 5)
                };
                // Storing cashe to redis       
                await redisClient.set(`popularSeries`, resp);

                // Log data payload
                let logData = {
                    callurl: "popularSeries",
                    data: resp,
                    time: Date().toString()
                }

                // Loging data to db
                var log = new Logs({ ...logData });
                await log.save();

                // sending response
                res.send(resp);
                res.end();

            })
            // default error handler
            .catch(async (error) => {
                let result = {
                    "success": false,
                    "status_code": 34,
                    "status_message": "The resource you requested could not be found."
                };

                // Log data payload
                let logData = {
                    callurl: "popularSeries",
                    data: result,
                    time: Date().toString()
                }

                // Loging data to db
                var log = new Logs({ ...logData });
                await log.save();

                // sending response
                res.send(result);
                res.end();
            });

    }
}


export default { saveTmdb, topEpisodes, popularSeries, episodeGetRequest };