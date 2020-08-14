/**
 *   Series controller handle populer series call, DB fetch 
 *   and respond with top 5 series accessed using our API
 * 
 */

import { ShowCounter } from '../models';

// API URL from .env file
var api_url = process.env.API_URL;

// API key from .env file
const APIKEY = process.env.API_KEY;


/**
 *  Renpond with top 5 popular TV series accessed using our service.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
var popularSeries = async (req: any, res: any, next: any) => {

    // Fetch top 5 series from DB
    const foundResult = await ShowCounter.find({}).sort({ counter: 'desc' }).limit(5);
    if (foundResult) {
        // sending success response 
        res.send(foundResult)
    } else {
        // sending failed response 
        res.send({ message: "No records found" });
    }
}

export default { popularSeries };