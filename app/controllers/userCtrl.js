import jwt from 'jsonwebtoken';

import { config, redisClient } from '../../config';
import { Users } from '../models';
import {
    comparePassword,
    generateToken
} from '../helpers';


var getUser = (req, res, next) => {
    let userid = req.body.userid || req.user._id;
    Users.findById(userid, (err, user) => {
        if (err) {
            throw err;
        }
        var data = {
            status: true,
            data: { users: user }
        }
        res.send(data);
        res.end();
    });
}

var getUsers = (req, res, next) => {
    let offset = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || 100;
    Users.find({}).skip(offset).limit(limit).exec((err, users) => {
        if (err) {
            throw err;
        }
        var data = {
            status: true,
            data: { users: users }
        }
        res.send(data);
        res.end();
    });
}

var saveUser = async(req, res, next) => {
    let userid = req.body.userid;

    let userObj = {
        email: req.body.email,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        profileimage: req.body.profileimage,
    };

    userObj = new Users({...userObj });

    let savedUser = await userObj.save();
    var data = {
        status: true,
        data: { user: savedUser }
    }
    res.send(data);
    res.end();
}

var login = async(req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    Users.findOne({ username: username }, (err, user) => {
        if (err) {
            throw err;
        }

        comparePassword(password, user, function(err, isMatch) {
            if (!isMatch) {
                throw "Password not matched";
            }
            let userdata = {
                _id: user._id,
                email: user.email,
                username: user.username
            };
            generateToken(userdata, 60 * 60).then((token) => {
                var data = {
                    status: true,
                    data: {
                        "user": {
                            fname: user.fname,
                            lname: user.lname,
                            email: user.email,
                            username: user.username
                        },
                        "token": token
                    }
                }
                res.send(data);
                res.end();
            });

        });
    });
}



export default { getUser, getUsers, saveUser, login };