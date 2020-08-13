import redis from 'redis';

const asyncRedis = require("async-redis");


import config from './config';

/* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
var client = redis.createClient({
    port: parseInt(config.redis.port), // replace with your port
    host: config.redis.host, // replace with your hostanme or IP address
    // password: config.redis.password, // replace with your password

});

client.on('connect', function() {
    console.info('Redis connected to ', config.redis.host);
});

client.on('error', function(error: any) {
    throw error;
});

const asyncRedisClient = asyncRedis.decorate(client);

export default asyncRedisClient;