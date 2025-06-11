import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice";
import { routesGen } from "../../routes/routes";
import uiConfigs from "../../configs/ui.configs";
import CircularRate from "./CircularRate";
import genreApi from "../../api/modules/genre.api";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import mediaApi from "../../api/modules/media.api";
import "swiper/css";
import "swiper/css/navigation"; // <--- Thêm dòng này!

const HeroSlide = ({ mediaType, mediaCategory }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const getMedias = async () => {
      const { response, error } = await mediaApi.getList({
        mediaType,
        mediaCategory,
        page: 1,
      });

      if (response) {
        setMovies(response.data.results);
      }
      if (error) {
        toast.error(error.message);
      }
      dispatch(setGlobalLoading(false));
    };

    const getGenres = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await genreApi.getList({ mediaType });
      if (response) {
        setGenres(response.data.genres);
        getMedias();
      }
      if (error) {
        toast.error(error.message);
        setGlobalLoading(false);
      }
    };

    getGenres();
  }, [mediaType, mediaCategory, dispatch]);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Nút Prev */}
      <IconButton
        ref={prevRef}
        sx={{
          position: "absolute",
          top: "50%",
          left: 24,
          zIndex: 12,
          transform: "translateY(-50%)",
          width: 56,
          height: 56,
          bgcolor: "rgba(30,30,36,0.5)",
          color: "#fff",
          border: "2px solid #333",
          backdropFilter: "blur(4px)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.3)",
          opacity: { xs: 0.85, md: 0 },
          transition: "all .25s",
          "&:hover": {
            bgcolor: "rgba(0,200,167,0.85)",
            color: "#fff",
            borderColor: "#00C9A7",
            opacity: 1,
          },
          // Hiện khi hover vào slide chính:
          ".hero-slide-wrapper:hover &": {
            opacity: 1,
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <IconButton
        ref={nextRef}
        sx={{
          position: "absolute",
          top: "50%",
          right: 24,
          zIndex: 12,
          transform: "translateY(-50%)",
          width: 56,
          height: 56,
          bgcolor: "rgba(30,30,36,0.5)",
          color: "#fff",
          border: "2px solid #333",
          backdropFilter: "blur(4px)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.3)",
          opacity: { xs: 0.85, md: 0 },
          transition: "all .25s",
          "&:hover": {
            bgcolor: "rgba(0,200,167,0.85)",
            color: "#fff",
            borderColor: "#00C9A7",
            opacity: 1,
          },
          ".hero-slide-wrapper:hover &": {
            opacity: 1,
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 32 }} />
      </IconButton>

      <Box
        sx={{
          position: "relative",
          color: "primary.contrastText",
          "&::before": {
            content: '""',
            width: "100%",
            height: "30%",
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: "none",
            ...uiConfigs.style.gradientBgImage[theme.palette.mode],
          },
        }}
      >
        <Swiper
          grabCursor={true}
          loop={true}
          modules={[Autoplay, Navigation]}
          style={{ width: "100%", height: "max-content" }}
          autoplay={{
            delay: 10000,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  paddingTop: {
                    xs: "130%",
                    sm: "80%",
                    md: "60%",
                    lg: "45%",
                  },
                  backgroundPosition: "top",
                  backgroundSize: "cover",
                  backgroundImage: `url(${tmdbConfigs.backdropPath(
                    movie.backdrop_path || movie.poster_path
                  )})`,
                }}
              />

              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  ...uiConfigs.style.horizontalGradientBgImage[
                    theme.palette.mode
                  ],
                }}
              />

              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  paddingX: { sm: "10px", md: "5rem", lg: "10rem" },
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingX: "30px",
                    color: "text.primary",
                    width: { sm: "unset", md: "30%", lg: "40%" },
                  }}
                >
                  <Stack spacing={4} direction={"column"}>
                    <Typography
                      variant="h4"
                      fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                      fontWeight={"700"}
                      sx={{
                        ...uiConfigs.style.typoLines(2),
                      }}
                    >
                      {movie.title || movie.name}
                    </Typography>

                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <CircularRate value={movie.vote_average} />

                      <Divider orientation="vertical" />
                      {[...movie.genre_ids]
                        .splice(0, 2)
                        .map((genreId, index) => (
                          <Chip
                            variant="filled"
                            color="primary"
                            key={index}
                            label={
                              genres.find((e) => e.id === genreId) &&
                              genres.find((e) => e.id === genreId).name
                            }
                          />
                        ))}
                    </Stack>

                    <Typography
                      variant="body1"
                      sx={{
                        ...uiConfigs.style.typoLines(3),
                      }}
                    >
                      {movie.overview}
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      component={Link}
                      to={routesGen.mediaDetail(mediaType, movie.id)}
                      sx={{
                        width: "max-content",
                      }}
                    >
                      Watch Now
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default HeroSlide;