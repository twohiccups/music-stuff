// src/app/polyrhythm/components/PolyrhythmCanvas.tsx
"use client";

import React from "react";
import { Box } from "@mui/material";
import RhythmCircle from "./RhythmCircle";
import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";

export default function PolyrhythmCanvas() {
    const { state: { tracks, currentBeat, lcm }, dispatch } = usePolyrhythm();
    const active = tracks.filter(t => t.isActive);

    return (
        <Box sx={{ mt: 3 }}>
            <RhythmCircle
                activeTracks={active}
                currentBeatIndex={currentBeat}
                lcm={lcm}
                onToggleBeat={(ti, step) => dispatch({ type: "TOGGLE_BEAT", trackIdx: ti, step })}
            />
        </Box>
    );
}
