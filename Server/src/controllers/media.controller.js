import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const response = await tmdbApi.mediaList({
      mediaType,
      mediaCategory,
      page: page ? parseInt(page) : 1,
    });

    return responseHandler.ok(res, response);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaGenres({
      mediaType,
    });

    return responseHandler.ok(res, response);
  } catch (error) {
    console.log("Error in getGenres:", error);
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { query, page } = req.query;
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType,
    });

    return responseHandler.ok(res, response);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const params = {
      mediaType,
      mediaId,
    };

    const media = await tmdbApi.mediaDetail(params);
    media.credits = await tmdbApi.mediaCredits(params);

    const videos = await tmdbApi.mediaVideos(params);
    media.videos = videos;

    const recommend = await tmdbApi.mediaRecommend(params);
    media.recommend = recommend.results;

    const images = await tmdbApi.mediaImages(params);
    media.images = images;

    const tokenDecoded = tokenMiddleware.tokenDecode(req);
    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);
      if (user) {
        const isFavorite = await favoriteModel.findOne({
          user: user.id,
          mediaId,
        });
        media.isFavorite = isFavorite != null;
      }
    }

    media.reviews = await reviewModel
      .find({
        mediaId,
      })
      .populate("user")
      .sort("-createdAt");

    responseHandler.ok(res, media);
  } catch (error) {
    console.log("Error in getDetail:", error);
    responseHandler.error(res);
  }
};

export default {
  getList,
  getGenres,
  search,
  getDetail,
};
