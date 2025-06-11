import { Box, Typography, CircularProgress } from "@mui/material";

const getColor = (value) => {
  if (value <= 5) return "#e53935";      // đỏ
  if (value < 7) return "#fb8c00";      // cam
  return "#00fff0";                    // xanh dương
};

const CircularRate = ({ value }) => {
  // value: 1-10 (của TMDB là 0-10)
  const color = getColor(value);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: "max-content",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={value * 10}
        size={50}
        thickness={5}
        sx={{
          color, // custom màu
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontWeight={700}
          sx={{ marginTop: "-5px" }}
        >
          {Math.floor(value * 10) / 10}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularRate;
