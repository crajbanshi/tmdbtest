"use strict";

import jwt from 'jsonwebtoken';
// import * as axios  from 'axios';

import * as request from 'request';
// import * as superagent  from 'superagent';


import { config, redisClient } from '../../config';
import { Tmdbs, Episodes } from '../models';
// import {} from '../helpers';

var superagent = require('superagent');
var axios = require('axios');
const https = require('https');

var api_url = process.env.API_URL;
var APIKEY = process.env.API_KEY;

var callApi = (i) => {

    return new Promise(async(resolve) => {
        console.log("Requesting API ", i);
        axios.get(api_url + "/3/tv/" + i + "?api_key=" + APIKEY + "&language=en-US", {
            headers: { "lang": "en-US" },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
            .then(async (response) => {
                var body = response.data;
                console.log("TBDB body", body);
                var tmdbObj = new Tmdbs({ ...body });
                await tmdbObj.save();


                body.seasons.forEach((season) => {
                    axios.get(api_url + "/3/tv/" + i + "/season/" + season.season_number + "?api_key=" + APIKEY + "&language=en-US", {
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
            // handle errors here
        });

}


var topEpisodes = (req, res, next) => {
    let seriesId = req.params.id;
    let showid = req.query.showid;

    axios.get(api_url + "/3/tv/"+showid+"/season/" + seriesId + "?api_key=" + APIKEY + "&language=en-US", {
        headers: { "lang": "en-US" },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    })
        .then(async (response1) => {
            var body1 = response1.data;
            // console.log("episodes body", body1.episodes);

            res.send(body1.episodes);
            res.end();           

        }).catch((error) => {
            console.log(error);
        });

}


var popularSeries = (req, res, next) => {
    Tmdbs.find({}).sort({ "vote_average": -1 }).limit(5).exec((err, shows) => {
        if (err) {
            throw err;
        }

        var data = {
            status: true,
            episode: shows
        }
        res.send(data);
        res.end();
    });
}

// saveTmdb();

export default { saveTmdb, topEpisodes, popularSeries };