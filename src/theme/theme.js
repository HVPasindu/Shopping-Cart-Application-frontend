// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#28DF99",
    },
    secondary: {
      main: "#99F3BD",
    },
    background: {
      default: "#f7fbff",
      paper: "#F6F7D4",
    },
    text: {
      primary: "#1f2937",
      secondary: "#4b5563",
    },
  },
  typography: {
    fontFamily: `"Inter", "Arial", sans-serif`,
  },
  shape: {
    borderRadius: 14,
  },
});

export default theme;