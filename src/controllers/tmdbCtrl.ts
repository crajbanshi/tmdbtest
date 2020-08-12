"use strict";

// import jwt from 'jsonwebtoken';
import axios from 'axios';
import https from 'https';

import { config } from '../config';
import { Tmdbs, Episodes } from '../models';

var api_url = process.env.API_URL;
var APIKEY = process.env.API_KEY;

var callApi = (showid: number) => {

    return new Promise(async (resolve) => {
        axios.get(api_url + "/3/tv/" + showid + "?api_key=" + APIKEY + "&language=en-US", {
            headers: { "lang": "en-US" },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
            .then(async (response) => {
                var body = response.data;
                var tmdbObj = new Tmdbs({ ...body });
                await tmdbObj.save();

                body.seasons.forEach((season) => {
                    axios.get(api_url + "/3/tv/" + showid + "/season/" + season.season_number + "?api_key=" + APIKEY + "&language=en-US", {
                        headers: { "lang": "en-US" },
                        httpsAgent: new https.Agent({
                            rejectUnauthorized: false
                        })
                    })
                        .then(async (response1) => {
                            var body1 = response1.data;
                            console.log("episodes body", body1.episodes);

                            body1.episodes.forEach(async (episode) => {
                                var episodeObj = new Episodes({ ...episode });
                                await episodeObj.save();
                            });

                        }).catch((error) => {
                            console.log(error);
                        });

                });
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });
}

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

var episodeGetRequest = async (showid: number, seriesId: number) => {
    let res = { data: { episodes: [] } };
    try {
        res = await axios.get(api_url + "/3/tv/" + showid + "/season/" + seriesId + "?api_key=" + APIKEY + "&language=en-US", {
            headers: { "lang": "en-US" },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    } catch (err) {
        return {
            "success": false,
            "status_code": 34,
            "status_message": "The resource you requested could not be found."
        };
    }

    var body1 = res.data.episodes;
    body1.sort(function (a: any, b: any) { return b.vote_average - a.vote_average; });
    return body1.slice(0, 20);

}


var topEpisodes = async (req: any, res: any, next: any) => {
    let seriesId = req.params.id;
    let showid = req.query.showid;

    let data = await episodeGetRequest(showid, seriesId);
    res.send(data);
    res.end();
}


var popularSeries = (req: any, res: any, next: any) => {

    axios.get(api_url + "/3/tv/top_rated?api_key=" + APIKEY + "&language=en-US", {
        headers: { "lang": "en-US" },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    })
        .then(async (response1) => {
            var body1 = response1.data;

            var results = body1.results;
            results.sort(function (a: any, b: any) { return b.vote_average - a.vote_average; });

            res.send({
                "total_results": body1.total_results,
                "showing": "top 5",
                "results": results.slice(0, 5)
            });
            res.end();

        }).catch((error) => {
            res.send({
                "success": false,
                "status_code": 34,
                "status_message": "The resource you requested could not be found."
            });
            res.end();
        });

}

// saveTmdb();

export default { saveTmdb, topEpisodes, popularSeries, episodeGetRequest };