import { SwiperSlide } from "swiper/react";
import AutoSwiper from "./AutoSwiper";
import MediaItem from "./MediaItem";
import NavigationAutoSwiper from "./NavigationAutoSwiper";
import { Box } from "@mui/material";

const RecommendSlide = ({ medias, mediaType }) => {
  return (
    <NavigationAutoSwiper>
      {medias.map((media, index) => (
        <SwiperSlide key={index}>
          <MediaItem media={media} mediaType={mediaType} />
        </SwiperSlide>
      ))}
    </NavigationAutoSwiper>
  );
};

export default RecommendSlide;
