// src/contexts/themeContext.tsx
"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ThemeProvider as MuiThemeProvider, useMediaQuery } from "@mui/material";
import { ThemeKey, themes } from "@src/theme/theme";

interface ThemeContextType {
    currentTheme: ThemeKey;
    setCurrentTheme: (key: ThemeKey) => void;
    themeOptions: ThemeKey[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    // 1) Ask the browser if user prefers dark mode, skip SSR so initial render is "light"
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", { noSsr: true });

    // 2) Compute initial theme key:
    //    - If saved in localStorage, use it
    //    - Otherwise default to "default"
    const [currentTheme, setThemeKey] = useState<ThemeKey>("default");
    const themeOptions = Object.keys(themes) as ThemeKey[];

    // Wrap setter to also persist to localStorage
    function setCurrentTheme(key: ThemeKey) {
        setThemeKey(key);
        if (typeof window !== "undefined") {
            localStorage.setItem("appTheme", key);
        }
    }

    // On mount: load or set default based on preference
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

    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themeOptions }}>
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
