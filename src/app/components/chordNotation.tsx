import React from "react";
import * as Tone from "tone";
import { Box } from "@mui/material";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { chords } from "../data/constants";


interface ChordNotationProps {
    baseNote: number;
    chordType: string;
    inversion: string;
}

const chordSuffix: { [key: string]: string } = {
    major: "",
    minor: "m",
    diminished: "dim",
    augmented: "aug",
    "suspended 2nd": "sus2",
    "suspended 4th": "sus4",
    "major 6th": "^{6}",
    "minor 6th": "m^{6}",
    "dominant 7th": "^{7}",
    "major 7th": "^{maj7}",
    "minor 7th": "m{^7}",
    "half diminished 7th": "ø^{7}",
    "diminished 7th": "dim^{7}",
    "minor major 7th": "m^{(maj7)}",
    "augmented 7th": "aug^{7}",
    "augmented major 7th": "aug^{(maj7)}",
};

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
        if (inversionIndex === 1) return "6/3";
        if (inversionIndex === 2) return "6/4";
    } else {
        if (inversionIndex === 1) return "6/5";
        if (inversionIndex === 2) return "4/3";
        if (inversionIndex === 3) return "2/5";
    }
    return "";
};

export default function ChordNotation({
    baseNote,
    chordType,
    inversion,
}: ChordNotationProps) {

    const config = {
        loader: { load: ["input/asciimath"] },
        tex: { inlineMath: [["$", "$"]] },
    };


    if (!chords[chordType] || !chords[chordType][inversion]) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <div>Error: Chord data not found.</div>
            </Box>
        );
    }

    // Get the base note letter (e.g. "C#" or "F#") without the octave number.
    let baseNoteName = Tone.Frequency(baseNote, "midi")
        .toNote()
        .replace(/\d+$/, "");
    // Replace sharp signs with a Unicode sharp for better spacing.
    baseNoteName = baseNoteName.replace(/#/g, "^{♯}");

    // Use the preformatted math code from the mapping.
    const suffix = chordSuffix[chordType] ?? chordType;
    const inversionFigure = getInversionFigure(chordType, inversion);
    const latexInversion =
        inversionFigure && inversionFigure.includes("/")
            ? `\\left(\\frac{${inversionFigure.replace("/", "}{")}}\\right)`
            : "";
    // Build the final LaTeX chord string.
    const chordTex = `$\\mathbf{${baseNoteName}${suffix}${latexInversion}}$`;

    return (
        <MathJaxContext config={config}>
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <MathJax >
                    <div style={{ fontSize: "2rem" }}>{chordTex}</div>
                </MathJax>
            </Box>
        </MathJaxContext>
    );
}
