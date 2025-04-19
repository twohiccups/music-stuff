// app/polyrhythm/page.tsx
"use client";

import React from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import TrackControls from "@app/polyrhythm/components/TrackControls";
import TempoControls from "@app/polyrhythm/components/TempoControls";
import RhythmCircle from "@app/polyrhythm/components/RhythmCircle";
import {
  PolyrhythmProvider,
  usePolyrhythm,
} from "@src/contexts/polyrhythmContext";

function PolyrhythmPageContent() {
  const {
    tracks,
    tempo,
    isPlaying,
    currentBeatIndex,
    globalLCM,
    createPolyrhythm,
    togglePlay,
    updateTrack,
    setTempo,
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
      {/* ─── CONTROLS COLUMN ────────────────────────────────────── */}
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
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Polyrhythm Controls
        </Typography>

        {/* Tempo + play/pause */}
        <TempoControls tempo={tempo} onTempoChange={setTempo} />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={createPolyrhythm}
            sx={{ flex: 1 }}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            onClick={togglePlay}
            sx={{ flex: 1 }}
          >
            {isPlaying ? "Pause" : "Resume"}
          </Button>
        </Box>

        {/* Track list */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pt: 1,
          }}
        >
          <Grid container spacing={2}>
            {tracks.map((t) => (
              <Grid item xs={12} key={t.index}>
                <TrackControls
                  index={t.index}
                  isActive={t.isActive}
                  isMute={t.isMute}
                  beatNumber={t.beatNumber}
                  onSwitchActive={() =>
                    updateTrack(t.index, { isActive: !t.isActive })
                  }
                  onSwitchMute={() =>
                    updateTrack(t.index, { isMute: !t.isMute })
                  }
                  onChangeBeatNumber={(val) => {
                    const old = tracks.find((x) => x.index === t.index)!;
                    const newBeats = old.beats
                      .slice(0, val)
                      .concat(
                        Array(Math.max(0, val - old.beats.length)).fill({
                          isOn: false,
                        })
                      );
                    updateTrack(t.index, {
                      beatNumber: val,
                      beats: newBeats,
                    });
                  }}
                  onRotateCW={() => {
                    const b = [...t.beats];
                    b.unshift(b.pop()!);
                    updateTrack(t.index, { beats: b });
                  }}
                  onRotateCCW={() => {
                    const b = [...t.beats];
                    b.push(b.shift()!);
                    updateTrack(t.index, { beats: b });
                  }}
                  onClearRhythm={() =>
                    updateTrack(t.index, {
                      beats: t.beats.map(() => ({ isOn: false })),
                    })
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ─── VISUALIZER COLUMN ─────────────────────────────────── */}
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
          onToggleBeat={(trackIdx, beatIdx) => {
            const t = tracks.find((x) => x.index === trackIdx)!;
            const b = [...t.beats];
            b[beatIdx] = { isOn: !b[beatIdx].isOn };
            updateTrack(trackIdx, { beats: b });
          }}
        />
      </Box>
    </Box>
  );
}

export default function PolyrhythmPage() {
  return (
    <PolyrhythmProvider>
      <PolyrhythmPageContent />
    </PolyrhythmProvider>
  );
}
