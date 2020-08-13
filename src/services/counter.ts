
// import library
import axios from 'axios';
import https from 'https';


import { ShowCounter } from "../models";


var api_url = process.env.API_URL;
const APIKEY = process.env.API_KEY;

export async function counter(showid: Number ) {

    let result: any;

    // checking data in DB table
    result = await ShowCounter.findOne({seriesid: showid }).exec();

    if (result) {
        let counter = result.get('counter');
        // increase count 
        result = await result.update({ counter: counter + 1 })

    } else {
        const response = await axios.get(`${api_url}/3/tv/${showid}?api_key=${APIKEY}&language=en-US`,  {
            headers: { "lang": "en-US" },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        // insert new counter
        result = await ShowCounter.create({ counter: 1, seriesid: showid, seriesName: response.data.original_name ? response.data.original_name : 'N/A' })

    }

    if (result._update) {

        return result._update;

    }

    return result;
}