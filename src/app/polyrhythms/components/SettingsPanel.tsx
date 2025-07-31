"use client";

import React from "react";
import {
    Box,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import TempoControls from "./TempoControls";
import TrackControls from "./TrackControls";
import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";
import { useThemeContext } from "@src/contexts/ThemeContext";
import { RHYTHM_PRESETS } from "../presets";


export default function SettingsPanel() {
    const { state: { tempo, tracks }, dispatch } = usePolyrhythm();
    const { } = useThemeContext();

    return (
        <Box sx={{ p: 2 }}>

            {/* Presets */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Presets
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
                {RHYTHM_PRESETS.map((preset) => (
                    <Button
                        key={preset.name}
                        size="small"
                        variant="outlined"
                        onClick={() => dispatch({ type: "LOAD_PRESET", preset })}
                    >
                        {preset.name}
                    </Button>
                ))}
            </Stack>

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

            {/* Track controls */}
            <Typography variant="subtitle2">Tracks</Typography>
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
