import React from "react";
import { Box } from "@mui/material";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface ChordNotationProps {
    baseNote: string;
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

    // Use the preformatted math code from the mapping.
    const suffix = chordSuffix[chordType] ?? chordType;
    const inversionFigure = getInversionFigure(chordType, inversion);
    let latexInversion =
        inversionFigure && inversionFigure.includes("/")
            ? `\\space\\space \\frac{${inversionFigure.replace("/", "}{")}}`
            : "";

    // In this example we are not showing the inversion text.
    latexInversion = "";

    // Process the note to properly render sharps in LaTeX.
    const baseNoteName = baseNote.replace(/#/g, "^{♯}");
    const baseNoteTex = `\\mathbf{${baseNoteName}}`;
    const chordNotationText = `\\mathbf{${suffix}${latexInversion}}`;

    // Build a key that changes when the chord data changes.
    const mathKey = `${baseNote}-${chordType}-${inversion}`;

    return (
        <Box
            sx={{
                mt: 4,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "50px",
                minHeight: "50px",

                border: "1px solid transparent", // optional: for debugging layout boundaries
            }}
        >
            <MathJaxContext config={config}>
                {/* Add an inner container with fixed height and matching line-height */}

                {chordType &&
                    <Box
                        sx={{
                            fontSize: "2rem",
                        }}
                    >
                        <MathJax inline key={`base-${mathKey}`}>
                            {`$${baseNoteTex}$`}
                        </MathJax>
                        <MathJax inline key={`notation-${mathKey}`}>
                            {`$${chordNotationText}$`}
                        </MathJax>
                    </Box>
                }
            </MathJaxContext>
        </Box>
    );
}
