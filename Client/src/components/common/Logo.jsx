import { Typography, useTheme } from "@mui/material";
import React from "react";

const Logo = ({ fontSize = "1.7rem" }) => {
  const theme = useTheme();
  return (
    <Typography fontWeight="700" fontSize={fontSize}>
      Strea<span style={{ color: theme.palette.primary.main }}>Mix</span>
    </Typography>
  );
};

export default Logo;
