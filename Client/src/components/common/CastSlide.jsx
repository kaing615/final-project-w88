import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { routesGen } from "../../routes/routes";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import "swiper/css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef, useState } from "react";

const CastSlide = ({ casts }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!casts || !Array.isArray(casts) || casts.length === 0) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mt: 2,
        "&:hover .cast-arrow": { display: { xs: "none", sm: "flex" } },
        "& .cast-arrow": { display: "none" },
        "& .swiper-slide": {
          width: { xs: 98, sm: 110, md: 120 },
          p: { xs: 0.5, md: 1.5 },
        },
      }}
    >
      {/* Luôn render 2 nút, chỉ ẩn bằng visibility */}
      <IconButton
        className="cast-arrow"
        sx={{
          position: "absolute",
          top: "30%",
          left: -10,
          zIndex: 2,
          background: "#151720",
          color: "#00fff0",
          boxShadow: 2,
          "&:hover": { background: "#23263b" },
          opacity: 0.96,
          p: 1.5,
          visibility: isBeginning ? "hidden" : "visible",
          pointerEvents: isBeginning ? "none" : "auto",
        }}
        onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
      >
        <ChevronLeftIcon sx={{ fontSize: 36 }} />
      </IconButton>
      <IconButton
        className="cast-arrow"
        sx={{
          position: "absolute",
          top: "30%",
          right: -10,
          zIndex: 2,
          background: "#151720",
          color: "#00fff0",
          boxShadow: 2,
          "&:hover": { background: "#23263b" },
          opacity: 0.96,
          p: 1.5,
          visibility: isEnd ? "hidden" : "visible",
          pointerEvents: isEnd ? "none" : "auto",
        }}
        onClick={() => swiperRef.current && swiperRef.current.slideNext()}
      >
        <ChevronRightIcon sx={{ fontSize: 36 }} />
      </IconButton>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        spaceBetween={8}
        slidesPerView="auto"
        grabCursor={true}
        style={{ width: "100%", height: "max-content", paddingBottom: 10 }}
      >
        {casts.map((cast, index) => (
          <SwiperSlide key={cast.id || index}>
            <Link
              to={routesGen.person(cast.id)}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  width: { xs: 80, sm: 100, md: 120 },
                  mx: "auto",
                  borderRadius: { xs: 2, md: 4 }, // bo góc, tuỳ responsive
                  overflow: "hidden",
                  boxShadow: "0 8px 36px 0 rgba(0,0,0,0.22)",
                  border: "1px solid primary.main",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  backgroundImage: `url(${tmdbConfigs.posterPath(
                    cast.profile_path
                  )})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  mb: 1,
                  "&:hover": {
                    transform: "scale(1.09)",
                    boxShadow: "0 4px 28px 0 rgba(0,255,240,0.16)",
                  },
                  paddingTop: "150%",
                }}
              />
              <Typography
                variant="subtitle2"
                align="center"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  textShadow: "1px 2px 12px #111",
                  fontSize: 15,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 100,
                  mx: "auto",
                  mt: 0.5,
                }}
                title={cast.name}
              >
                {cast.name}
              </Typography>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default CastSlide;
