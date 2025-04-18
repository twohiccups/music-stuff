import React from "react";
import { Box, useTheme } from "@mui/material";
import * as Tone from "tone";

const DESIGN_CONTAINER_WIDTH = 700;
const DESIGN_CONTAINER_HEIGHT = 120;
const NUM_WHITE_KEYS = 14;

const BLACK_KEY_WIDTH_PERCENT = (30 / DESIGN_CONTAINER_WIDTH) * 100;
const BLACK_KEY_HEIGHT_PERCENT = (80 / DESIGN_CONTAINER_HEIGHT) * 100;

// Helper to drop octave digits, e.g. "C#4" → "C#"
const stripOctave = (note: string) => note.replace(/\d+$/, "");

interface PianoKeyboardProps {
    activeNotes: string[];
    startMidi: number;
    whiteKeyColor?: string,
    blackKeyColor?: string,
    activeWhiteKeyColor?: string;
    activeBlackKeyColor?: string;
    activeWhiteKeyContrastColor?: string;
    activeBlackKeyContrastColor?: string;
}

export default function PianoKeyboard({
    activeNotes,
    startMidi,
    whiteKeyColor = "white",
    blackKeyColor = "black",
    activeWhiteKeyColor = "#FFA500",
    activeBlackKeyColor = "#FF4500",
    activeWhiteKeyContrastColor = "black",
    activeBlackKeyContrastColor = "black",
}: PianoKeyboardProps) {
    const theme = useTheme()
    let endMidi = startMidi;
    const whiteKeys: number[] = [];

    // Gather white-key midi numbers
    while (whiteKeys.length < NUM_WHITE_KEYS) {
        const note = Tone.Frequency(endMidi, "midi").toNote() as string;
        if (!note.includes("#")) {
            whiteKeys.push(endMidi);
        }
        endMidi++;
    }

    // Build full midi range
    const midiNumbers: number[] = [];
    for (let m = startMidi; m < endMidi; m++) {
        midiNumbers.push(m);
    }

    // Map white keys to positions
    const whiteKeyPositions = whiteKeys.map((m, i) => ({
        midi: m,
        note: Tone.Frequency(m, "midi").toNote() as string,
        index: i,
    }));

    // Map black keys to positions relative to preceding white key
    const blackKeyPositions = midiNumbers
        .filter((m) => (Tone.Frequency(m, "midi").toNote() as string).includes("#"))
        .map((m) => {
            const note = Tone.Frequency(m, "midi").toNote() as string;
            const precedingWhiteKey = whiteKeyPositions.filter((wk) => wk.midi < m).slice(-1)[0];
            if (!precedingWhiteKey) return null;
            return { midi: m, note, whiteIndex: precedingWhiteKey.index };
        })
        .filter((bk): bk is { midi: number; note: string; whiteIndex: number } => !!bk);

    return (
        <Box
            sx={{
                position: "relative",
                paddingTop: "1.5rem",
                width: "95%",
                maxWidth: `${DESIGN_CONTAINER_WIDTH}px`,
                aspectRatio: `${DESIGN_CONTAINER_WIDTH} / ${DESIGN_CONTAINER_HEIGHT}`,
                margin: "0 auto",
            }}
        >
            {/* Top labels for C & G — leave octave intact */}
            {whiteKeyPositions
                .filter((wk) => wk.note.startsWith("C") || wk.note.startsWith("G"))
                .map((wk) => (
                    <Box
                        key={`label-${wk.midi}`}
                        sx={{
                            position: "absolute",
                            left: `calc(${wk.index} * (100% / ${NUM_WHITE_KEYS}))`,
                            width: `calc(100% / ${NUM_WHITE_KEYS})`,
                            textAlign: "center",
                            top: "5px",
                            fontSize: "0.75rem",
                            pointerEvents: "none",
                            userSelect: "none",
                            fontWeight: "bold",
                            color: theme.palette.text.primary
                        }}
                    >
                        {wk.note}
                    </Box>
                ))}

            {/* White keys */}
            {whiteKeyPositions.map((wk) => {
                const noteLabel = stripOctave(wk.note);
                const isActive = activeNotes.includes(wk.note);
                return (
                    <Box
                        key={wk.midi}
                        sx={{
                            position: "absolute",
                            left: `calc(${wk.index} * (100% / ${NUM_WHITE_KEYS}))`,
                            width: `calc(100% / ${NUM_WHITE_KEYS})`,
                            height: "100%",
                            border: "1px solid #666",
                            borderRadius: "0 0 6px 6px",
                            backgroundColor: isActive ? activeWhiteKeyColor : whiteKeyColor,
                            boxSizing: "border-box",
                            cursor: "pointer",
                            boxShadow: { xs: "1px 2px 1px grey", md: "1px 5px 3px grey" },
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        {isActive && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 2,
                                    left: 0,
                                    right: 0,
                                    textAlign: "center",
                                    fontSize: "0.8em",
                                    pointerEvents: "none",
                                    color: activeWhiteKeyContrastColor,
                                    fontWeight: "bold",
                                }}
                            >
                                {noteLabel}
                            </Box>
                        )}
                    </Box>
                );
            })}

            {/* Black keys */}
            {blackKeyPositions.map((bk) => {
                const noteLabel = stripOctave(bk.note);
                const isActive = activeNotes.includes(bk.note);
                return (
                    <Box
                        key={bk.midi}
                        sx={{
                            position: "absolute",
                            left: `calc((${bk.whiteIndex} + 1) * (100% / ${NUM_WHITE_KEYS}) - (${BLACK_KEY_WIDTH_PERCENT}% / 2))`,
                            width: `${BLACK_KEY_WIDTH_PERCENT}%`,
                            height: `${BLACK_KEY_HEIGHT_PERCENT}%`,
                            backgroundColor: isActive ? activeBlackKeyColor : blackKeyColor,
                            border: "1px solid #222",
                            borderRadius: "0 0 4px 4px",
                            zIndex: 2,
                            cursor: "pointer",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        {isActive && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 2,
                                    left: 0,
                                    right: 0,
                                    textAlign: "center",
                                    fontSize: "0.7em",
                                    color: activeBlackKeyContrastColor,
                                    fontWeight: "bold",
                                    pointerEvents: "none",
                                }}
                            >
                                {noteLabel}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}
