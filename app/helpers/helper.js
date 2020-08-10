import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { config, redisClient } from '../../config';
import { logger, errorLoger } from '../logger';

let md5 = (text) =>
    crypto
    .createHash('md5')
    .update(text)
    .digest();

let datavalidate = (req, res, next) => {
    if (!req.validateSchema) {
        throw Error('validateSchema not attached');
    }
    let v = req.validateSchema.validate(req.body, { abortEarly: false });

    if (v.error) {
        res.send({ status: false, errors: v.error });
        res.end();
        return (v.error.message);
    }

    logger.info(`Validate data`, req.originalUrl, req.body);
    next();
}

const comparePassword = async(pw, user, cb) => {
    const securityKey = process.env.SECRET_KEY;
    // eslint-disable-next-line
    // pw is the incoming password
    // user.password is the old password
    let isMatch;
    const encrypt = (text, secretKey) => {
        secretKey = md5(secretKey);
        secretKey = Buffer.concat([secretKey, secretKey.slice(0, 8)]);
        const cipher = crypto.createCipheriv('des-ede3', secretKey, '');
        const encrypted = cipher.update(text, 'utf8', 'base64');
        return encrypted + cipher.final('base64');
    };
    const encrypted = encrypt(pw, securityKey);

    if (encrypted === user.password) {
        isMatch = true;
    } else {
        isMatch = false;
    }

    cb(null, isMatch);
};

const generateToken = (user, expireInSec = null) => {
    return new Promise((resolve, reject) => {
        if (expireInSec == null) {
            expireInSec = 60 * 60 * 24 * 356;
        }
        let token = jwt.sign({
            "data": JSON.stringify(user),
            "exp": Math.floor(Date.now() / 1000) + expireInSec
        }, config.privateKey);
        if (config.useRedis) {
            redisClient.set(token, JSON.stringify(user), 'EX', expireInSec);
        }
        resolve(token);
    });

}

const validateToken = async(req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        res.send({ status: false, "message": "token required" });
        res.end();
    }
    try {
        if (config.useRedis) {
            redisClient.get(token, function(err, user) {
                if (err) {
                    throw err;
                }
                if (!user) {
                    throw "token expired";
                }
                user = JSON.parse(user);
                req.user = user;
                next();
            });
        } else {
            jwt.verify(token, config.privateKey, function(err, user) {
                if (err) {
                    res.send({ status: false, "message": err.message });
                    throw err;
                }
                user = JSON.parse(user);
                req.user = user;
                next();
            });
        }
    } catch (err) {
        res.send({ status: false, "message": err.message });
        res.end();
        throw err;
    }
}
export { datavalidate, comparePassword, generateToken, validateToken };