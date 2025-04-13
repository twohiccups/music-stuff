"use client";

import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import {
    Box,
    Container,
    Typography,
} from "@mui/material";
import PianoKeyboard from "@components/pianoKeyboard";
import ChordNotation from "@components/chordNotation";
import ChordTable from "@components/chordTable";
import { chords } from "../data/constants";
import BaseNoteSlider from "@components/baseNoteSlider";
import InstrumentSelect from "@components/instrumentSelect";

const maskToChord = (base: number, mask: number[]): number[] => {
    return mask.map((interval) =>
        Tone.Frequency(base + interval, "midi").toFrequency()
    );
};

export default function Page() {
    const [instrument, setInstrument] = useState<string>("synth");
    const [baseNote, setBaseNote] = useState<number>(48);
    const [currentSynth, setCurrentSynth] = useState<Tone.PolySynth | Tone.Sampler | null>(null);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);
    const [currentChordType, setCurrentChordType] = useState<string>("");
    const [currentInversion, setCurrentInversion] = useState<string>("");

    const startMidi = baseNote - 2;

    useEffect(() => {
        let synth: Tone.PolySynth | Tone.Sampler;

        if (instrument === "piano") {
            synth = new Tone.Sampler({
                urls: {
                    C4: "C4.mp3",
                    D4: "D4.mp3",
                    E4: "E4.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/",
                onload: () => console.log("Piano Loaded"),
            }).toDestination();
        } else if (instrument === "violin") {
            synth = new Tone.Sampler({
                urls: {
                    C4: "violin_C4.mp3",
                    D4: "violin_D4.mp3",
                    E4: "violin_E4.mp3",
                },
                baseUrl: "https://YOUR_VIOLIN_SAMPLE_URL_HERE/",
                onload: () => console.log("Violin Loaded"),
            }).toDestination();
        } else {
            synth = new Tone.PolySynth(Tone.Synth).toDestination();
        }

        setCurrentSynth(synth);

        return () => {
            if (synth instanceof Tone.PolySynth) {
                synth.releaseAll();
            }
            synth.dispose();
        };
    }, [instrument]);

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
            currentSynth.triggerAttackRelease(chordFrequencies, "1n");
        } else if (currentSynth instanceof Tone.Sampler) {
            currentSynth.releaseAll();
            chordFrequencies.forEach((freq) =>
                currentSynth.triggerAttackRelease(freq, "1n")
            );
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Chord Player
            </Typography>

            <InstrumentSelect instrument={instrument} setInstrument={setInstrument} />


            {/* Base Note Slider with Octave Controls */}
            <BaseNoteSlider baseNote={baseNote} setBaseNote={setBaseNote} />

            {/* Chord Notation */}
            {currentChordType && currentInversion && (
                <ChordNotation
                    baseNote={baseNote}
                    chordType={currentChordType}
                    inversion={currentInversion}
                />
            )}

            {/* Chord Table */}
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

            <Box sx={{ minHeight: '8rem' }} />


        </Container>
    );
}
