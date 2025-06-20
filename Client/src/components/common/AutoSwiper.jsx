import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

const AutoSwiper = ({ children }) => {
  return (
    <>
      <Box
        sx={{
          "& .swiper-slide": {
            width: {
              xs: "50%",
              sm: "35%",
              md: "25%",
              lg: "20.5%",
            },
          },
        }}
      >
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          style={{
            width: "100%",
            height: "max-content",
          }}
          spaceBetween={20}
        >
          {children}
        </Swiper>
      </Box>
    </>
  );
};

export default AutoSwiper;
