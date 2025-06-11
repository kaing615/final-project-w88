import mongoose from "mongoose";
import modelOptions from "./model.options.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    salt: {
        type: String,
        required: true
    },
}, modelOptions);

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto.pbkdf2Sync(
        password, 
        this.salt, 
        10000, 
        64, 
        "sha512"
    ).toString("hex");
};

userSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(
        password, 
        this.salt, 
        10000, 
        64, 
        "sha512"
    ).toString("hex");
    return this.password === hash;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;