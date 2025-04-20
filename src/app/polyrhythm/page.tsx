"use client";

import React from "react";
import { Box, Button, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import TrackControls from "@app/polyrhythm/components/TrackControls";
import TempoControls from "@app/polyrhythm/components/TempoControls";
import RhythmCircle from "@app/polyrhythm/components/RhythmCircle";
import {
    PolyrhythmProvider,
    usePolyrhythm,
    Track,
} from "@src/contexts/polyrhythmContext";

export default function PolyrhythmPage() {
    return (
        <PolyrhythmProvider>
            <PolyrhythmPageContent />
        </PolyrhythmProvider>
    );
}

function PolyrhythmPageContent() {
    const {
        tracks,
        tempo,
        isPlaying,
        currentBeatIndex,
        globalLCM,
        togglePlay,
        setTempo,
        addTrack,
        toggleActiveTrack,
        toggleMuteTrack,
        changeBeatNumber,
        rotateTrack,
        clearTrack,
        toggleBeat,
    } = usePolyrhythm();

    const atMaxTracks = tracks.length >= 4;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* CONTROLS */}
            <Box
                component="aside"
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    gap: 2,
                    borderRight: { xs: "none", md: 1 },
                    borderColor: "divider",
                    overflow: "hidden",
                }}
            >
                <Typography variant="h6" align="center">
                    Controls
                </Typography>

                {/* Tempo + Play/Pause */}
                <TempoControls tempo={tempo} onTempoChange={setTempo} />
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="contained" fullWidth onClick={togglePlay}>
                        {isPlaying ? "Pause" : "Play"}
                    </Button>
                </Box>

                {/* Add Track */}
                <Fab
                    size="small"
                    color="primary"
                    onClick={addTrack}
                    disabled={atMaxTracks}
                    sx={{ alignSelf: "center" }}
                >
                    <AddIcon />
                </Fab>
                {atMaxTracks && (
                    <Typography variant="caption" align="center" color="text.secondary">
                        Max 4 tracks
                    </Typography>
                )}

                {/* Track list */}
                <Box sx={{ flex: 1, overflowY: "auto", pt: 1 }}>
                    <Grid container spacing={2}>
                        {tracks.map((t: Track) => (
                            <Grid key={t.index}>
                                <TrackControls
                                    index={t.index}
                                    isActive={t.isActive}
                                    isMute={t.isMute}
                                    beatNumber={t.beatNumber}
                                    onSwitchActive={() => toggleActiveTrack(t.index)}
                                    onSwitchMute={() => toggleMuteTrack(t.index)}
                                    onChangeBeatNumber={(val) =>
                                        changeBeatNumber(t.index, val)
                                    }
                                    onRotateCW={() => rotateTrack(t.index, "CW")}
                                    onRotateCCW={() => rotateTrack(t.index, "CCW")}
                                    onClearRhythm={() => clearTrack(t.index)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            {/* VISUALIZER */}
            <Box
                component="main"
                sx={{
                    flex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    overflow: "hidden",
                }}
            >
                <RhythmCircle
                    activeTracks={tracks.filter((t) => t.isActive)}
                    currentBeatIndex={currentBeatIndex}
                    lcm={globalLCM}
                    onToggleBeat={(trackIdx, beatIdx) =>
                        toggleBeat(trackIdx, beatIdx)
                    }
                />
            </Box>
        </Box>
    );
}
