import mongoose from 'mongoose';
// import Promise from 'bluebird';
// import httpStatus from 'http-status';
// import crypto from 'crypto';
// import uniqueValidator from 'mongoose-unique-validator';

// import APIError from '../helpers/APIError';


/**
 * User Schema
 */
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

var episodeSchema = new Schema({
    "air_date":  { type: String, default: null },
    "episode_number": { type: Number, default: null },
    "id": { type: Number, default: null },
    "name":  { type: String, default: null },
    "overview":  { type: String, default: null },
    "production_code":  { type: String, default: null },
    "season_number": { type: Number, default: null },
    "show_id": { type: Number, default: null },
    "still_path":  { type: String, default: null },
    "vote_average":{ type: Number, default: null },
    "vote_count": { type: Number, default: null },
    "crew":{ type: Array, default: null },
    "guest_stars":{ type: Array, default: null }
});


export default mongoose.model('episode', episodeSchema);