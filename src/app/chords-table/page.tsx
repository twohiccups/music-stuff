"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import {
    Box,
    Button,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { chords } from "../data/constants";
import useInstruments from "@src/hooks/useInstruments";
import InstrumentSelect from "@components/InstrumentSelect";
import ChordNotation from "@components/ChordNotation";
import ChordTable from "@components/ChordTable";
import PianoKeyboard from "@components/PianoKeyboard";
import MiniPianoKeyboard from "@components/MiniPianoKeyboard";
import OctaveSlider from "@components/OctaveSlider";

const maskToChord = (base: number, mask: number[]): number[] => {
    return mask.map((interval) =>
        Tone.Frequency(base + interval, "midi").toFrequency()
    );
};

// Page.tsx
export default function Page() {
    const [instrument, setInstrument] = useState<string>("violin");
    const [selectedNote, setSelectedNote] = useState<string>("C");
    const [octave, setOctave] = useState<number>(4);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);
    const [currentChordType, setCurrentChordType] = useState<string>("");
    const [currentInversion, setCurrentInversion] = useState<string>("");

    const currentSynth = useInstruments(instrument);

    // Compute base MIDI note from note + octave
    const baseNote = Tone.Frequency(`${selectedNote}${octave}`).toMidi();
    const startMidi = baseNote - 2;

    // Use the theme and media query to detect mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Modal dialog state for settings
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    // Shared settings content
    const settingsContent = (
        <>
            <InstrumentSelect instrument={instrument} setInstrument={setInstrument} />
            <Box>
                <OctaveSlider octave={octave} setOctave={setOctave} />
                <MiniPianoKeyboard baseNote={selectedNote} setBaseNote={setSelectedNote} />
            </Box>
        </>
    );

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
            chordFrequencies.forEach((freq) => currentSynth.triggerAttackRelease(freq, "2m"));
        }
    };

    return (
        <Container disableGutters>
            <Typography variant="h4" align="center" gutterBottom>
                Chord Player
            </Typography>

            {/* Settings Button */}
            <Box sx={{ textAlign: "center", my: 2 }}>
                <Button variant="contained" onClick={() => setSettingsOpen(true)}>
                    Settings
                </Button>
            </Box>

            {/* Settings Modal (used on both desktop and mobile) */}
            <Dialog
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                fullWidth
                fullScreen={isMobile}
                disableScrollLock
            >
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>{settingsContent}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setSettingsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <ChordTable playChord={playChord} />

            <Box
                sx={{
                    "@media (max-width: 1000px)": {
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "white",
                        zIndex: 1000,
                        boxShadow: "0 -2px 5px rgba(0,0,0,0.2)",
                    },
                }}
            >
                <PianoKeyboard activeNotes={activeNotes} startMidi={startMidi} />
                {currentChordType && currentInversion && (
                    <ChordNotation
                        baseNote={baseNote}
                        chordType={currentChordType}
                        inversion={currentInversion}
                    />
                )}
            </Box>

            <Box sx={{ minHeight: "8rem" }} />
        </Container>
    );
}
