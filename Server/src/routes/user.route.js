import express from 'express';
import { body } from 'express-validator';
import favoriteController from '../controllers/favorite.controller.js';
import userController from '../controllers/user.controller.js';
import requestHandler from '../handlers/request.handler.js';
import userModel from '../models/user.model.js';
import tokenMiddleware from '../middlewares/token.middleware.js';

const router = express.Router();

router.post(
    "/signup",
    body("username")
        .exists().withMessage("Username is required")
        .isLength({ min: 1 }).withMessage("Username cannot be empty")
        .custom(async (value) => {
            const user = await userModel.findOne({ username: value });
            if (user) {
                return Promise.reject("Username already exists");
            }
        }
    ),
    body("password").isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .exists().withMessage("Password is required"),
    body("confirmPassword")
        .isLength({ min: 6 }).withMessage("Confirm password must be at least 6 characters long")
        .exists().withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }
    ),
    body("displayName")
        .exists().withMessage("Display name is required")
        .isLength({ min: 8 }).withMessage("Display name must be at least 8 characters long"),
    requestHandler.validate,
    userController.signUp
)

router.post(
    "/signin",
    body("username")
        .exists().withMessage("Username is required")
        .isLength({ min: 1 }).withMessage("Username cannot be empty"),
    body("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    requestHandler.validate,
    userController.signIn
)

router.put(
    "/update-password",
    tokenMiddleware.auth,
    body("username")
        .exists().withMessage("Username is required")
        .isLength({ min: 1 }).withMessage("Username cannot be empty"),
    body("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("newPassword") 
        .exists().withMessage("New password is required")
        .isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
    body("confirmNewPassword")
        .exists().withMessage("Confirm new password is required")
        .isLength({ min: 6 }).withMessage("Confirm new password must be at least 6 characters long")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("New passwords do not match");
            }
            return true;
        }
    ),
    requestHandler.validate,
    userController.updatePassword
)

router.get(
    "/info",
    tokenMiddleware.auth,
    userController.getInfo
);

router.get(
    "/favorites",
    tokenMiddleware.auth,
    favoriteController.getFavoritesOfUser
)

router.post(
    "/favorites",
    tokenMiddleware.auth,
    body("mediaType")
        .exists().withMessage("Media type is required")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("Media type invalid"),
    body("mediaId")
        .exists().withMessage("Media ID is required")
        .isLength({ min: 1 }).withMessage("Media ID cannot be empty"),
    body("mediaTitle")
        .exists().withMessage("Media title is required")
        .isLength({ min: 1 }).withMessage("Media title cannot be empty"),
    body("mediaPoster")
        .exists().withMessage("Media poster is required"),
    body("imdbRate")
        .exists().withMessage("IMDB rate is required"),
    requestHandler.validate,
    favoriteController.addFavorite
)

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
)

export default router;