import { createTheme } from "@mui/material/styles";

// Extend MUI Palette to include custom chord colors and icon colors
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
        active: "#A2D2FF",        // softened light blue button background when active
        inactive: "#E1E8F2",      // light grey inactive button background
        shadow: "rgba(0,0,0,0.2)", // soft shadow
        label: "#000000",         // grid label default color
        activeLabel: "#00A0B9",   // grid label when active
        iconColor: "#000000",          // icon default color inside buttons
        activeIconColor: "#003049",    // icon when button active
      }
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
      }
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
        inactive: "#93a1a1",
        shadow: "rgba(0,43,54,0.2)",
        label: "#657b83",
        activeLabel: "#fdf6e3",
        iconColor: "#657b83",
        activeIconColor: "#fdf6e3",
      }
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
        inactive: "#757575",
        shadow: "rgba(255,255,255,0.3)",
        label: "#ffffff",
        activeLabel: "ffff00",
        iconColor: "#ffffff",
        activeIconColor: "#000000",
      }
    },
  }),
};

export type ThemeKey = keyof typeof themes;
