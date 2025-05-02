// src/app/components/ThemeOptions.tsx
"use client";

import React from "react";
import { Box, Button, ClickAwayListener } from "@mui/material";
import { useThemeContext } from "@src/contexts/ThemeContext";

export default function ThemeOptions() {
    const {
        showThemeOptions,
        toggleThemeOptions,
        themeOptions,
        currentTheme,
        setCurrentTheme,
    } = useThemeContext();

    if (!showThemeOptions) return null;

    return (
        <ClickAwayListener onClickAway={toggleThemeOptions}>
            <Box
                sx={{
                    position: "fixed",
                    bottom: 80,
                    right: 12,
                    zIndex: 1400,
                    bgcolor: "background.paper",
                    boxShadow: 3,
                    borderRadius: 1,
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {themeOptions.map((mode) => (
                    <Button
                        key={mode}
                        variant={mode === currentTheme ? "contained" : "outlined"}
                        size="small"
                        onClick={() => {
                            setCurrentTheme(mode);
                            toggleThemeOptions();
                        }}
                    >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                ))}
            </Box>
        </ClickAwayListener>
    );
}
