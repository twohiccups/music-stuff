import { createTheme } from "@mui/material/styles";



export const themes = {
  default: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#4A90E2", light: "#A2D2FF" },
      background: { default: "#f4f6f8", paper: "#ffffff" },
      text: { primary: "#000000" },
    },
  }),

  midnight: createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
        light: "#e3f2fd",
      },
      background: { default: "#121212", paper: "#1d1d1d" },
      text: { primary: "#eceff1" },
    },
  }),

  solarized: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#268bd2", light: "#83afe5" },
      background: { default: "#fdf6e3", paper: "#eee8d5" },
      text: { primary: "#657b83" },
    },
  }),

  highContrast: createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#ffff00", light: "#ffff66" },
      background: { default: "#000000", paper: "#000000" },
      text: { primary: "#ffffff" },
    },
  }),
};


export type ThemeKey = keyof typeof themes;


