import assert from 'assert';
import chai from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
import https from 'https';

import app from '../src/app';

import { tmdbCtrl } from '../src/controllers'

import { ApiService } from '../src/services';

var api_url = process.env.API_URL;
var APIKEY = process.env.API_KEY;

let should = chai.should();
chai.use(chaiHttp);


var requester = chai.request(app).keepOpen();


describe('REST API testing', function () {
    
    before(function () {
        // TODO create mock object
    });

    after(function () {
        requester.close();
    });

    // API test
    describe('GET /api', function () {
        it('respond with status message', function (done) {
            requester.get('/api')
                .end(function (err: any, res: any) {
                    if (err) throw err;
                    chai.expect(res).to.have.status(200);
                    // chai.expect(res.body).to.have.key('message');
                    done();
                });
        });
    });

    // themoviedb.org API test
    describe('GET ' + api_url + '/3/tv/1400?api_key=<<APIKEY>>&language=en-US', function () {
        it('respond with status message', async (done) => {
             axios.get(api_url + '/3/tv/1400?api_key=' + APIKEY + '&language=en-US', {
                headers: { "lang": "en-US" },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            }).then(res=>{
                // console.log(res)               
            }).catch(err=>{
                // console.log(err)
            })
            done(); 
        });
    });

    // core function testing
    describe('Function test episodeGetRequest(1400, 1) ', async () => {
        it('respond with an array of top Episodes of the show', async (done) => {
            // tmdbCtrl.episodeGetRequest(1400, 1);
            var apiService = new ApiService();
            apiService.episodeGetRequest(1400, 1);
            done();
        });
    });

// positive test case
    describe('GET /api/topEpisodes/1?showid=10000', function () {
        it('respond with an array of top Episodes of the show', function (done) {
            requester.get('/api/topEpisodes/1?showid=10000')
                .end(function (err: any, res: any) {
                    if (err) throw err;
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    // Negative test case
    describe('GET /api/topEpisodes/1', function () {
        it('respond with error message for showid missing', function (done) {
            requester.get('/api/topEpisodes/1')
                .end(function (err: any, res: any) {
                    if (err) throw err;
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.have.keys(["status", "message"])
                    done();
                });
        });
    });
    

    // Positive test case, 
    describe('GET /analytics/popularSeries', function () {
        it('respond with an array of popular Series', function (done) {
            requester.get('/api/analytics/popularSeries')
                .end(function (err: any, res: any) {
                    if (err) throw err;
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body.results).to.have.length(5);
                    chai.expect(res.body.results).to.be.an('array');
                    done();
                });
        });
    });

    // 404 test case
    describe('GET /api/notfound', function () {
        it('respond with error message 404', function (done) {
            requester.get('/api/notfound')
                .end(function (err: any, res: any) {
                    if (err) throw err;
                    console.log(res.body)
                    chai.expect(res).to.have.status(404);
                    done();
                });
        });
    });
});

// TODO 