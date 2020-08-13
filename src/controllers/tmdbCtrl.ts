"use strict";

/**
 *  Handle request call for top seried and top episodes
 * 
 */

// import library
import axios from 'axios';
import https from 'https';

import { redisClient } from '../config';
import { Tvseries, Episodes, Logs, ShowCounter } from '../models';

import { MovieService, counter } from '../services';

var api_url = process.env.API_URL;

const APIKEY = process.env.API_KEY;


var apiService = new MovieService();

/**
 * save data to DB
 */
var saveTmdb = async () => {

    var promises = [];
    var i = 1, max = 110000;

    for (i = 1; i <= max; i++) {
        promises.push(apiService.callApi(i));
    }

    Promise.all(promises)
        .then(() => {
            console.log("all saved")
        })
        .catch((e) => {
            console.error("Not saved", e);
        });
}


var topEpisodes = async (req: any, res: any, next: any) => {
    // getting url parameter and query data 
    let seriesId = req.params.id;


    let data: any;
    var value = null;
    // try to fetch data from redis cache
    try {
        value = await redisClient.get(`topEpisodes-${seriesId}`);
    } catch (err) {
        console.log(err);
    }
    if (value) {
        data = JSON.parse(value);
    } else {

        try {
            // getting episode details 
            data = await apiService.callApi(seriesId);

            // store data to redis cache
            if (data) {
                await redisClient.set(`topEpisodes-${seriesId}`, JSON.stringify(data), 'EX', 60 * 5);
            } else {
                data = {
                    "status": false,
                    "status_code": 34,
                    "status_message": "The resource you requested could not be found."
                };
            }
        } catch (err) {
            data = {
                "status": false,
                "status_code": 34,
                "status_message": "The resource you requested could not be found."
            };
        }
    }
    // Log data payload
    let logData = {
        callurl: req.url,
        data: data,
        time: Date().toString()
    }

    // Loging data to db
    var log = new Logs({ ...logData });
    await log.save();  
    
     // update counter
     counter(seriesId);

    res.send(data);
    res.end();
}

var topEpisodes1 = async (req: any, res: any, next: any) => {
    // getting url parameter and query data 
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
    var value = null;
    // try to fetch data from redis cache
    try {
        value = await redisClient.get(`topEpisodes${showid}-${seriesId}`);
    } catch (err) {
        console.log(err);
    }
    if (value) {
        data = value;
    } else {
        // getting episode details        
        data = await apiService.episodeGetRequest(showid, seriesId);

        // store data to redis cache
        try {
            await redisClient.set(`topEpisodes${showid}-${seriesId}`, data, 'EX', 60 * 5);
        } catch (err) {
            console.log(err);
        }


    }
    // Log data payload
    let logData = {
        callurl: req.url,
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
var popularSeries1 = async (req: any, res: any, next: any) => {
    const foundResult = await ShowCounter.find({}).sort({ counter: 'desc' }).limit(5);
    if (foundResult) {
        res.send(foundResult)
    } else {
        res.send({ message: "No records found" });
    }
}


var popularSeries = async (req: any, res: any, next: any) => {
    const value = await redisClient.get(`popularSeries`);
    if (value) {
        let resp = value;
        // Log data payload
        let logData = {
            callurl: "popularSeries",
            data: JSON.parse(resp),
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
                await redisClient.set(`popularSeries`, JSON.stringify(resp), 'EX', 60 * 5);

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
                console.log(error)
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


export default { saveTmdb, topEpisodes, popularSeries, popularSeries1 };