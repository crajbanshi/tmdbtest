import detectMocha from 'detect-mocha';
import { logger, errorLoger } from '../logger'
import { config } from '../../config';

// if (config.env != 'dev')
process.on('uncaughtException', (err, origin) => {
    if (detectMocha()) {
        return;
    }
    errorLoger.error('uncaughtException', err.message, err.stack);
    let errorCode = 500;
    if (typeof err == 'string') {
        let message = err;
        err = {};
        err.message = message;
        errorCode = 403;
    } else if (err.name == 'CastError') {
        err.message = "data is not valid";
        errorCode = 400;
    }

    // try {
    //     if (_request)
    //         _request.res.status(errorCode).send({ error: err.message });
    // } catch (err) {
    //     console.log(err);
    // }
});

var errorHandler = function(req, res) {
    errorLoger.error('unknown URL', req.originalUrl);
    res.status(404).send('404 Not Found');
}

var ServerErrorHandler = function(err, req, res, next) {
    if (req.xhr) {
        errorLoger.error('Internal Error', err.status, req.stack)
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err)
    }
}


export { errorHandler, ServerErrorHandler };