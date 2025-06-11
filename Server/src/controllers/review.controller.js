import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";
import tmdbApi from "../tmdb/tmdb.api.js";

const create = async (req, res) => {
    try {
        const { movieId } = req.params;

        const review = new reviewModel({
            user: req.user.id,
            movieId,
            ...req.body
        });

        await review.save();
        await review.populate("user");

        responseHandler.created(res, {
            ...review._doc,
            id: review.id,
            user: review.user
        })
    } catch (error) {
        responseHandler.error(res, error);
    }
}

const remove = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await reviewModel.findOne({
            _id: reviewId,
            user: req.user.id
        })

        if (!review) {
            return responseHandler.notFound(res);
        }

        await review.deleteOne();

        responseHandler.ok(res);
    } catch (error) {
        responseHandler.error(res, error);
    }
}

const getReviewsOfUser = async (req, res) => {
    try {
        const reviews = await reviewModel.find({
            user: req.user.id
        }).populate("user").sort("-createdAt");

        responseHandler.ok(res, reviews);
    } catch (error) {
        responseHandler.error(res, error);
    }
}

export default {
    create,
    remove,
    getReviewsOfUser
};

