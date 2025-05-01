// src/app/polyrhythm/page.tsx
"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import { Box, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import InfoIcon from "@mui/icons-material/Info";

import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";
import { PageActionsProvider } from "@src/contexts/PageActionsContext";

import SidePanelLayout from "@app/components/SidePanelLayout";
import ActionMenu from "@app/components/ActionMenu";
import InfoDialog from "@app/polyrhythm/components/InfoDialog";
import TempoControls from "@app/polyrhythm/components/TempoControls";
import TrackControls from "@app/polyrhythm/components/TrackControls";
import RhythmCircle from "@app/polyrhythm/components/RhythmCircle";

import type { Action } from "@src/types/types";

export default function PolyrhythmPage() {
    // — all hook usage lives here —
    const { state, dispatch } = usePolyrhythm();
    const { tracks, currentBeat, lcm, tempo } = state;

    // play/pause button state
    const [isPlaying, setIsPlaying] = useState(true);
    const togglePlay = () => {
        if (isPlaying) Tone.Transport.pause();
        else Tone.Transport.start();
        setIsPlaying(!isPlaying);
    };

    // Info dialog state
    const [infoOpen, setInfoOpen] = useState(false);

    // Page‐specific "Info" action
    const pageActions: Action[] = [
        { name: "Info", icon: <InfoIcon />, onClick: () => setInfoOpen(true) },
    ];

    // Header render-prop
    const header = (
        <IconButton onClick={togglePlay} aria-label="Play/Pause">
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
    );

    // Settings panel render-prop
    const settingsPanel = ({ onClose }: { onClose: () => void }) => (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <TempoControls
                    tempo={tempo}
                    onTempoChange={(t) => dispatch({ type: "CHANGE_TEMPO", tempo: t })}
                />
                <IconButton onClick={onClose}>
                    <PauseIcon />
                </IconButton>
            </Box>

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
    );

    return (
        <PageActionsProvider actions={pageActions}>
            <SidePanelLayout header={header} panel={settingsPanel}>
                {/* Info modal */}
                <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />

                {/* Main visualizer */}
                <Box sx={{ mt: 3 }}>
                    <RhythmCircle
                        activeTracks={tracks.filter((t) => t.isActive)}
                        currentBeatIndex={currentBeat}
                        lcm={lcm}
                        onToggleBeat={(ti, step) =>
                            dispatch({ type: "TOGGLE_BEAT", trackIdx: ti, step })
                        }
                    />
                </Box>

                {/* Floating actions */}
                <ActionMenu />
            </SidePanelLayout>
        </PageActionsProvider>
    );
}
