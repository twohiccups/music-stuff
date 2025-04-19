"use client";

import React, { useState } from "react";
import {
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Box,
    useTheme,
} from "@mui/material";
import {
    Settings as SettingsIcon,
    Info as InfoIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import PaletteIcon from "@mui/icons-material/Palette";
import { useThemeContext } from "@src/contexts/themeContext";

interface QuickActionsDialProps {
    onOpenSettings: () => void;
}

export default function QuickActionsDial({ onOpenSettings }: QuickActionsDialProps) {
    const theme = useTheme();
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const { setCurrentTheme, themeOptions } = useThemeContext();

    const quickActions = [
        {
            name: "Settings",
            icon: <SettingsIcon />,
            onClick: onOpenSettings,
        },
        {
            name: "Info",
            icon: <InfoIcon />,
            onClick: () =>
                alert("This is a chord player. Choose a chord and hear how it sounds."),
        },
    ];

    return (
        <>
            {showThemeOptions && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: { xs: 80, md: 100 },
                        right: 12,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        flexWrap: "wrap",
                        gap: 1,
                        zIndex: 1300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        p: 1,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",

                        // mobile constraints
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
                                setShowThemeOptions(false);
                            }}
                            sx={{
                                // full‐width pills on mobile, auto‐width on desktop
                                width: { xs: "100%", md: "auto" },
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                cursor: "pointer",
                                fontWeight: 500,
                                textTransform: "capitalize",
                                textAlign: "center",
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
            >
                {quickActions.map(({ name, icon, onClick }) => (
                    <SpeedDialAction key={name} icon={icon} onClick={onClick} />
                ))}

                <SpeedDialAction
                    icon={<PaletteIcon />}
                    onClick={() => setShowThemeOptions((prev) => !prev)}
                />
            </SpeedDial>
        </>
    );
}
