"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import {
  Box,
  Container,
  Typography,
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { chords } from "../data/constants";
import useInstruments from "@src/hooks/useInstruments";
import ChordNotation from "@components/ChordNotation";
import ChordTable from "@components/ChordTable";
import PianoKeyboard from "@components/PianoKeyboard";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SettingsDialog from "@components/SettingsDialog";

const maskToChord = (base: number, mask: number[]): number[] => {
  return mask.map((interval) =>
    Tone.Frequency(base + interval, "midi").toFrequency()
  );
};

export default function Page() {
  const [instrument, setInstrument] = useState<string>("violin");
  const [selectedNote, setSelectedNote] = useState<string>("C");
  const [octave, setOctave] = useState<number>(4);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [currentChordType, setCurrentChordType] = useState<string>("");
  const [currentInversion, setCurrentInversion] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const currentSynth = useInstruments(instrument);

  // Compute base MIDI note from note + octave
  const baseNote = Tone.Frequency(`${selectedNote}${octave}`).toMidi();
  const startMidi = baseNote - 2;

  const playChord = (type: string, inversion: string) => {
    if (!currentSynth || !chords[type] || !chords[type][inversion]) return;

    const chordFrequencies = maskToChord(baseNote, chords[type][inversion]);
    const noteNames = chordFrequencies.map((freq) =>
      Tone.Frequency(freq).toNote()
    );
    setActiveNotes(noteNames);
    setCurrentChordType(type);
    setCurrentInversion(inversion);

    if (currentSynth instanceof Tone.PolySynth) {
      currentSynth.releaseAll();
      currentSynth.triggerAttackRelease(chordFrequencies, "1m");
    } else if (currentSynth instanceof Tone.Sampler) {
      currentSynth.releaseAll();
      chordFrequencies.forEach((freq) =>
        currentSynth.triggerAttackRelease(freq, "2m")
      );
    }
  };

  return (
    <>

      <Container disableGutters sx={{
        height: "90vh",
        paddingBottom: { xs: 10, md: 0 },
        overflowY: { xs: "scroll", md: "visible" }
      }}>
        <Typography
          variant="h3"
          fontFamily="'Georgia', serif"
          textAlign="center"
          sx={{
            mt: 1.5
          }}
        >
          Chords Table
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Settings Modal */}
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

        <ChordTable playChord={playChord} buttonColor="#b19ff5" />

        <Box
          sx={{
            // For mobile, make this container sticky at the bottom
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            position: { xs: "fixed", md: "static" },
            bottom: { xs: 0, md: "auto" },
            left: { xs: 0, md: "auto" },
            width: { xs: "100%", md: "auto" },
            backgroundColor: { xs: "white", md: "inherit" },
            zIndex: { xs: 1000, md: "auto" },
            boxShadow: { xs: "0 -2px 5px rgba(0,0,0,0.2)", md: "none" },
          }}
        >
          <PianoKeyboard
            activeNotes={activeNotes}
            startMidi={startMidi}
            activeWhiteColor="#A2D2FF" // Light sky blue
            activeBlackColor="#4A90E2" // Deeper soft blue
            activeWhiteContrastColor="#003049" // Dark navy (great on light blue)
            activeBlackContrastColor="white" // Classic clean contrast
          />


          <ChordNotation
            baseNote={selectedNote}
            chordType={currentChordType}
            inversion={currentInversion}
          />
        </Box>

      </Container>
      <SpeedDial
        ariaLabel="Quick actions"
        icon={
          <SpeedDialIcon
            icon={<MenuIcon />}
            openIcon={<CloseIcon />}
          />
        }
        sx={{
          // For mobile, make SpeedDial sticky; for desktop, fix it to viewport
          position: { xs: "fixed", md: "fixed" },
          bottom: { xs: 8, md: 30 },
          right: 16,
          zIndex: 1201,
          p: 0,
          m: 0,
        }}
      >
        <SpeedDialAction
          icon={<SettingsIcon />}
          onClick={() => setSettingsOpen(true)}
        />
        <SpeedDialAction
          icon={<InfoIcon />}
          onClick={() =>
            alert(
              "This is a chord player. Choose a chord and hear how it sounds."
            )
          }
        />
      </SpeedDial>


    </>
  );
}
