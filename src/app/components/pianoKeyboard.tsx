import React from "react";
import { Box } from "@mui/material";
import * as Tone from "tone";

const WHITE_KEY_WIDTH = 40;
const WHITE_KEY_HEIGHT = 150;
const BLACK_KEY_WIDTH = 25;
const BLACK_KEY_HEIGHT = 90;

// Set a fixed number of white keys
const FIXED_WHITE_KEY_COUNT = 14;
const CONTAINER_WIDTH = FIXED_WHITE_KEY_COUNT * WHITE_KEY_WIDTH; // 560 px
const CONTAINER_HEIGHT = WHITE_KEY_HEIGHT; // 150 px

interface PianoKeyboardProps {
    activeNotes: string[];
    startMidi: number;
}

interface KeyPosition {
    midi: number;
    left: number; // in pixels (original design)
    note: string;
}

export default function PianoKeyboard({ activeNotes, startMidi }: PianoKeyboardProps) {
    let endMidi = startMidi;
    const whiteKeys: number[] = [];

    // Collect white keys until we have the fixed count.
    while (whiteKeys.length < FIXED_WHITE_KEY_COUNT) {
        const note = Tone.Frequency(endMidi, "midi").toNote();
        if (!note.includes("#")) {
            whiteKeys.push(endMidi);
        }
        endMidi++;
    }

    // Generate all MIDI numbers in the range.
    const midiNumbers: number[] = [];
    for (let m = startMidi; m < endMidi; m++) {
        midiNumbers.push(m);
    }

    // Calculate white key positions in pixels.
    const whiteKeyPositions: KeyPosition[] = whiteKeys.map((m, i) => ({
        midi: m,
        left: i * WHITE_KEY_WIDTH,
        note: Tone.Frequency(m, "midi").toNote() as string,
    }));

    // Calculate black key positions relative to the preceding white key.
    const blackKeyPositions: KeyPosition[] = midiNumbers
        .filter(m => Tone.Frequency(m, "midi").toNote().includes("#"))
        .map((m) => {
            const note = Tone.Frequency(m, "midi").toNote() as string;
            const whiteIndex = whiteKeys.indexOf(m - 1); // Assuming the preceding white key is m - 1.
            if (whiteIndex === -1) return null;
            const left = whiteKeyPositions[whiteIndex].left + WHITE_KEY_WIDTH - (BLACK_KEY_WIDTH / 2);
            return { midi: m, left, note };
        })
        .filter((bk): bk is KeyPosition => bk !== null);

    return (
        <Box
            sx={{
                position: "relative",
                // On desktop: fixed pixel dimensions; on mobile: full width with aspect ratio.
                width: { xs: "100%", sm: `${CONTAINER_WIDTH}px` },
                height: { xs: "auto", sm: `${CONTAINER_HEIGHT}px` },
                // On mobile, use aspect-ratio to compute height.
                aspectRatio: { xs: `${CONTAINER_WIDTH} / ${CONTAINER_HEIGHT}`, sm: "unset" },
                margin: "0px auto",
                border: "2px solid black",
            }}
        >
            {/* White Keys */}
            {whiteKeyPositions.map((wk) => (
                <Box
                    key={wk.midi}
                    sx={{
                        position: "absolute",
                        left: { xs: `${(wk.left / CONTAINER_WIDTH) * 100}%`, sm: wk.left },
                        width: { xs: `${(WHITE_KEY_WIDTH / CONTAINER_WIDTH) * 100}%`, sm: WHITE_KEY_WIDTH },
                        height: "100%",
                        border: "1px solid black",
                        backgroundColor: activeNotes.includes(wk.note) ? "#FFA500" : "white",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Label the white keys that represent a C note */}
                    {wk.note.startsWith("C") && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 4,
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                fontSize: "0.7em",
                                color: "black",
                                pointerEvents: "none",
                            }}
                        >
                            {wk.note}
                        </Box>
                    )}
                </Box>
            ))}

            {/* Black Keys */}
            {blackKeyPositions.map((bk) => (
                <Box
                    key={bk.midi}
                    sx={{
                        position: "absolute",
                        left: { xs: `${(bk.left / CONTAINER_WIDTH) * 100}%`, sm: bk.left },
                        width: { xs: `${(BLACK_KEY_WIDTH / CONTAINER_WIDTH) * 100}%`, sm: BLACK_KEY_WIDTH },
                        height: { xs: `${(BLACK_KEY_HEIGHT / CONTAINER_HEIGHT) * 100}%`, sm: BLACK_KEY_HEIGHT },
                        backgroundColor: activeNotes.includes(bk.note) ? "#FF0500" : "black",
                        border: "1px solid #333",
                        borderRadius: "0 0 3px 3px",
                        zIndex: 2,
                    }}
                />
            ))}
        </Box>
    );
}
