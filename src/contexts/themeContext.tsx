// src/contexts/themeContext.tsx
"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ThemeProvider as MuiThemeProvider, useMediaQuery } from "@mui/material";
import { ThemeKey, themes } from "@src/theme/theme";

// 1. Extend context type to include theme-picker controls
interface ThemeContextType {
  currentTheme: ThemeKey;
  setCurrentTheme: (key: ThemeKey) => void;
  themeOptions: ThemeKey[];
  showThemeOptions: boolean;
  toggleThemeOptions: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  // Detect user preference (skip SSR) and manage theme key
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", { noSsr: true });

  // 2. currentTheme state persisted to localStorage
  const [currentTheme, setThemeKey] = useState<ThemeKey>("default");
  const themeOptions = Object.keys(themes) as ThemeKey[];

  function setCurrentTheme(key: ThemeKey) {
    setThemeKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("appTheme", key);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("appTheme") as ThemeKey | null;
    if (stored && themes[stored]) {
      setThemeKey(stored);
    } else {
      const scheme: ThemeKey = prefersDark ? "midnight" : "default";
      setThemeKey(scheme);
      localStorage.setItem("appTheme", scheme);
    }
  }, [prefersDark]);

  // 3. New state for theme-picker visibility
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const toggleThemeOptions = () => setShowThemeOptions(open => !open);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        themeOptions,
        showThemeOptions,
        toggleThemeOptions,
      }}
    >
      <MuiThemeProvider theme={themes[currentTheme]}>  
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within a ThemeContextProvider");
  return ctx;
}
