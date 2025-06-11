import tmdbConfig from "./tmdb.config.js";

const tmdbEndpoints = {
  mediaList: ({ mediaType, mediaCategory, page, with_genres }) => {
    const params = { page };
    if (with_genres) params.with_genres = with_genres;
    return tmdbConfig.getUrl(`${mediaType}/${mediaCategory}`, params);
  },
  mediaDetail: ({ mediaType, mediaId }) => {
    return tmdbConfig.getUrl(`${mediaType}/${mediaId}`);
  },
  mediaGenres: ({ mediaType }) => {
    return tmdbConfig.getUrl(`genre/${mediaType}/list`);
  },
  mediaCredits: ({ mediaType, mediaId }) => {
    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/credits`);
  },
  mediaVideos: ({ mediaType, mediaId }) => {
    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/videos`);
  },
  mediaRecommend: ({ mediaType, mediaId }) => {
    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/recommendations`);
  },
  mediaImages: ({ mediaType, mediaId }) => {
    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/images`);
  },
  mediaSearch: ({ mediaType, query, page }) => {
    return tmdbConfig.getUrl(`search/${mediaType}`, {
      query,
      page,
    });
  },
  personDetail: ({ personId }) => {
    return tmdbConfig.getUrl(`person/${personId}`);
  },
  personMedias: ({ personId }) => {
    return tmdbConfig.getUrl(`person/${personId}/combined_credits`);
  },
};

export default tmdbEndpoints;
