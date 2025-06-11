import { Box } from "@mui/material";
import { Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const NavigationAutoSwiper = ({ children }) => {
  return (
    <Box
      sx={{
        "& .swiper-slide": {
          width: {
            xs: "50%",
            sm: "35%",
            md: "25%",
            lg: "20.5%",
          },
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
          background: "#181818",
          transition: "box-shadow 0.3s, transform 0.3s",
          "&:hover": {
            boxShadow: 10,
            transform: "scale(1.04)",
          },
        },
        "& .swiper-pagination-bullet": {
          backgroundColor: "text.primary",
        },
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "text.primary",
          "&::after": {
            fontSize: { xs: "1rem", md: "2rem" },
          },
        },
        "& .swiper-button-disabled": {
          display: "none",
        },
        "& .swiper": {
          paddingInlineEnd: { xs: "1rem", md: "4rem" },
        },
      }}
    >
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={18}
        grabCursor={true}
        navigation={true}
        modules={[Navigation, Pagination]}
        style={{ width: "100%", height: "max-content" }}
      >
        {children}
      </Swiper>
    </Box>
  );
};

export default NavigationAutoSwiper;
