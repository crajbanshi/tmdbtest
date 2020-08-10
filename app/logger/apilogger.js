import log4js from 'log4js';
import path from 'path';

log4js.configure({
    "appenders": {
        "access": {
            "type": "dateFile",
            "filename": "log/access.log",
            "pattern": "-yyyy-MM-dd",
            "category": "http"
        },
        "app": {
            "type": "file",
            "filename": "log/app.log",
            "maxLogSize": 10485760,
            "numBackups": 3
        },
        "errorFile": {
            "type": "file",
            "filename": "log/errors.log"
        },
        "errors": {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": "errorFile"
        }
    },
    "categories": {
        "default": { "appenders": ["app"], "level": "DEBUG" },
        "http": { "appenders": ["access"], "level": "TRACE" },
        "error": { "appenders": ["errors"], "level": "Error" },
    }
});

const logger = log4js.getLogger();
const errorLoger = log4js.getLogger('error');
export { logger, errorLoger };