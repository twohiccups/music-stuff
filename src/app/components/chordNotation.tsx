import React from "react";
import * as Tone from "tone";
import { Box, Typography } from "@mui/material";
import { chords } from "../data/constants";

interface ChordNotationProps {
    baseNote: number;
    chordType: string;
    inversion: string;
}

// Map chord types to common suffixes.
const chordSuffix: { [key: string]: string } = {
    major: "",
    minor: "m",
    diminished: "dim",
    augmented: "aug",
    "suspended 2nd": "sus2",
    "suspended 4th": "sus4",
    "major 6th": "6",
    "minor 6th": "m6",
    "dominant 7th": "7",
    "major 7th": "maj7",
    "minor 7th": "m7",
    "half diminished 7th": "ø7",
    "diminished 7th": "dim7",
    "minor major 7th": "m(maj7)",
    "augmented 7th": "aug7",
    "augmented major 7th": "augmaj7",
};

// Given an inversion key, return the appropriate figured bass notation.
// For triads, we'll use "6/3" (first inversion) and "6/4" (second inversion).
// For 4-note chords, we use "6/5", "4/3", or "2/5".
const getInversionFigure = (chordType: string, inversionKey: string): string => {
    let inversionIndex = 0;
    if (inversionKey === "inv1") inversionIndex = 1;
    if (inversionKey === "inv2") inversionIndex = 2;
    if (inversionKey === "inv3") inversionIndex = 3;

    const triadTypes = [
        "major",
        "minor",
        "diminished",
        "augmented",
        "suspended 2nd",
        "suspended 4th",
    ];
    if (triadTypes.includes(chordType)) {
        if (inversionIndex === 0) return "";
        if (inversionIndex === 1) return "6/3";
        if (inversionIndex === 2) return "6/4";
    } else {
        if (inversionIndex === 0) return "";
        if (inversionIndex === 1) return "6/5";
        if (inversionIndex === 2) return "4/3";
        if (inversionIndex === 3) return "2/5";
    }
    return "";
};

// Convert a chord mask into note names.
const maskToChord = (base: number, mask: number[]): string[] => {
    return mask.map((interval) => Tone.Frequency(base + interval, "midi").toNote());
};

const ChordNotation: React.FC<ChordNotationProps> = ({
    baseNote,
    chordType,
    inversion,
}) => {
    // Compute the note names using the chord mask from the constants.
    const noteNames = maskToChord(baseNote, chords[chordType][inversion]);
    // Get just the letter part of the base note (e.g., "C" from "C3")
    const baseNoteName = Tone.Frequency(baseNote, "midi")
        .toNote()
        .replace(/\d+$/, "");
    const suffix = chordSuffix[chordType] ?? chordType;
    const inversionFigure = getInversionFigure(chordType, inversion);
    // Build the full chord symbol.
    const chordSymbol =
        baseNoteName + suffix + (inversionFigure ? ` (${inversionFigure})` : "");

    return (
        <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
                Current Chord: {chordSymbol}
            </Typography>
            <Typography variant="body1">Notes: {noteNames.join(", ")}</Typography>
        </Box>
    );
};

export default ChordNotation;
