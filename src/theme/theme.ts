import { createTheme } from "@mui/material/styles";

// Extend MUI Palette to include custom chord & keyboard colors
declare module '@mui/material/styles' {
  interface Palette {
    chord: {
      active: string;
      inactive: string;
      shadow: string;
      label: string;
      activeLabel: string;
      iconColor: string;
      activeIconColor: string;
    };
    keyboard: {
      white: string;
      black: string;
      activeWhite: string;
      activeBlack: string;
      whiteContrast: string;
      blackContrast: string;
    };
  }
  interface PaletteOptions {
    chord?: {
      active?: string;
      inactive?: string;
      shadow?: string;
      label?: string;
      activeLabel?: string;
      iconColor?: string;
      activeIconColor?: string;
    };
    keyboard?: {
      white?: string;
      black?: string;
      activeWhite?: string;
      activeBlack?: string;
      whiteContrast?: string;
      blackContrast?: string;
    };
  }
}

export const themes = {
  default: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#4A90E2", light: "#A2D2FF" },
      background: { default: "#f4f6f8", paper: "#ffffff" },
      text: { primary: "#000000" },
      chord: {
        active: "#A2D2FF",
        inactive: "#E1E8F2",
        shadow: "rgba(0,0,0,0.2)",
        label: "#000000",
        activeLabel: "#003049",
        iconColor: "#000000",
        activeIconColor: "#003049",
      },
      keyboard: {
        white: "#ffffff",
        black: "#000000",
        activeWhite: "#A2D2FF",
        activeBlack: "#4A90E2",
        whiteContrast: "#003049",
        blackContrast: "#ffffff",
      },
    },
  }),

  midnight: createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#90caf9", light: "#e3f2fd" },
      background: { default: "#121212", paper: "#1d1d1d" },
      text: { primary: "#eceff1" },
      chord: {
        active: "#212121",
        inactive: "#424242",
        shadow: "rgba(255,255,255,0.1)",
        label: "#eceff1",
        activeLabel: "#b0bec5",
        iconColor: "#eceff1",
        activeIconColor: "#b0bec5",
      },
      keyboard: {
        white: "#444444",
        black: "#000000",
        activeWhite: "#262626",
        activeBlack: "#262626",
        whiteContrast: "#eceff1",
        blackContrast: "#eceff1",
      },
    },
  }),

  solarized: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#268bd2", light: "#83afe5" },
      background: { default: "#fdf6e3", paper: "#eee8d5" },
      text: { primary: "#657b83" },
      chord: {
        active: "#268bd2",
        inactive: "#eee8d5",
        shadow: "rgba(0,43,54,0.2)",
        label: "#657b83",
        activeLabel: "#268bd2",
        iconColor: "#657b83",
        activeIconColor: "#fdf6e3",
      },
      keyboard: {
        white: "#eee8d5",
        black: "#073642",
        activeWhite: "#93a1a1",
        activeBlack: "#268bd2",
        whiteContrast: "#657b83",
        blackContrast: "#fdf6e3",
      },
    },
  }),

  highContrast: createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#ffff00", light: "#ffff66" },
      background: { default: "#000000", paper: "#000000" },
      text: { primary: "#ffffff" },
      chord: {
        active: "#ffff00",
        inactive: "#898989",
        shadow: "rgba(255,255,255,0.3)",
        label: "#ffffff",
        activeLabel: "#ffff00",
        iconColor: "#ffffff",
        activeIconColor: "#000000",
      },
      keyboard: {
        white: "#000000",
        black: "#ffffff",
        activeWhite: "#ffff00",
        activeBlack: "#268bd2",
        whiteContrast: "#000000",
        blackContrast: "#000000",
      },
    },
  }),
};

export type ThemeKey = keyof typeof themes;
