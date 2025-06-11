import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    mediaType: {
        type: String,
        enum: ["tv", "movie"],
        required: true
    },
    mediaId: {
        type: String,
        required: true
    },
    mediaTitle: {
        type: String,
        required: true
    },
    mediaPoster: {
        type: String,
        required: true
    },
    imdbRating: {
        type: Number,
        min: 0,
        max: 10
    },
}, modelOptions);

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;