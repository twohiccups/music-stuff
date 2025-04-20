"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    useTheme,
    useMediaQuery,
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
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
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

    // Extract controls panel so we can reuse for desktop & mobile
    const ControlsPanel = (
        <Box
            component="aside"
            sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 2,
                height: "100%",
                overflowY: "auto",
                borderRight: isMdUp ? 1 : 0,
                borderColor: "divider",
                bgcolor: "background.paper",
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
                        <Grid key={t.index} >
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
    );

    const VisualizerPanel = (
        <Box
            component="main"
            sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                overflow: "hidden",
                bgcolor: "background.default",
            }}
        >
            <RhythmCircle
                activeTracks={tracks.filter((t) => t.isActive)}
                currentBeatIndex={currentBeatIndex}
                lcm={globalLCM}
                onToggleBeat={(trackIdx, beatIdx) => toggleBeat(trackIdx, beatIdx)}
            />
        </Box>
    );

    if (!isMdUp) {
        // Mobile: one panel + bottom nav
        return (
            <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1 }}>
                    {mobileNav === "vis" ? VisualizerPanel : ControlsPanel}
                </Box>
                <BottomNavigation
                    value={mobileNav}
                    onChange={(_, val) => setMobileNav(val)}
                    showLabels
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

    // Desktop: side-by-side
    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Box sx={{ flex: 1 }}>{ControlsPanel}</Box>
            <Box sx={{ flex: 2 }}>{VisualizerPanel}</Box>
        </Box>
    );
}
