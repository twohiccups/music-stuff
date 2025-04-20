"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";

export interface Beat { isOn: boolean; }

// (We only need the index if you want to map back to your trackControls,
//  but layout uses the position in the active array to space the rings.)
export interface Track {
    index: number;
    beats: Beat[];
}

interface Props {
    activeTracks: Track[];
    currentBeatIndex: number;
    lcm: number;
    onToggleBeat: (trackIdx: number, beatIdx: number) => void;
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
                maxWidth: "min(100vw, 100vh)",
                aspectRatio: "1 / 1",
                position: "relative",
                mx: "auto",
            }}
        >
            {activeTracks.map((track, trackIdx) =>
                track.beats.map((beat, bi) => {
                    const angle = (2 * Math.PI * bi) / lcm;
                    const radiusPct = (trackIdx + 1) * ringStep;
                    const xPct = 50 + radiusPct * Math.sin(angle);
                    const yPct = 50 - radiusPct * Math.cos(angle);

                    const diameter = beat.isOn ? "8%" : "4%";
                    const isCurrent = bi === currentBeatIndex;
                    const bgColor = isCurrent
                        ? theme.palette.primary.main
                        : beat.isOn
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary;
                    const borderW = isCurrent ? 3 : 1;

                    return (
                        <Box
                            key={`${track.index}-${bi}`}
                            component="span"
                            onClick={() => onToggleBeat(track.index, bi)}
                            sx={{
                                position: "absolute",
                                top: `${yPct}%`,
                                left: `${xPct}%`,
                                width: diameter,
                                height: diameter,
                                borderRadius: "50%",
                                bgcolor: bgColor,
                                border: `${borderW}px solid ${theme.palette.text.primary}`,
                                transform: "translate(-50%, -50%)",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                p: "4px",
                                "&:active": {
                                    transform: "translate(-50%, -50%) scale(0.9)",
                                },
                            }}
                        />
                    );
                })
            )}
        </Box>
    );
}
