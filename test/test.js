import assert from 'assert';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

let should = chai.should();
chai.use(chaiHttp);


var requester = chai.request(app).keepOpen();
var userData = { userid: "5bacc2e59bb8962504a6e142" };


describe('REST API testing', function() {
    before(function() {

    });

    after(function() {
        requester.close();
    });

    describe('GET /api', function() {

        it('respond with status message', function(done) {
            requester.get('/api').end(function(err, res) {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.key('message');
                done();
            });
        });

    });

    describe('GET /api/topEpisodes/1', function() {
        it('respond with an array of topbEpisodes of the show', function(done) {
            requester.post('/api/topEpisodes/1').send(userData).end(function(err, res) {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.an.object;
                done();
            });
        });
    });

    describe('GET /analytics/popularSeries', function() {
        it('respond with an array of popular Series', function(done) {
            requester.post('/analytics/popularSeries').send(userData).end(function(err, res) {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.an.object;
                done();
            });
        });
    });

});