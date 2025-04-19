"use client";

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
}

export default function PianoKeyboard({
    activeNotes,
    startMidi,
}: PianoKeyboardProps) {
    const theme = useTheme();
    const {
        white,
        black,
        activeWhite,
        activeBlack,
        whiteContrast,
        blackContrast,
    } = theme.palette.keyboard;

    // Build white-key midi list
    let endMidi = startMidi;
    const whiteKeys: number[] = [];
    while (whiteKeys.length < NUM_WHITE_KEYS) {
        const note = Tone.Frequency(endMidi, "midi").toNote() as string;
        if (!note.includes("#")) whiteKeys.push(endMidi);
        endMidi++;
    }

    // Full range for black-key detection
    const midiNumbers: number[] = [];
    for (let m = startMidi; m < endMidi; m++) {
        midiNumbers.push(m);
    }

    // White-key positions
    const whiteKeyPositions = whiteKeys.map((m, i) => ({
        midi: m,
        note: Tone.Frequency(m, "midi").toNote() as string,
        index: i,
    }));

    // Black-key positions
    const blackKeyPositions = midiNumbers
        .filter((m) => (Tone.Frequency(m, "midi").toNote() as string).includes("#"))
        .map((m) => {
            const note = Tone.Frequency(m, "midi").toNote() as string;
            const prevWhite = whiteKeyPositions.filter((wk) => wk.midi < m).slice(-1)[0];
            return prevWhite
                ? { midi: m, note, whiteIndex: prevWhite.index }
                : null;
        })
        .filter((x): x is { midi: number; note: string; whiteIndex: number } => !!x);

    return (
        <Box
            sx={{
                position: "relative",
                pt: "1.5rem",
                width: "95%",
                maxWidth: `${DESIGN_CONTAINER_WIDTH}px`,
                aspectRatio: `${DESIGN_CONTAINER_WIDTH} / ${DESIGN_CONTAINER_HEIGHT}`,
                m: "0 auto",
            }}
        >
            {/* Top labels for C & G */}
            {whiteKeyPositions
                .filter((wk) => wk.note.startsWith("C") || wk.note.startsWith("G"))
                .map((wk) => (
                    <Box
                        key={wk.midi}
                        sx={{
                            position: "absolute",
                            left: `calc(${wk.index} * (100% / ${NUM_WHITE_KEYS}))`,
                            width: `calc(100% / ${NUM_WHITE_KEYS})`,
                            textAlign: "center",
                            top: 5,
                            fontSize: "0.75rem",
                            pointerEvents: "none",
                            userSelect: "none",
                            fontWeight: "bold",
                            color: theme.palette.text.primary,
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
                            bgcolor: isActive ? activeWhite : white,
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
                                    color: whiteContrast,
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
                            bgcolor: isActive ? activeBlack : black,
                            border: "1px solid #222",
                            borderRadius: "0 0 4px 4px",
                            zIndex: 2,
                            cursor: "pointer",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        {isActive && (
                            <>
                                {/* Mobile-first: superscript sharp */}
                                <Box
                                    sx={{
                                        display: { xs: "block", md: "none" },
                                        position: "absolute",
                                        bottom: 2,
                                        left: 0,
                                        right: 0,
                                        textAlign: "center",
                                        fontSize: "0.65em",
                                        color: blackContrast,
                                        fontWeight: "bold",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {noteLabel.replace("#", "")}
                                    <Box
                                        component="sup"
                                        sx={{
                                            verticalAlign: "super",
                                            fontSize: "0.7em",
                                        }}
                                    >
                                        #
                                    </Box>
                                </Box>

                                {/* Desktop: normal label */}
                                <Box
                                    sx={{
                                        display: { xs: "none", md: "block" },
                                        position: "absolute",
                                        bottom: 2,
                                        left: 0,
                                        right: 0,
                                        textAlign: "center",
                                        fontSize: "0.7em",
                                        color: blackContrast,
                                        fontWeight: "bold",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {noteLabel}
                                </Box>
                            </>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}
