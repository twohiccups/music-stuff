// src/app/polyrhythm/components/SettingsPanel.tsx
"use client";

import React from "react";
import {
    Box,
    IconButton,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TempoControls from "./TempoControls";
import TrackControls from "./TrackControls";
import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";
import { useThemeContext } from "@src/contexts/ThemeContext";

interface SettingsPanelProps {
    onClose(): void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
    const { state: { tempo, tracks }, dispatch } = usePolyrhythm();
    const {
        currentTheme,
        setCurrentTheme,
        themeOptions,
    } = useThemeContext();

    return (
        <Box sx={{ width: 300, p: 2 }}>
            {/* Close button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Tempo controls */}
            <Box sx={{ my: 2 }}>
                <TempoControls
                    tempo={tempo}
                    onTempoChange={(t) =>
                        dispatch({ type: "CHANGE_TEMPO", tempo: t })
                    }
                />
            </Box>

            <Divider />

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

            <Divider sx={{ my: 2 }} />

            {/* Theme picker */}
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    Theme
                </Typography>
                <ToggleButtonGroup
                    value={currentTheme}
                    exclusive
                    onChange={(_, val) => val && setCurrentTheme(val)}
                    size="small"
                    sx={{ flexWrap: "wrap", gap: 1 }}
                >
                    {themeOptions.map((mode) => (
                        <ToggleButton key={mode} value={mode}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>
        </Box>
    );
}
