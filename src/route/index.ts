import express from 'express';
import tmdb from './tmdb';

var router = express.Router();


router.route('/').all(function(req, res) {
    res.send({ "status": true, "message": "Restfull API", "data": {} });
});

router.use(tmdb);

//TODO 404 handle

export default router;