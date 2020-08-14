"use strict";

/**
 *  Controller to handle top Episode, return max 20 episodes 
 * 
 */

// import library

import { redisClient } from '../config';
import { Logs } from '../models';
import { MovieService } from '../services';
import { counter } from '../helper';


var apiService = new MovieService();

/**
 *  Top Eposode API business logic
 * 
 * @param req 
 * @param res 
 * @param next 
 */
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
     counter(seriesId, data);

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


export default { topEpisodes };