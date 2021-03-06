import mongoose from 'mongoose';

/**
 * Model for tv series data
 */
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

var tvSeriesSchema = new Schema({
    "backdrop_path": { type: String, default: null },
    "created_by": { type: Array, default: null },
    "episode_run_time": { type: Array, default: null },
    "first_air_date": { type: String, default: null },
    "genres": { type: Array, default: null },
    "homepage": { type: String, default: "" },
    "id": { type: Number, default: null },
    "in_production": { type: Boolean, default: false },
    "languages": { type: Array, default: null },
    "last_air_date": { type: String, default: null },
    "last_episode_to_air": { type: Schema.Types.Mixed, default: {} },
    "name": { type: String, default: null },
    "next_episode_to_air": { type: Schema.Types.Mixed, default: {} },
    "networks": { type: Array, default: null },
    "number_of_episodes": { type: Number, default: null },
    "number_of_seasons": { type: Number, default: null },
    "origin_country": { type: Array, default: null },
    "original_language": { type: String, default: null },
    "original_name": { type: String, default: null },
    "overview": { type: String, default: null },
    "popularity": { type: Number, default: null },
    "poster_path": { type: String, default: null },
    "production_companies": { type: Array, default: null },
    "seasons": { type: Array, default: null },
    "status": { type: String, default: null },
    "type": { type: String, default: null },
    "vote_average": { type: Number, default: null },
    "vote_count": { type: Number, default: null }
});


export default mongoose.model('tvseries', tvSeriesSchema);