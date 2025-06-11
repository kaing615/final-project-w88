import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signUp = async (req, res) => {
    try { 
        const { username, password, displayName } = req.body;
        const user = new userModel();

        const checkUser = await userModel.findOne({ username });
        if (checkUser) return responseHandler.badRequest(res, "User already exists");

        user.displayName = displayName;
        user.username = username;
        user.setPassword(password); 
        await user.save();

        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: "24h" }
        );

        user.password = undefined; 
        user.salt = undefined;
        
        responseHandler.created(res, {
            token,
            ...user._doc,
            id: user.id,
        })
    } catch (error) { 
        responseHandler.error(res);
    }
}

const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username }).select("username password salt id displayName");

        if (!user) return responseHandler.badRequest(res, "Invalid username or password");
        if (!user.validatePassword(password)) return responseHandler.badRequest(res, "Invalid username or password");
         
        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: "24h" }
        );

        user.password = undefined; 
        user.salt = undefined;
        
        responseHandler.created(res, {
            token,
            ...user._doc,
            id: user.id,
        })
    } catch (error) {
        responseHandler.error(res);
    }
}

const updatePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const user = await userModel.findById(req.user.id).select("password id salt");

        if (!user) return responseHandler.notFound(res, "User not found");
        if (!user.validatePassword(password)) return responseHandler.badRequest(res, "Invalid password");

        user.setPassword(newPassword);
        await user.save();

        responseHandler.ok(res, "Password updated successfully");
    } catch (error) {
        responseHandler.error(res);
    }
}

const getInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) return responseHandler.notFound(res, "User not found");
        responseHandler.ok(res, user);
    } catch (error) {
        responseHandler.error(res);
    }
}

export default {
    signUp,
    signIn,
    updatePassword,
    getInfo
};