// theme.js

import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance
export const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#720455",
      fontFamily: "Heebo, sans-serif",
    },
    secondary: {
      main: "#424769",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "Heebo, sans-serif",
  },
});
