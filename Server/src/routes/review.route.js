import express from 'express';
import { body } from 'express-validator';
import reviewController from '../controllers/review.controller.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
import requestHandler from '../handlers/request.handler.js';

const router = express.Router({ mergeParams: true });

router.get(
    '/',
    tokenMiddleware.auth,
    reviewController.getReviewsOfUser
)

router.post(
    "/",
    tokenMiddleware.auth,
    body("mediaId")
        .exists().withMessage("Media ID is required")
        .isLength({ min: 1 }).withMessage("Media ID cannot be empty"),
    body("content")
        .exists().withMessage("Content is required")
        .isLength({ min: 1 }).withMessage("Content cannot be empty"),
    body("mediaType")  
        .exists().withMessage("Media type is required")
        .isIn(["tv", "movie"]).withMessage("Media is invalid"),
    body("mediaTitle")
        .exists().withMessage("Media title is required")
        .isLength({ min: 1 }).withMessage("Media title cannot be empty"),
    body("mediaPoster")
        .exists().withMessage("Media poster is required")
        .isLength({ min: 1 }).withMessage("Media poster cannot be empty"),
    body("imdbRating")
        .optional()
        .isNumeric().withMessage("IMDB rating must be a number")
        .isFloat({ min: 0, max: 10 }).withMessage("IMDB rating must be between 0 and 10"),
    requestHandler.validate,
    reviewController.create
)

router.delete(
    "/:reviewId",
    tokenMiddleware.auth,
    reviewController.remove
)

export default router;