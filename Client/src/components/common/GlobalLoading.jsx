import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";
import Logo from "./Logo.jsx";

const GlobalLoading = () => {
  const { globalLoading } = useSelector((state) => state.globalLoading);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout;
    if (globalLoading) {
      setShow(true);
    } else {
      timeout = setTimeout(() => setShow(false), 260);
    }
    return () => clearTimeout(timeout);
  }, [globalLoading]);

  return (
    <Fade in={show} timeout={400} unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 1300,
          top: 0,
          left: 0,
          bgcolor: "rgba(17,22,37,0.93)",
          backdropFilter: "blur(3px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .3s cubic-bezier(.4,2.5,.5,.9)",
        }}
      >
        {/* Logo cực to */}
        <Box sx={{ mb: 5 }}>
          <Logo fontSize="2.5rem" />
        </Box>
        {/* Vòng loading cực to */}
        <CircularProgress
          size={140}
          thickness={6}
          sx={{
            color: "primary.main",
            mb: 4,
          }}
        />
        {/* Loading text rõ ràng */}
        <Typography
          variant="h5"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            letterSpacing: 1.2,
            mb: 2,
            mt: 0,
            userSelect: "none",
          }}
        >
          Đang tải...
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#b8c7d2",
            opacity: 0.8,
            letterSpacing: 1,
            mb: 3,
            userSelect: "none",
          }}
        >
          Vui lòng chờ trong giây lát
        </Typography>
        {/* Mô tả website bên dưới, tối giản */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#e0e4ed",
            opacity: 0.9,
            letterSpacing: 0.5,
            maxWidth: 500,
            lineHeight: 1.7,
            fontSize: 14,
            px: 2,
            mt: 2,
            userSelect: "none",
          }}
        >
          Xem phim miễn phí với trải nghiệm chất lượng cao, tốc độ nhanh, không quảng cáo gây phiền nhiễu.  
          Kho phim được cập nhật liên tục với đủ thể loại.
        </Typography>
      </Box>
    </Fade>
  );
};

export default GlobalLoading;
