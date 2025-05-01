// src/app/polyrhythm/components/SettingsPanel.tsx
"use client";

import React from "react";
import { Box, IconButton } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import TempoControls from "./TempoControls";
import TrackControls from "./TrackControls";
import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";

export default function SettingsPanel({ onClose }: { onClose(): void }) {
    const { state: { tempo, tracks }, dispatch } = usePolyrhythm();

    return (
        <Box sx={{
            p: 2, pb: 0, display: "flex", flexDirection: "column", gap: 2
        }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <TempoControls
                    tempo={tempo}
                    onTempoChange={t => dispatch({ type: "CHANGE_TEMPO", tempo: t })}
                />
                <IconButton onClick={onClose}>
                    <PauseIcon />
                </IconButton>
            </Box>

            {
                tracks.map(t => (
                    <TrackControls
                        key={t.index}
                        {...t}
                        onSwitchActive={() => dispatch({ type: "TOGGLE_ACTIVE", trackIdx: t.index })}
                        onSwitchMute={() => dispatch({ type: "TOGGLE_MUTE", trackIdx: t.index })}
                        onRotateCW={() => dispatch({ type: "ROTATE_CW", trackIdx: t.index })}
                        onRotateCCW={() => dispatch({ type: "ROTATE_CCW", trackIdx: t.index })}
                        onClearRhythm={() => dispatch({ type: "CLEAR_BEATS", trackIdx: t.index })}
                        onChangeBeatNumber={n => dispatch({ type: "CHANGE_BEATNUMBER", trackIdx: t.index, beatNumber: n })}
                        onChangeSample={name => dispatch({ type: "CHANGE_SAMPLE", trackIdx: t.index, sampleName: name })}
                    />
                ))
            }
        </Box >
    );
}
