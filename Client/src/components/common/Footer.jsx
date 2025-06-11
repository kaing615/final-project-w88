import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import Container from "./Container";
import React from "react";
import Logo from "./Logo";
import menuConfigs from "../../configs/menu.configs";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

const socialLinks = [
  { icon: <FacebookIcon />, url: "https://facebook.com" },
  { icon: <YouTubeIcon />, url: "https://youtube.com" },
  { icon: <GitHubIcon />, url: "https://github.com" },
  { icon: <TwitterIcon />, url: "https://twitter.com" },
];

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        width: "100%",
        position: "relative",
        mt: 8,
        boxShadow: isDark
          ? "0 -2px 20px 0 rgba(0,0,0,0.2)"
          : "0 -2px 20px 0 rgba(0,0,0,0.06)",
        borderTop: isDark
          ? "1px solid #23242A"
          : `1px solid ${theme.palette.divider}`,
        transition: "background .25s, color .25s",
      }}
    >
      <Container>
        <Box
          sx={{
            borderRadius: "24px",
            bgcolor: isDark
              ? theme.palette.background.paper
              : theme.palette.grey[50],
            px: { xs: 2, md: 6 },
            py: { xs: 4, md: 5 },
            mb: 2,
            boxShadow: isDark
              ? "0 4px 32px 0 rgba(0,0,0,0.12)"
              : "0 2px 10px 0 rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: { xs: 4, md: 0 },
            transition: "background .25s",
          }}
        >
          {/* Left: Logo + Desc + Social */}
          <Box sx={{ minWidth: 250, maxWidth: 370 }}>
            <Logo />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: 1,
                mb: 2,
                fontSize: 15,
                lineHeight: 1.5,
                width: "100%",
                maxWidth: 700,
                transition: "color .25s",
              }}
            >
              Xem phim miễn phí với trải nghiệm chất lượng cao, tốc độ nhanh, không quảng cáo gây phiền nhiễu. Kho phim được cập nhật liên tục với đầy đủ thể loại từ điện ảnh Việt đến bom tấn Hollywood, anime, TV series và nhiều hơn nữa.<br /><br />
              Kết nối cộng đồng yêu phim, chia sẻ cảm xúc, đánh giá và khám phá những bộ phim hot cùng StreaMix. Chúng tôi cam kết mang đến môi trường giải trí trực tuyến an toàn, thân thiện và hiện đại cho mọi lứa tuổi.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((item, idx) => (
                <IconButton
                  key={idx}
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: theme.palette.text.secondary,
                    background: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(30,32,40,0.04)",
                    transition: "all .2s",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      background: isDark
                        ? "rgba(25,118,210,0.17)"
                        : "rgba(25,118,210,0.09)",
                    },
                  }}
                  size="medium"
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Right: Menu */}
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            flexWrap="wrap"
            justifyContent={{ xs: "center", md: "flex-end" }}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            {menuConfigs.main.map((item, index) => (
              <Button
                key={index}
                component={Link}
                to={item.path}
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: 17,
                  borderRadius: 2,
                  px: 2,
                  textTransform: "uppercase",
                  "&:hover": {
                    background: isDark
                      ? "rgba(0,200,167,0.10)"
                      : "rgba(0,150,135,0.06)",
                    color: theme.palette.primary.main,
                  },
                  transition: "color .22s, background .22s",
                }}
              >
                {item.display}
              </Button>
            ))}
          </Stack>
        </Box>
        {/* Copyright */}
        <Typography
          variant="caption"
          align="center"
          display="block"
          color={theme.palette.text.secondary}
          sx={{
            pb: 1,
            letterSpacing: 1.2,
            fontSize: 13,
            transition: "color .25s",
          }}
        >
          © {new Date().getFullYear()} <b>StreaMix</b>. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
