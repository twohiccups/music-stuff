import React from "react";
import { Box } from "@mui/material";
import * as Tone from "tone";

const DESIGN_CONTAINER_WIDTH = 700;
const DESIGN_CONTAINER_HEIGHT = 120;
const NUM_WHITE_KEYS = 14;

const BLACK_KEY_WIDTH_PERCENT = (30 / DESIGN_CONTAINER_WIDTH) * 100;
const BLACK_KEY_HEIGHT_PERCENT = (80 / DESIGN_CONTAINER_HEIGHT) * 100;

interface PianoKeyboardProps {
    activeNotes: string[];
    startMidi: number;
    activeWhiteColor?: string;
    activeBlackColor?: string;
    activeWhiteContrastColor?: string;
    activeBlackContrastColor?: string;
}

export default function PianoKeyboard({
    activeNotes,
    startMidi,
    activeWhiteColor = "#FFA500",
    activeBlackColor = "#FF4500",
    activeWhiteContrastColor = "black",
    activeBlackContrastColor = "black",
}: PianoKeyboardProps) {
    let endMidi = startMidi;
    const whiteKeys: number[] = [];

    while (whiteKeys.length < NUM_WHITE_KEYS) {
        const note = Tone.Frequency(endMidi, "midi").toNote();
        if (!note.includes("#")) {
            whiteKeys.push(endMidi);
        }
        endMidi++;
    }

    const midiNumbers: number[] = [];
    for (let m = startMidi; m < endMidi; m++) {
        midiNumbers.push(m);
    }

    const whiteKeyPositions: { midi: number; note: string; index: number }[] = whiteKeys.map((m, i) => ({
        midi: m,
        note: Tone.Frequency(m, "midi").toNote() as string,
        index: i,
    }));

    const blackKeyPositions: { midi: number; note: string; whiteIndex: number }[] = midiNumbers
        .filter((m) => {
            const note = Tone.Frequency(m, "midi").toNote() as string;
            return note.includes("#");
        })
        .map((m) => {
            const note = Tone.Frequency(m, "midi").toNote() as string;
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
                aspectRatio: `${DESIGN_CONTAINER_WIDTH} / ${DESIGN_CONTAINER_HEIGHT}`,
                margin: "0 auto",
            }}
        >
            {/* Labels ABOVE the white keys for C notes */}
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
                            top: "-1.4em",
                            fontSize: "0.75rem",
                            pointerEvents: "none",
                            userSelect: "none",
                            fontWeight: "bold",
                            color: activeNotes.includes(wk.note) ? activeWhiteContrastColor : "#333",
                        }}
                    >
                        {wk.note}
                    </Box>
                ))}

            {/* White keys */}
            {whiteKeyPositions.map((wk) => (
                <Box
                    key={wk.midi}
                    sx={{
                        position: "absolute",
                        left: `calc(${wk.index} * (100% / ${NUM_WHITE_KEYS}))`,
                        width: `calc(100% / ${NUM_WHITE_KEYS})`,
                        height: "100%",
                        border: "1px solid #666",
                        borderRadius: "0 0 6px 6px",
                        backgroundColor: activeNotes.includes(wk.note) ? activeWhiteColor : "white",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        boxShadow: "1px 5px 3px grey",
                        transition: "background-color 0.2s ease",
                    }}
                >
                    {/* No longer showing C labels inside keys */}
                    {activeNotes.includes(wk.note) && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 2,
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                fontSize: "0.8em",
                                pointerEvents: "none",
                                color: activeWhiteContrastColor,
                                fontWeight: "bold",
                            }}
                        >
                            {wk.note}
                        </Box>
                    )}
                </Box>
            ))}

            {/* Black keys */}
            {blackKeyPositions.map((bk) => (
                <Box
                    key={bk.midi}
                    sx={{
                        position: "absolute",
                        left: `calc((${bk.whiteIndex} + 1) * (100% / ${NUM_WHITE_KEYS}) - (${BLACK_KEY_WIDTH_PERCENT}% / 2))`,
                        width: `${BLACK_KEY_WIDTH_PERCENT}%`,
                        height: `${BLACK_KEY_HEIGHT_PERCENT}%`,
                        backgroundColor: activeNotes.includes(bk.note) ? activeBlackColor : "black",
                        border: "1px solid #222",
                        borderRadius: "0 0 4px 4px",
                        zIndex: 2,
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                        transition: "background-color 0.2s ease",
                    }}
                >
                    {activeNotes.includes(bk.note) && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 2,
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                fontSize: "0.7em",
                                color: activeBlackContrastColor,
                                fontWeight: "bold",
                                pointerEvents: "none",
                            }}
                        >
                            {bk.note}
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    );
}
