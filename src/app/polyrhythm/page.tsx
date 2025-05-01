// src/app/SequencerPage.tsx
"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import {
    Box,
    IconButton,
    Drawer,
    Modal,
    SpeedDial,
    SpeedDialAction,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { PolyrhythmProvider, usePolyrhythm } from "@src/contexts/polyrhythmContext";
import TempoControls from "./components/TempoControls";
import RhythmCircle from "./components/RhythmCircle";
import TrackControls from "./components/TrackControls";

const Sequencer: React.FC = () => {
    const { state, dispatch } = usePolyrhythm();
    const { tracks, currentBeat, lcm, tempo } = state;
    const [isPlaying, setIsPlaying] = useState(true);

    // Drawer (desktop) & Modal (mobile) open state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const togglePlay = () => {
        if (isPlaying) Tone.Transport.pause();
        else Tone.Transport.start();
        setIsPlaying(!isPlaying);
    };

    const handleCloseSettings = () => {
        setDrawerOpen(false);
        setMobileOpen(false);
    };

    const settingsPanel = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                // width for md+, but xs is ignored here (Modal wrapper will size)
            }}
        >
            {/* Header of settings: tempo + close */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <TempoControls
                    tempo={tempo}
                    onTempoChange={(val) => dispatch({ type: "CHANGE_TEMPO", tempo: val })}
                />
                <IconButton onClick={handleCloseSettings}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* All your track controls */}
            {tracks.map((t) => (
                <TrackControls
                    key={t.index}
                    index={t.index}
                    isActive={t.isActive}
                    isMute={t.isMute}
                    beatNumber={t.beatNumber}
                    sampleName={t.sampleName}
                    onSwitchActive={() => dispatch({ type: "TOGGLE_ACTIVE", trackIdx: t.index })}
                    onSwitchMute={() => dispatch({ type: "TOGGLE_MUTE", trackIdx: t.index })}
                    onRotateCW={() => dispatch({ type: "ROTATE_CW", trackIdx: t.index })}
                    onRotateCCW={() => dispatch({ type: "ROTATE_CCW", trackIdx: t.index })}
                    onClearRhythm={() => dispatch({ type: "CLEAR_BEATS", trackIdx: t.index })}
                    onChangeBeatNumber={(n) =>
                        dispatch({ type: "CHANGE_BEATNUMBER", trackIdx: t.index, beatNumber: n })
                    }
                    onChangeSample={(name) =>
                        dispatch({ type: "CHANGE_SAMPLE", trackIdx: t.index, sampleName: name })
                    }
                />
            ))}
        </Box>
    );

    return (
        <Box sx={{ width: "100%" }}>
            {/* Play/Pause + Settings toggle */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton onClick={togglePlay} aria-label="Play/Pause">
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>

                {/* Desktop: open drawer */}
                <IconButton
                    onClick={() => setDrawerOpen((o) => !o)}
                    sx={{ ml: 2, display: { xs: "none", md: "inline-flex" } }}
                >
                    <SettingsIcon />
                </IconButton>
            </Box>

            {/* Desktop: persistent left drawer */}
            <Drawer
                anchor="left"
                variant="persistent"
                open={drawerOpen}
                sx={{
                    display: { xs: "none", md: "block" },
                }}
            >
                {settingsPanel}
            </Drawer>

            {/* Mobile: speed dial */}
            <SpeedDial
                ariaLabel="Settings"
                icon={<SettingsIcon />}
                direction="up"
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    display: { xs: "flex", md: "none" },
                }}
            >
                <SpeedDialAction
                    icon={<SettingsIcon />}
                    tooltipTitle="Settings"
                    onClick={() => setMobileOpen(true)}
                />
            </SpeedDial>

            {/* Mobile: modal */}
            <Modal
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                aria-labelledby="mobile-settings-modal"
            >
                <Box
                    sx={{
                        display: { xs: "block", md: "none" },
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxHeight: "80%",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: 2,
                        overflowY: "auto",
                    }}
                >
                    {settingsPanel}
                </Box>
            </Modal>

            {/* Rhythm visualizer */}
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
        </Box>
    );
};

const SequencerPage: React.FC = () => (
    <PolyrhythmProvider>
        <Sequencer />
    </PolyrhythmProvider>
);

export default SequencerPage;
