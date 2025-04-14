"use client";

import React, { useState } from "react";
import * as Tone from "tone";
import { Box, Container, Typography } from "@mui/material";
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
    const [instrument, setInstrument] = useState<string>("synth");
    const [selectedNote, setSelectedNote] = useState<string>("C");
    const [octave, setOctave] = useState<number>(4);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);
    const [currentChordType, setCurrentChordType] = useState<string>("");
    const [currentInversion, setCurrentInversion] = useState<string>("");

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
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Chord Player
            </Typography>

            <InstrumentSelect instrument={instrument} setInstrument={setInstrument} />

            {/* Octave Slider */}
            <OctaveSlider octave={octave} setOctave={setOctave} />

            {/* Note Selector */}
            <MiniPianoKeyboard
                baseNote={selectedNote}
                setBaseNote={setSelectedNote}
            />

            {currentChordType && currentInversion && (
                <ChordNotation
                    baseNote={baseNote}
                    chordType={currentChordType}
                    inversion={currentInversion}
                />
            )}

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
            </Box>

            <Box sx={{ minHeight: "8rem" }} />
        </Container>
    );
}
