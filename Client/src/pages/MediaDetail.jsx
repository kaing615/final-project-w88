import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Typography, Chip, Divider, Stack } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";
import CastSlide from "../components/common/CastSlide";
import MediaVideosSlide from "../components/common/MediaVideosSlide";
import RecommendSlide from "../components/common/RecommendSlide";

import tmdbConfigs from "../api/configs/tmdb.configs";
import uiConfigs from "../configs/ui.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import {
  addFavorite,
  removeFavorite,
  setListFavorites,
} from "../redux/features/userSlice";
import MediaSlide from "../components/common/MediaSlide";
import MediaReview from "../components/common/MediaReview";

const MediaDetail = () => {
  const dispatch = useDispatch();
  const { mediaType, mediaId } = useParams();
  const { user, listFavorites } = useSelector((state) => state.user);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { response } = await favoriteApi.getList();
      if (response) {
        dispatch(setListFavorites(response.data));
        // KHÔNG log ở đây!
      }
    };
    fetchFavorites();
  }, [dispatch]);

  useEffect(() => {
    console.log("Redux listFavorites:", listFavorites);
  }, [listFavorites]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await mediaApi.getDetail({
        mediaType,
        mediaId,
      });
      dispatch(setGlobalLoading(false));

      if (response) {
        setMedia(response.data);
        setIsFavorite(response.data.isFavorite);
        setGenres(response.data.genres.slice(0, 2));
      }

      if (error) {
        toast.error(error.message);
      }
    };

    getMedia();
  }, [mediaType, mediaId, dispatch]);

  const handleFavorite = async () => {
    if (!user) {
      return dispatch(setAuthModalOpen(true));
    }

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaTitle: media.title || media.name,
      mediaType: mediaType,
      mediaPoster: media.poster_path,
      imdbRate: media.vote_average,
    };

    const { response, error } = await favoriteApi.add(body);
    if (response) {
      dispatch(addFavorite(response.data));
      setIsFavorite(true);
      toast.success("Added to favorite");
    }
    if (error) {
      toast.error(error.message || "Add favorite failed");
    }
    setOnRequest(false); // <-- luôn đặt lại false ở cuối!
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favoriteObj = listFavorites.find(
      (e) => e.mediaId.toString() === media.id.toString()
    );

    if (!favoriteObj) {
      setOnRequest(false);
      toast.error("Not found in favorite list!");
      return;
    }

    const { response, error } = await favoriteApi.remove({
      favoriteId: favoriteObj._id || favoriteObj.id,
    });
    setOnRequest(false);
    if (response) {
      console.log("favoriteObj:", favoriteObj);
      dispatch(removeFavorite(favoriteObj.mediaId));
      setIsFavorite(false);
      toast.success("Removed from favorite");
    }
    if (error) {
      toast.error(error.message || "Remove favorite failed");
    }
    setOnRequest(false);
  };

  return media ? (
    <>
      <ImageHeader
        imgPath={tmdbConfigs.backdropPath(
          media.poster_path || media.backdrop_path
        )}
      />
      <Box
        sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent,
        }}
      >
        {/* Media Content */}
        <Box
          sx={{
            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Media Poster */}
            <Box
              sx={{
                width: { xs: "70%", sm: "50%", md: "40%" },
                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" },
              }}
            >
              <Box
                sx={{
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(
                    tmdbConfigs.backdropPath(
                      media.poster_path || media.backdrop_path
                    )
                  ),
                }}
              ></Box>
            </Box>
            {/* Media Poster */}
            <Box
              sx={{
                width: { xs: "100%", md: "60%" },
                color: "text.primary",
              }}
            >
              <Stack spacing={5}>
                <Typography
                  variant="h4"
                  fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                  fontWeight="700"
                  sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                >
                  {`${media.title || media.name} (${
                    mediaType === tmdbConfigs.mediaType.movie
                      ? media.release_date.split("-")[0]
                      : media.first_air_date.split("-")[0]
                  }) `}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularRate value={media.vote_average} />
                  <Divider orientation="vertical" />
                  {genres.map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre.name}
                      variant="filled"
                      color="primary"
                    />
                  ))}
                </Stack>

                <Typography
                  variant="body1"
                  sx={{ ...uiConfigs.style.typoLines(5) }}
                >
                  {media.overview}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  {/* Nút Favorite */}
                  <LoadingButton
                    variant="text"
                    sx={{
                      width: "max-content",
                      "& .MuiButton-startIcon": { marginRight: 0.5 },
                    }}
                    size="large"
                    startIcon={
                      isFavorite ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderOutlinedIcon />
                      )
                    }
                    loadingPosition="start"
                    loading={onRequest}
                    onClick={handleFavorite}
                  >
                    {isFavorite ? "Added" : "Add Favorite"}
                  </LoadingButton>

                  {/* Nút Play */}
                  <Button
                    variant="contained"
                    sx={{ width: "max-content" }}
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => {
                      videoRef.current.scrollIntoView();
                    }}
                  >
                    Watch Now
                  </Button>
                </Stack>

                <Container header="Cast">
                  <CastSlide casts={media.credits.cast} />
                </Container>
              </Stack>
            </Box>
            {/* Media Poster */}
          </Box>
        </Box>
        <div ref={videoRef} style={{ paddingTop: "2rem" }}>
          <Container header="Videos">
            <MediaVideosSlide videos={media.videos.results.splice(0, 5)} />
          </Container>
        </div>

        {/* Media reviews */}
        <MediaReview
          reviews={media.reviews}
          media={media}
          mediaType={mediaType}
        />
        {/* Media reviews */}

        <Container header="You may also like">
          {media.recommend.length > 0 && (
            <RecommendSlide medias={media.recommend} mediaType={mediaType} />
          )}
          {media.recommend.length === 0 && (
            <MediaSlide
              mediaType={mediaType}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          )}
        </Container>
      </Box>
    </>
  ) : null;
};

export default MediaDetail;
