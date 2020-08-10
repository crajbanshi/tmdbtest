import express from 'express';
import http from 'http';
import socket from 'socket.io';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';
import expresslogger from 'express-logger';

global._request = {};

import { config, amqpconnection } from './config';
import route from './app/route';
import { errorHandler, ServerErrorHandler } from './app/helpers'

var accessLogFile = config.accessLogFile;
var app = express();
var httpapp = http.Server(app);
var io = socket(httpapp);
let port = config.port;

// secure apps by setting various HTTP headers
app.use(function(req, res, next) {
    _request = { 'req': req, 'res': res };
    next();
});

app.use(helmet());
app.use(cors());

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

app.use(expresslogger({ path: accessLogFile }));
app.use(express.static(path.join(__dirname, 'view', 'static')));

// App routes
app.use('/api', route);

app.use(errorHandler);
app.use(ServerErrorHandler);

httpapp.listen(port, function() {
    console.log(`listening on *:${port}`);
});

export default httpapp;

/**************************  new  ***************************/