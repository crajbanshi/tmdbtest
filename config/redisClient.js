import redis from 'redis';
import config from './config';
import { logger, errorLoger } from '../app/logger';

/* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
var client = redis.createClient({
    port: config.redis.port, // replace with your port
    host: config.redis.host, // replace with your hostanme or IP address
    // password: config.redis.password, // replace with your password

});

client.on('connect', function() {
    logger.info('Redis connected to ', config.redis.host);
});

client.on('error', function(error) {
    throw error;
});

export default client;