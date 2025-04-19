"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import { Box, Container, Typography, useTheme } from "@mui/material";

import { chords } from "../data/constants";
import useInstruments from "@src/hooks/useInstruments";
import ChordNotation from "@app/chords-table/components/ChordNotation";
import PianoKeyboard from "@app/chords-table/components/PianoKeyboard";
import SettingsDialog from "@app/chords-table/components/SettingsDialog";
import ChordTable from "@app/chords-table/components/ChordTable";
import QuickActionsDial from "@components/QuickActionsDial";

// Convert base MIDI + mask → frequencies
const maskToChord = (base: number, mask: number[]) =>
  mask.map((interval) => Tone.Frequency(base + interval, "midi").toFrequency());

export default function Page() {
  const theme = useTheme();
  const [instrument, setInstrument] = useState("violin");
  const [selectedNote, setSelectedNote] = useState("C");
  const [octave, setOctave] = useState(4);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [currentChordType, setCurrentChordType] = useState("");
  const [currentInversion, setCurrentInversion] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const synth = useInstruments(instrument);

  const baseMidi = Tone.Frequency(`${selectedNote}${octave}`).toMidi();
  const startMidi = baseMidi - 2;

  function playChord(type: string, inversion: string) {
    if (!synth || !chords[type]?.[inversion]) return;
    const freqs = maskToChord(baseMidi, chords[type][inversion]);
    const names = freqs.map((f) => Tone.Frequency(f).toNote());
    setActiveNotes(names);
    setCurrentChordType(type);
    setCurrentInversion(inversion);
    synth.releaseAll?.();
    if (synth instanceof Tone.PolySynth) {
      synth.triggerAttackRelease(freqs, "1m");
    } else {
      freqs.forEach((f) => synth.triggerAttackRelease(f, "2m"));
    }
  }

  return (
    <>
      <Container
        disableGutters
        sx={{
          height: "90vh",
          pb: { xs: 10, md: 0 },
          py: 0,
          overflowY: { xs: "auto", md: "visible" },
        }}
      >
        <Typography
          variant="h3"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          textAlign="center"
          sx={{ my: 2 }}
        >
          Chords Table
        </Typography>

        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          instrument={instrument}
          setInstrument={setInstrument}
          octave={octave}
          setOctave={setOctave}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
        />

        <ChordTable
          playChord={playChord}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            pb: 2,
            position: { xs: "fixed", md: "static" },
            bottom: { xs: 0, md: "auto" },
            left: { xs: 0, md: "auto" },
            width: { xs: "100vw", md: "auto" },
            zIndex: { xs: 1000, md: "auto" },
            boxShadow: { xs: "0 -2px 5px rgba(0,0,0,0.2)", md: "none" },
            backgroundColor: { xs: theme.palette.background.paper, md: "inherit" },
          }}
        >
          <PianoKeyboard
            activeNotes={activeNotes}
            startMidi={startMidi}
          />
          <ChordNotation
            baseNote={selectedNote}
            chordType={currentChordType}
            inversion={currentInversion}
          />
        </Box>
      </Container>

      {/* Quick Actions Dial */}
      <QuickActionsDial onOpenSettings={() => setSettingsOpen(true)} />
    </>
  );
}
