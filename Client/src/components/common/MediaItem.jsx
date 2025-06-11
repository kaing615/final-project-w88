import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import uiConfigs from "../../configs/ui.configs";
import { routesGen } from "../../routes/routes";
import { Link } from "react-router-dom";
import favoriteUtils from "../../utils/favorite.utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CircularRate from "./CircularRate";
import PersonIcon from "@mui/icons-material/Person";

const getPosterUrl = (posterPath) => {
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const MediaItem = ({ media, mediaType, width = "100%" }) => {
  const { listFavorites } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [rate, setRate] = useState(null);

  useEffect(() => {
    setTitle(media.title || media.name || media.mediaTitle);
    setPosterPath(
      media.poster_path ||
        media.backdrop_path ||
        media.profile_path ||
        media.mediaPoster
    );
    if (mediaType === tmdbConfigs.mediaType.movie) {
      setReleaseDate(media.release_date && media.release_date.split("-")[0]);
    } else {
      setReleaseDate(
        media.first_air_date && media.first_air_date.split("-")[0]
      );
    }
    setRate(media.vote_average || media.imdbRate || media.mediaRate);
  }, [media, mediaType]);

  return (
    <Link
      to={
        mediaType !== "people"
          ? routesGen.mediaDetail(mediaType, media.id || media.mediaId)
          : routesGen.person(media.id)
      }
      style={{ textDecoration: "none" }}
    >
      <Box
        sx={{
          width: width,
          aspectRatio: "2/3",
          backgroundImage: `url(${getPosterUrl(posterPath)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: 3,
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          overflow: "hidden",
          cursor: "pointer",
          transition:
            "transform 0.22s cubic-bezier(.42,1,.46,1.14), box-shadow 0.17s",
          willChange: "transform, box-shadow",
          "&:hover": {
            transform: "scale(1.035) translateY(-3px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.29)",
          },
          "&:hover .media-info": {
            opacity: 1,
            bottom: 0,
          },
          "&:hover .media-backdrop": {
            opacity: 1,
          },
          "&:hover .media-play-btn": {
            opacity: 1,
            transform: "translate(-50%,-55%) scale(1.11)",
          },
          "&:hover .media-favorite-icon": {
            opacity: 1,
          },
          color: "primary.contrastText",
        }}
      >
        {/* Icon yêu thích */}
        {mediaType !== "people" &&
          favoriteUtils.check({ listFavorites, mediaId: media.id }) && (
            <FavoriteIcon
              color="primary"
              className="media-favorite-icon"
              sx={{
                position: "absolute",
                right: 15,
                bottom: 15,
                fontSize: "2rem",
                zIndex: 999,
                filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.18))",
                opacity: 0,
                transition: "opacity 0.18s, transform 0.2s",
                pointerEvents: "none",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.11)",
                },
              }}
            />
          )}

        {/* Overlay backdrop */}
        <Box
          className="media-backdrop"
          sx={{
            opacity: 0,
            transition: "opacity 0.16s",
            willChange: "opacity",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            background:
              "linear-gradient(to top, rgba(22,22,30,0.90) 80%, rgba(0,0,0,0.06) 100%)",
            zIndex: 1,
          }}
        />

        {/* Nút Play */}
        <IconButton
          className="media-play-btn"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) scale(1)",
            bgcolor: "rgba(0,201,167,0.80)",
            color: "#fff",
            opacity: 0,
            zIndex: 2,
            boxShadow: "0 0 8px 0 #00C9A75a",
            willChange: "opacity, transform",
            transition:
              "opacity 0.15s, transform 0.18s cubic-bezier(.7,.2,.2,1.2)",
            "&:hover": {
              bgcolor: "#fff",
              color: "#00C9A7",
              boxShadow: "0 0 18px #00C9A777",
            },
          }}
        >
          {mediaType === "people" ? (
            <PersonIcon sx={{ fontSize: 32 }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: 32 }} />
          )}
        </IconButton>

        {/* Thông tin phim */}
        <Box
          className="media-info"
          sx={{
            position: "absolute",
            left: 0,
            bottom: "-16px",
            width: "100%",
            opacity: 0,
            zIndex: 2,
            p: "13px 10px 10px 10px",
            background: "rgba(16,18,24,0.82)",
            color: "#fff",
            transition: "opacity 0.18s, bottom 0.18s cubic-bezier(.7,.3,.1,1)",
            willChange: "opacity, bottom",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" noWrap fontWeight="bold">
            {title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {rate && <CircularRate value={rate} />}
            {releaseDate && (
              <Typography variant="caption" sx={{ color: "#ccc" }}>
                {releaseDate}
              </Typography>
            )}
          </Box>
        </Box>

        {mediaType === "people" && (
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "max-content",
              bottom: 0,
              padding: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.58)",
            }}
          >
            <Typography sx={{ ...uiConfigs.style.typoLines(1, "left") }}>
              {media.name}
            </Typography>
          </Box>
        )}
      </Box>
    </Link>
  );
};

export default MediaItem;
