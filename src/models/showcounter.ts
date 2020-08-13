import * as mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    seriesid: { type: Number, default: 0 },
    counter: { type: Number, default: 0 },
    seriesName: { type: String, default: "N/A" },
    __v: { type: Number, select: false }
}, { timestamps: true });


export default mongoose.model('showcounter', counterSchema);