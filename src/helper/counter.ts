
/**
 * Counter helper use to store access count used in our servise uning first API topEpisode. 
 */

// import library
import axios from 'axios';
import https from 'https';


import { ShowCounter } from "../models";

/**
 *  Increse counter by seriesId
 * 
 * @param showid 
 * @param data 
 */
export async function counter(seriesId: Number, data: any ) {

    let result: any;

    // checking data in DB table
    result = await ShowCounter.findOne({seriesid: seriesId }).exec();

    if (result) {
        let counter = result.get('counter');
        // increase count 
        result = await result.update({ counter: counter + 1 })

    } else {
        
        // insert new counter
        result = await ShowCounter.create({ counter: 1, seriesid: seriesId, seriesName: ( data.series && data.series.original_name )? data.series.original_name : 'N/A' })

    }

    if (result._update) {

        return result._update;

    }

    return result;
}