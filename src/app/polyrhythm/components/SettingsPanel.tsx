// src/app/polyrhythm/components/SettingsPanel.tsx
"use client";

import React from "react";
import {
    Box,
    Typography,
} from "@mui/material";
import TempoControls from "./TempoControls";
import TrackControls from "./TrackControls";
import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";
import { useThemeContext } from "@src/contexts/ThemeContext";


export default function SettingsPanel() {
    const { state: { tempo, tracks }, dispatch } = usePolyrhythm();
    const {
    } = useThemeContext();

    return (
        <Box sx={{ p: 2 }}>

            {/* Tempo controls */}
            <Typography variant="subtitle2">Speed Controls</Typography>
            <Box sx={{ my: 2 }}>
                <TempoControls
                    tempo={tempo}
                    onTempoChange={(t) =>
                        dispatch({ type: "CHANGE_TEMPO", tempo: t })
                    }
                />
            </Box>

            <Typography variant="subtitle2">Tracks</Typography>


            {/* Track controls */}
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                {tracks.map((t) => (
                    <TrackControls
                        key={t.index}
                        index={t.index}
                        isActive={t.isActive}
                        isMute={t.isMute}
                        beatNumber={t.beatNumber}
                        sampleName={t.sampleName}
                        onSwitchActive={() =>
                            dispatch({ type: "TOGGLE_ACTIVE", trackIdx: t.index })
                        }
                        onSwitchMute={() =>
                            dispatch({ type: "TOGGLE_MUTE", trackIdx: t.index })
                        }
                        onRotateCW={() =>
                            dispatch({ type: "ROTATE_CW", trackIdx: t.index })
                        }
                        onRotateCCW={() =>
                            dispatch({ type: "ROTATE_CCW", trackIdx: t.index })
                        }
                        onClearRhythm={() =>
                            dispatch({ type: "CLEAR_BEATS", trackIdx: t.index })
                        }
                        onChangeBeatNumber={(n) =>
                            dispatch({
                                type: "CHANGE_BEATNUMBER",
                                trackIdx: t.index,
                                beatNumber: n,
                            })
                        }
                        onChangeSample={(name) =>
                            dispatch({
                                type: "CHANGE_SAMPLE",
                                trackIdx: t.index,
                                sampleName: name,
                            })
                        }
                    />
                ))}
            </Box>
        </Box>
    );
}
