import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

const tokenDecode = (req) => {
    try { 
        const bearerHeader = req.headers["authorization"]; 

        if (bearerHeader) {
            const bearer = bearerHeader.split(" ");
            const token = bearer[1];
            return jsonwebtoken.verify(
                token, 
                process.env.TOKEN_SECRET,
            );
        }

        return false;
    } catch (error) {
        return false;
    }
};

const auth = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    
    if (!tokenDecoded) return responseHandler.unauthorized(res);

    const user = await userModel.findById(tokenDecoded.data);

    if (!user) return responseHandler.unauthorized(res);
    req.user = user;
    next();
};

export default { auth, tokenDecode };

