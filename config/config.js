import os from 'os';
import dotenv from 'dotenv';
import detectMocha from 'detect-mocha';

const result = dotenv.config();
if (result.error) {
    throw result.error;
}

if (detectMocha()) {
    process.env.PORT = 3 + process.env.PORT
}

const config = {
    port: process.env.PORT,
    env: process.env.ENV,
    thisUrl: process.env.SERVER_URL || 'http://' + os.hostname() + ':' + process.env.SERVER_PORT + '/api',
    uploadDir: 'upload/',
    imageExt: ['.jpg', '.gif', '.png'],
    accessLogFile: "log/access.log",
    db: {
        mongodb: {
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dbname: process.env.DATABASE_DBNAME
        }
    },
    privateKey: process.env.PRIVATE_KEY || "privateKey",
    useRedis: process.env.USER_REDIS || false,
    redis: {
        port: process.env.REDIS_PORT, // replace with your port
        host: process.env.REDIS_HOST, // replace with your hostanme or IP address
        password: process.env.REDIS_PASSWORD, // replace with your password

    }
}

export default config;