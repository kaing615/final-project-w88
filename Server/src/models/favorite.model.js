import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
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
    imdbRate: {
        type: Number,
        min: 0,
        max: 10
    },
}, modelOptions);

const favoriteModel = mongoose.model("Favorite", favoriteSchema);
export default favoriteModel;