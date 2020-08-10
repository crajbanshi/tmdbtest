import jwt from 'jsonwebtoken';
import { request } from 'request';

import { config, redisClient } from '../../config';
import { Tmdb, Episode } from '../models';
// import {} from '../helpers';

var api_url = process.env.API_URL;
var APIKEY = process.env.API_KEY;

var saveTmdb = async () => {

    if (Tmdb.count() == 0) {
        var i = 1, max = 110000;

        for (i = 1; i <= max; i++) {
            request({
                uri: api_url + "/3/tv/" + i + "?api_key=" + APIKEY + "&language=en-US",
                method: "GET",
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function (error, response, body) {
                // console.log(body);
                tmdbObj = new Tmdb({ ...body });
                await tmdbObj.save();

                body.seasons.forEach((season) => {

                    request({
                        uri: api_url + "/3/tv/" + i + "/season/" + season.season_number + "?api_key=" + APIKEY + "&language=en-US",
                        method: "GET",
                        timeout: 10000,
                        followRedirect: true,
                        maxRedirects: 10
                    }, function (error1, response1, body1) {
                        // console.log(body);
                        episodeObj = new Episode({ ...body1.episodes });
                        await episodeObj.save();
                    });

                });
            });
        }
    }
}


var topEpisodes = (req, res, next) => {
    let seriesId = req.params.id;

    Episode.find({ "show_id": seriesId }).sort({ "vote_average": -1 }).limit(20).exec((err, shows) => {
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


var popularSeries = (req, res, next) => {
    Tmdb.find({}).sort({ "vote_average": -1 }).limit(5).exec((err, shows) => {
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

saveTmdb();

export default { saveTmdb, topEpisodes, popularSeries };