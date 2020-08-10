import mongoose from 'mongoose';
import Promise from 'bluebird';
import httpStatus from 'http-status';
import crypto from 'crypto';
import uniqueValidator from 'mongoose-unique-validator';

import APIError from '../helpers/APIError';

const securityKey = process.env.SECRET_KEY;

let md5 = (text) =>
    crypto
    .createHash('md5')
    .update(text)
    .digest();

/**
 * User Schema
 */
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

var userSchema = new Schema({
    fname: { type: String, default: null },
    lname: { type: String, default: null },
    username: { type: String, required: true, unique: true, default: null, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: true },
    profileimage: { type: String, default: null },
}, { timestamps: true });

userSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * converts the string value of the password to some hashed value
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// eslint-disable-next-line
userSchema.pre('save', function userSchemaPre(next) {
    const user = this;

    if (this.isModified('password') || this.isNew) {
        // eslint-disable-next-line

        const encrypt = (text, secretKey) => {
            secretKey = md5(secretKey);
            secretKey = Buffer.concat([secretKey, secretKey.slice(0, 8)]);
            const cipher = crypto.createCipheriv('des-ede3', secretKey, '');
            const encrypted = cipher.update(text, 'utf8', 'base64');
            return encrypted + cipher.final('base64');
        };
        const encrypted = encrypt(user.password, securityKey);
        user.password = encrypted;
        user.lastModified = Date.now();
        next();
    } else {
        return next();
    }
});

/**
 * comapare the stored hashed value of the password with the given value of the password
 * @param pw - password whose value has to be compare
 * @param cb - callback function
 */
userSchema.methods.comparePassword = (pw, cb) => {
    const user = this;
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

/**
 * Statics
 */
userSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    get(id) {
        return this.findById(id)
            .execAsync()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },
    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 20 } = {}) {
        return this.find({ $or: [{ userType: 'user' }, { userType: 'admin' }] })
            .sort({ _id: -1 })
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .execAsync();
    },
};
/**
 * @typedef User
 */
export default mongoose.model('user', userSchema);