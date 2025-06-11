import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import mediaApi from "../../api/modules/media.api";
import { toast } from "react-toastify";
import MediaItem from "./MediaItem";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { useSelector } from "react-redux";

const MediaSlide = ({ mediaType, mediaCategory }) => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { listFavorites } = useSelector((state) => state.user);

  useEffect(() => {
    setLoading(true);
    const getMedias = async () => {
      const { response, error } = await mediaApi.getList({
        mediaType,
        mediaCategory,
        page: 1,
      });
      if (response) setMedias(response.data.results);
      if (error) toast.error(error.message);
      setLoading(false);
    };
    getMedias();
  }, [mediaType, mediaCategory]);

  useEffect(() => {
    if (medias.length && listFavorites.length) {
      const liked = medias.filter((media) =>
        listFavorites.some(
          (fav) =>
            fav.mediaId.toString() === (media.id || media.mediaId).toString()
        )
      );
    }
  }, [medias, listFavorites]);

  // Lưu lại số slide thực tế
  const slideCount = medias.length;

  return (
    <div className="slide-container-min">
      {/* Nút prev */}
      <IconButton
        ref={prevRef}
        className="slide-nav-btn slide-nav-btn-prev"
        style={{
          visibility: activeIndex === 0 ? "hidden" : "visible",
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 28 }} />
      </IconButton>
      {/* Nút next */}
      <IconButton
        ref={nextRef}
        className="slide-nav-btn slide-nav-btn-next"
        style={{
          visibility: activeIndex === slideCount - 1 ? "hidden" : "visible",
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 28 }} />
      </IconButton>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={"auto"}
        spaceBetween={16}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 120,
          modifier: 2.5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
          setActiveIndex(swiper.activeIndex);
          swiper.on("slideChange", () => {
            setActiveIndex(swiper.activeIndex);
          });
        }}
        style={{ paddingBottom: 32 }}
        breakpoints={{
          320: { slidesPerView: 1.3, spaceBetween: 8 },
          600: { slidesPerView: 2.3, spaceBetween: 12 },
          1024: { slidesPerView: 4.3, spaceBetween: 16 },
        }}
      >
        {loading
          ? Array(5)
              .fill(0)
              .map((_, idx) => (
                <SwiperSlide key={idx}>
                  <Skeleton
                    variant="rounded"
                    width={170}
                    height={250}
                    sx={{ borderRadius: 4, mx: "auto", my: 2 }}
                  />
                </SwiperSlide>
              ))
          : medias.map((media, index) => (
              <SwiperSlide key={index} style={{ padding: "8px 0" }}>
                <div className="media-slide-card-min">
                  <MediaItem media={media} mediaType={mediaType} />
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
      {/* CSS giữ nguyên */}
      <style>
        {`
        .slide-container-min {
          width: 100%;
          margin: 0 auto;
          padding-bottom: 30px;
          position: relative;
          max-width: 1300px;
        }
        .slide-nav-btn {
          position: absolute;
          top: 50%;
          z-index: 12;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #fff;
          color: #00C9A7;
          box-shadow: 0 2px 16px #00c9a733;
          border: 2px solid #00C9A7;
          opacity: 0;
          pointer-events: none;
          transition: all 0.22s cubic-bezier(.4,2,.6,1);
          display: none;
        }
        .slide-nav-btn-prev { left: 8px; transform: translateY(-50%); }
        .slide-nav-btn-next { right: 8px; transform: translateY(-50%); }
        @media (min-width: 900px) {
          .slide-nav-btn { display: flex; align-items: center; justify-content: center; }
          .slide-container-min:hover .slide-nav-btn {
            opacity: 0.95 !important;
            pointer-events: auto !important;
          }
          .slide-nav-btn:hover {
            background: #00C9A7;
            color: #fff;
            box-shadow: 0 0 28px #00C9A7bb;
            border-color: #00C9A7;
            transform: scale(1.09) translateY(-50%);
            opacity: 1 !important;
          }
        }
        .media-slide-card-min {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(40,10,80,0.16), 0 2px 8px rgba(20,0,40,0.10);
          background: #232038;
          transition: transform 0.32s, box-shadow 0.3s;
        }
        .media-slide-card-min:hover {
          transform: scale(1.08) translateY(-6px);
          box-shadow: 0 16px 48px rgba(80,30,160,0.2), 0 4px 28px #ff1f7533;
        }
        `}
      </style>
    </div>
  );
};

export default MediaSlide;
