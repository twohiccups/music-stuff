import React from "react";
import { Box } from "@mui/material";
import * as Tone from "tone";

const DESIGN_CONTAINER_WIDTH = 700; // px
const DESIGN_CONTAINER_HEIGHT = 120; // px
const NUM_WHITE_KEYS = 14;

// Define key size constants to use for black keys.
const BLACK_KEY_WIDTH_PERCENT = (30 / DESIGN_CONTAINER_WIDTH) * 100; // ≈ 4.29%
const BLACK_KEY_HEIGHT_PERCENT = (80 / DESIGN_CONTAINER_HEIGHT) * 100; // ≈ 66.67%


interface PianoKeyboardProps {
    activeNotes: string[];
    startMidi: number;
}

export default function PianoKeyboard({ activeNotes, startMidi }: PianoKeyboardProps) {
    let endMidi = startMidi;
    const whiteKeys: number[] = [];

    // Collect white keys until we have the fixed count.
    while (whiteKeys.length < NUM_WHITE_KEYS) {
        const note = Tone.Frequency(endMidi, "midi").toNote();
        if (!note.includes("#")) {
            whiteKeys.push(endMidi);
        }
        endMidi++;
    }

    // Generate all MIDI numbers in our range.
    const midiNumbers: number[] = [];
    for (let m = startMidi; m < endMidi; m++) {
        midiNumbers.push(m);
    }

    // Map white keys and include their index. We’ll use the index for CSS calc.
    const whiteKeyPositions: { midi: number; note: string; index: number }[] = whiteKeys.map((m, i) => ({
        midi: m,
        note: Tone.Frequency(m, "midi").toNote() as string,
        index: i,
    }));

    // Calculate black key positions.
    // For each black key, find the preceding white key (largest white key with a lower midi value)
    // and note its index. Then position the black key using CSS calc so it sits centered on the gap.
    const blackKeyPositions: { midi: number; note: string; whiteIndex: number }[] = midiNumbers
        .filter((m) => {
            const note = Tone.Frequency(m, "midi").toNote() as string;
            return note.includes("#");
        })
        .map((m) => {
            const note = Tone.Frequency(m, "midi").toNote() as string;
            // Get the most recent white key (by midi value) that comes before this black key.
            const precedingWhiteKey = whiteKeyPositions.filter((wk) => wk.midi < m).slice(-1)[0];
            if (!precedingWhiteKey) return null;
            return { midi: m, note, whiteIndex: precedingWhiteKey.index };
        })
        .filter((bk): bk is { midi: number; note: string; whiteIndex: number } => bk !== null);

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: `${DESIGN_CONTAINER_WIDTH}px`,
                // Enforce the design's aspect ratio (700 x 120)
                aspectRatio: `${DESIGN_CONTAINER_WIDTH} / ${DESIGN_CONTAINER_HEIGHT}`,
                backgroundColor: "#f0f0f0",
                margin: "0 auto",
            }}
        >
            {/* White keys using CSS calc for precise positioning */}
            {whiteKeyPositions.map((wk) => (
                <Box
                    key={wk.midi}
                    sx={{
                        position: "absolute",
                        // Calculate left: each white key occupies equal space.
                        left: `calc(${wk.index} * (100% / ${NUM_WHITE_KEYS}))`,
                        width: `calc(100% / ${NUM_WHITE_KEYS})`,
                        height: "100%",
                        border: "1px solid #666",
                        borderRadius: "0 0 6px 6px",
                        backgroundColor: activeNotes.includes(wk.note) ? "#FFA500" : "white",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        transition: "background-color 0.2s ease",

                    }}
                >
                    {/* Label white keys that represent a C note */}
                    {wk.note.startsWith("C") && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 2,
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                fontSize: "0.8em",
                                pointerEvents: "none",
                            }}
                        >
                            {wk.note}
                        </Box>
                    )}
                </Box>
            ))}

            {/* Black keys using CSS calc for precise positioning */}
            {blackKeyPositions.map((bk) => (
                <Box
                    key={bk.midi}
                    sx={{
                        position: "absolute",
                        // The black key's left position is calculated from the preceding white key:
                        // (whiteIndex + 1) * (100% / NUM_WHITE_KEYS) gives the right edge of the white key.
                        // Then subtract half the black key’s width to center the black key.
                        left: `calc((${bk.whiteIndex} + 1) * (100% / ${NUM_WHITE_KEYS}) - (${BLACK_KEY_WIDTH_PERCENT}% / 2))`,
                        width: `${BLACK_KEY_WIDTH_PERCENT}%`,
                        height: `${BLACK_KEY_HEIGHT_PERCENT}%`,
                        backgroundColor: activeNotes.includes(bk.note) ? "#FF4500" : "black",
                        border: "1px solid #222",
                        borderRadius: "0 0 4px 4px",
                        zIndex: 2,
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                        transition: "background-color 0.2s ease",
                    }}
                />
            ))}
        </Box>
    );
}
