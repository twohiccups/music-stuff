"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    BottomNavigation,
    BottomNavigationAction,
    Grid,
} from "@mui/material";
import WavesIcon from "@mui/icons-material/Waves";
import SettingsIcon from "@mui/icons-material/Settings";
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



    const [mobileNav, setMobileNav] = useState<"vis" | "ctrl">("vis");

    const {
        tracks,
        tempo,
        isPlaying,
        currentBeatIndex,
        globalLCM,
        togglePlay,
        setTempo,
        toggleActiveTrack,
        toggleMuteTrack,
        changeBeatNumber,
        rotateTrack,
        clearTrack,
        toggleBeat,
    } = usePolyrhythm();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* Controls Panel */}
            <Box
                component="aside"
                sx={{
                    display: {
                        xs: mobileNav === "ctrl" ? "flex" : "none",
                        md: "flex",
                    },
                    flexDirection: "column",
                    p: 2,
                    gap: 2,
                    height: "100%",
                    overflowY: "auto",
                    borderRight: { md: 1 },
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    flex: { md: 1 },
                }}
            >
                <Typography variant="h6" align="center">
                    Controls
                </Typography>
                <TempoControls tempo={tempo} onTempoChange={setTempo} />
                <Button variant="contained" fullWidth onClick={togglePlay}>
                    {isPlaying ? "Pause" : "Play"}
                </Button>
                <Box sx={{ flex: 1, pt: 1 }}>
                    <Grid container spacing={2}>
                        {tracks.map((t: Track) => (
                            <Grid size={12} key={t.index}>
                                <TrackControls
                                    index={t.index}
                                    isActive={t.isActive}
                                    isMute={t.isMute}
                                    beatNumber={t.beatNumber}
                                    onSwitchActive={() => toggleActiveTrack(t.index)}
                                    onSwitchMute={() => toggleMuteTrack(t.index)}
                                    onChangeBeatNumber={(val) => changeBeatNumber(t.index, val)}
                                    onRotateCW={() => rotateTrack(t.index, "CW")}
                                    onRotateCCW={() => rotateTrack(t.index, "CCW")}
                                    onClearRhythm={() => clearTrack(t.index)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            {/* Visualizer Panel */}
            <Box
                component="main"
                sx={{
                    display: {
                        xs: mobileNav === "vis" ? "flex" : "none",
                        md: "flex",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    overflow: "hidden",
                    bgcolor: "background.default",
                    flex: { xs: 1, md: 2 },
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

            {/* Bottom Navigation (mobile only) */}
            <BottomNavigation
                value={mobileNav}
                onChange={(_, val) => setMobileNav(val)}
                showLabels
                sx={{ display: { xs: "flex", md: "none" } }}
            >
                <BottomNavigationAction
                    label="Visualizer"
                    value="vis"
                    icon={<WavesIcon />}
                />
                <BottomNavigationAction
                    label="Controls"
                    value="ctrl"
                    icon={<SettingsIcon />}
                />
            </BottomNavigation>
        </Box>
    );
}
