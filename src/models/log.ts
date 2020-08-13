import mongoose from 'mongoose';


/**
 * Log Schema
 */
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

var tmdbSchema = new Schema({
    "callurl": { type: String, default: null },
    "data": { type: Object, default: null },
    "time": { type: String, default: null },
    
});


export default mongoose.model('log', tmdbSchema);