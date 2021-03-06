/**
 * 
 * Themoviedb.org calling for episodes
 */


import axios from 'axios';
import https from 'https';

import { Tvseries, Episodes, Logs } from '../models';
import { counter } from '../helper';

var api_url = process.env.API_URL;

const APIKEY = process.env.API_KEY;

class MovieService {

    ApiService() { }

    // Calling api.themoviedb.org API to get Tv details
    callApi(showid: number) {

        // return promise
        return new Promise(async (resolve, reject) => {
            // calling API
            axios.get(`${api_url}/3/tv/${showid}?api_key=${APIKEY}&language=en-US`, {
                headers: { "lang": "en-US" },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            })
                // Handling response
                .then(async (response) => {
                    var series = response.data;
                   
                    var tmdbObj = new Tvseries({ ...series });
                    await tmdbObj.save();


                    if(series.seasons.length==0){
                        resolve(series);
                    }else{
                    // geting episodes by season
                    series.seasons.forEach((season) => {
                        axios.get(`${api_url}/3/tv/${showid}/season/${season.season_number}?api_key=${APIKEY}&language=en-US`, {
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

                                data.episodes.sort(function (a: any, b: any) { return b.vote_average - a.vote_average; });
                                
                                resolve({series: series,
                                   episode: data.episodes.slice(0, 20)
                                });

                            })
                            // handle error
                            .catch((error) => {
                                console.log(error);
                            });
                        
                    }); }
                
                })
                // Handaling Http error
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * sorting by vote_average, returning top 20 episodes if there are more than 20 episodes
     * 
     * @param showid 
     * @param seriesId 
     */

    async episodeGetRequest(showid: number, seriesId: number) {
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

    async topRated() {
        let res = { data: { results: [] } };
        try {
            let url = `${api_url}/3/tv/top_rated?api_key=${APIKEY}&language=en-US`;

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

        // returning top 20 episodes if there are more than 20 episodes
        return {
            data: res.data,
            results: res.data.results
        };

    }





}

export default MovieService;