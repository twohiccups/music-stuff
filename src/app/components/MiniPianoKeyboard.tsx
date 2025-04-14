import React, { SetStateAction } from "react";
import { Box } from "@mui/material";

const FUNKY_WHITE_KEY_WIDTH = 50; // 7 white keys will total 350px in width
const FUNKY_WHITE_KEY_HEIGHT = 120;
const FUNKY_BLACK_KEY_WIDTH = 30;   // Maintain proportional width (previously 0.6 * white key width)
const FUNKY_BLACK_KEY_HEIGHT = 80;

const FUNKY_CONTAINER_WIDTH = 7 * FUNKY_WHITE_KEY_WIDTH; // 350px
const FUNKY_CONTAINER_HEIGHT = FUNKY_WHITE_KEY_HEIGHT;     // 60px

interface Key {
    note: string;
    left: number; // Position in pixels from the left edge
}

interface MiniPianoKeyboardProps {
    baseNote: string
    setBaseNote: React.Dispatch<SetStateAction<string>>;
}

// Define one octave of white keys.
const whiteKeys: Key[] = [
    { note: "C", left: 0 },
    { note: "D", left: FUNKY_WHITE_KEY_WIDTH },
    { note: "E", left: 2 * FUNKY_WHITE_KEY_WIDTH },
    { note: "F", left: 3 * FUNKY_WHITE_KEY_WIDTH },
    { note: "G", left: 4 * FUNKY_WHITE_KEY_WIDTH },
    { note: "A", left: 5 * FUNKY_WHITE_KEY_WIDTH },
    { note: "B", left: 6 * FUNKY_WHITE_KEY_WIDTH },
];

// Define one octave of black keys.
// (No black key exists between E and F.)
const blackKeys: Key[] = [
    {
        note: "C#",
        left: whiteKeys[0].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: "D#",
        left: whiteKeys[1].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: "F#",
        left: whiteKeys[3].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: "G#",
        left: whiteKeys[4].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: "A#",
        left: whiteKeys[5].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
];

export default function MiniPianoKeyboard({
    baseNote,
    setBaseNote,
}: MiniPianoKeyboardProps) {

    const handleNoteSelect = (note: string) => {
        setBaseNote(note)
    }
    return (
        <Box
            sx={{
                position: "relative",
                width: FUNKY_CONTAINER_WIDTH,
                height: FUNKY_CONTAINER_HEIGHT,
                // Removed the container border to avoid extra borders
                margin: "0 auto",
                backgroundColor: "#f0f0f0",
            }}
        >
            {/* Render white keys */}
            {whiteKeys.map((key) => (
                <Box
                    key={key.note}
                    onClick={() => handleNoteSelect(key.note)}
                    sx={{
                        position: "absolute",
                        left: key.left,
                        width: FUNKY_WHITE_KEY_WIDTH,
                        height: "100%",
                        border: "1px solid #666",
                        // Round only the bottom corners
                        borderRadius: "0 0 6px 6px",
                        backgroundColor: baseNote === key.note ? "#FFA500" : "white",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        transition: "background-color 0.2s ease",
                    }}
                >
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
                        {key.note}
                    </Box>
                </Box>
            ))}

            {/* Render black keys */}
            {blackKeys.map((key) => (
                <Box
                    key={key.note}
                    onClick={() => handleNoteSelect(key.note)}
                    sx={{
                        position: "absolute",
                        left: key.left,
                        width: FUNKY_BLACK_KEY_WIDTH,
                        height: FUNKY_BLACK_KEY_HEIGHT,
                        backgroundColor: baseNote === key.note ? "#FF4500" : "black",
                        border: "1px solid #222",
                        // Round only the bottom corners
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
