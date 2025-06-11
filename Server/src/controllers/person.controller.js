import responseHandler from "../handlers/response.handler.js";
import tmdpApi from "../tmdb/tmdb.api.js";

const personDetail = async (req, res) => {
  try {
    const { person } = req.params;

    const response = await tmdpApi.personDetail({ personId: person });

    return responseHandler.ok(res, response);
  } catch (error) {
    responseHandler.error(res);
  }
};

const personMedias = async (req, res) => {
  try {
    const { person } = req.params;

    const medias = await tmdpApi.personMedias({ personId: person });

    return responseHandler.ok(res, medias);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  personDetail,
  personMedias,
};
