// components/QuickActionsDial.tsx
"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import {
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Box,
    useTheme,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import { useThemeContext } from "@src/contexts/themeContext";
import { useCommonActionsContext } from "@src/contexts/commonActionsContext";
import { usePageActionsContext } from "@src/contexts/pageActionsContext";
import { Action } from "@src/types/types";

export default function QuickActionsDial() {
    const theme = useTheme();
    const {
        currentTheme,
        setCurrentTheme,
        themeOptions,
        showThemeOptions,
        toggleThemeOptions,
    } = useThemeContext();

    const optionsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!showThemeOptions) return;
        const handle = (e: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
                toggleThemeOptions();
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [showThemeOptions, toggleThemeOptions]);

    const common = useCommonActionsContext(); // includes Info & Theme
    const page = usePageActionsContext();

    // merge & dedupe
    const merged: Record<string, Action> = [...common, ...page].reduce((acc, a) => {
        acc[a.name] = a;
        return acc;
    }, {} as Record<string, Action>);
    const actions = Object.values(merged);

    // helper to wrap icons
    const WrapIcon = (icon: ReactNode) => (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {icon}
        </Box>
    );

    return (
        <>
            {showThemeOptions && (
                <Box
                    ref={optionsRef}
                    sx={{
                        position: "fixed",
                        bottom: { xs: 80, md: 100 },
                        right: 12,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        flexWrap: "wrap",
                        gap: 1,
                        zIndex: 1300,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                        p: 1,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        maxWidth: { xs: "90vw", md: "auto" },
                        maxHeight: { xs: "70vh", md: "auto" },
                        overflowY: { xs: "auto", md: "visible" },
                    }}
                >
                    {themeOptions.map((mode) => (
                        <Box
                            key={mode}
                            onClick={() => {
                                setCurrentTheme(mode);
                                toggleThemeOptions();
                            }}
                            sx={{
                                width: { xs: "100%", md: "auto" },
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                cursor: "pointer",
                                fontWeight: 500,
                                textTransform: "capitalize",
                                textAlign: "center",
                                borderBottom:
                                    currentTheme === mode ? "3px solid grey" : undefined,
                            }}
                        >
                            {mode}
                        </Box>
                    ))}
                </Box>
            )}

            <SpeedDial
                ariaLabel="Quick actions"
                icon={<SpeedDialIcon icon={<MenuIcon />} openIcon={<CloseIcon />} />}
                sx={{
                    position: "fixed",
                    bottom: { xs: 12, md: 30 },
                    right: 12,
                    zIndex: 1200,
                }}
                direction="up"
            >
                {actions.map(({ name, icon, onClick, mobileOnly }) => (
                    <SpeedDialAction
                        key={name}
                        icon={WrapIcon(icon)}
                        onClick={onClick}
                        slotProps={{
                            fab: {
                                sx: {
                                    // you can still target the FAB here if needed
                                    // but the wrapper ensures perfect centering
                                },
                            },
                            tooltip: {
                                title: name,
                                placement: "left",
                            },
                        }}
                        sx={{
                            display: mobileOnly
                                ? { xs: "block", md: "none" }
                                : { xs: "block", md: "block" },
                        }}
                    />
                ))}
            </SpeedDial>
        </>
    );
}
