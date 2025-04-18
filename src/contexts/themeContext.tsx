// src/contexts/themeContext.tsx
"use client";

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { ThemeKey, themes } from "@src/theme/theme";

interface ThemeContextType {
    current: ThemeKey;
    setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    // 1) Ask the browser (only on client) if the user prefers dark mode,
    //    but skip SSR so initial render is always "light"
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", {
        noSsr: true,
    });

    // 2) Compute our initial theme key:
    //    - If there's a saved value in localStorage, use it
    //    - Otherwise, always start as "default" on both SSR & first render
    const initialTheme: ThemeKey = (() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("appTheme") as ThemeKey | null;
            if (stored && themes[stored]) {
                return stored;
            }
        }
        return "default";
    })();

    const [current, setCurrent] = useState<ThemeKey>(initialTheme);

    // 3) After hydration, if the user hasn't explicitly chosen (no saved key),
    //    update to match the real prefers-color-scheme
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (localStorage.getItem("appTheme")) return; // user already has a preference
        setCurrent(prefersDark ? "midnight" : "default");
    }, [prefersDark]);

    return (
        <ThemeContext.Provider value={{ current, setTheme: setCurrent }}>
            <ThemeProvider theme={themes[current]}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error(
            "useThemeContext must be used within a ThemeContextProvider"
        );
    }
    return ctx;
}
