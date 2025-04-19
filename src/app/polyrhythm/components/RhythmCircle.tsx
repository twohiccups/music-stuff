// components/RhythmCircle.tsx
"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";

interface Beat { isOn: boolean }
interface Track { beats: Beat[] }

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
    const trackCount = activeTracks.length;

    // percentage step so rings don't touch edge
    const ringStep = 50 / (trackCount + 1);

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "min(100vw, 100vh)",   // never wider than the smaller viewport dimension
                aspectRatio: "1 / 1",             // always square
                position: "relative",
                mx: "auto",
            }}
        >
            {activeTracks.map((track, ti) =>
                track.beats.map((beat, bi) => {
                    const angle = (2 * Math.PI * bi) / lcm;
                    const radiusPct = (ti + 1) * ringStep;
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
                            key={`${ti}-${bi}`}
                            component="span"
                            onClick={() => onToggleBeat(ti, bi)}
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
                            }}
                        />
                    );
                })
            )}
        </Box>
    );
}
