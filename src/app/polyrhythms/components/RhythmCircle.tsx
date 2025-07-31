// components/RhythmCircle.tsx
"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";

export interface Beat { isOn: boolean; }
export interface Track {
    index: number;
    beats: Beat[];      // now full length = global LCM
    isActive: boolean;
    isMute: boolean;
}

interface Props {
    activeTracks: Track[];
    currentBeatIndex: number;
    lcm: number;
    onToggleBeat: (trackIdx: number, globalStep: number) => void;
}

export default function RhythmCircle({
    activeTracks,
    currentBeatIndex,
    lcm,
    onToggleBeat,
}: Props) {
    const theme = useTheme();
    const ringStep = 50 / (activeTracks.length + 1);

    return (
        <Box
            sx={{
                width: "100%",
                aspectRatio: "1 / 1",
                position: "relative",
                mx: "auto",
                px: { xs: 2, sm: 3, md: 0 }, // padding on small screens
                maxWidth: { md: "min(100vw, 100vh)" },
            }}
        >
            {activeTracks.map((track, ti) =>
                // now each track.beats.length === lcm
                track.beats.map((beat, i) => {
                    const angle = (2 * Math.PI * i) / lcm;
                    const radiusPct = (ti + 1) * ringStep;
                    const xPct = 50 + radiusPct * Math.sin(angle);
                    const yPct = 50 - radiusPct * Math.cos(angle);

                    const isCurrent = i === currentBeatIndex;
                    const diameter = beat.isOn ? "8%" : "4%";
                    const bgColor = isCurrent
                        ? theme.palette.primary.main
                        : beat.isOn
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary;
                    const borderW = isCurrent ? 3 : 1;

                    return (
                        <Box
                            key={`t${track.index}-s${i}`}
                            component="span"
                            onClick={() =>
                                track.isActive && onToggleBeat(track.index, i)
                            }
                            sx={{
                                position: "absolute",
                                top: `${yPct}%`,
                                left: `${xPct}%`,
                                width: diameter,
                                height: diameter,
                                borderRadius: "50%",
                                bgcolor: bgColor,
                                border: `${borderW}px solid ${theme.palette.text.primary}`,
                                transform: "translate(-50%,-50%)",
                                cursor: track.isActive ? "pointer" : "default",
                                opacity: track.isActive ? 1 : 0.3,
                                transition: "all 0.2s ease",
                                "&:active": {
                                    transform:
                                        "translate(-50%,-50%) scale(0.9)",
                                },
                            }}
                        />
                    );
                })
            )}
        </Box>
    );
}
