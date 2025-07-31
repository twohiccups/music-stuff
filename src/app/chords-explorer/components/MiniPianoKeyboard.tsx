'use client';

import React, { SetStateAction } from 'react';
import { Box, useTheme } from '@mui/material';

const FUNKY_WHITE_KEY_WIDTH = 35;
const FUNKY_WHITE_KEY_HEIGHT = 120;
const FUNKY_BLACK_KEY_WIDTH = 26;
const FUNKY_BLACK_KEY_HEIGHT = 80;

const FUNKY_CONTAINER_WIDTH = 7 * FUNKY_WHITE_KEY_WIDTH; // 350px
const FUNKY_CONTAINER_HEIGHT = FUNKY_WHITE_KEY_HEIGHT;

interface Key {
    note: string;
    left: number;
}

interface MiniPianoKeyboardProps {
    baseNote: string;
    setBaseNote: React.Dispatch<SetStateAction<string>>;
}

// Single-octave white and black key definitions
const whiteKeys: Key[] = [
    { note: 'C', left: 0 },
    { note: 'D', left: FUNKY_WHITE_KEY_WIDTH },
    { note: 'E', left: 2 * FUNKY_WHITE_KEY_WIDTH },
    { note: 'F', left: 3 * FUNKY_WHITE_KEY_WIDTH },
    { note: 'G', left: 4 * FUNKY_WHITE_KEY_WIDTH },
    { note: 'A', left: 5 * FUNKY_WHITE_KEY_WIDTH },
    { note: 'B', left: 6 * FUNKY_WHITE_KEY_WIDTH },
];
const blackKeys: Key[] = [
    {
        note: 'C#',
        left: whiteKeys[0].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: 'D#',
        left: whiteKeys[1].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: 'F#',
        left: whiteKeys[3].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: 'G#',
        left: whiteKeys[4].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
    {
        note: 'A#',
        left: whiteKeys[5].left + FUNKY_WHITE_KEY_WIDTH - FUNKY_BLACK_KEY_WIDTH / 2,
    },
];

export default function MiniPianoKeyboard({ baseNote, setBaseNote }: MiniPianoKeyboardProps) {
    const theme = useTheme();
    const {
        white,
        black,
        activeWhite,
        activeBlack,
        whiteContrast,
        blackContrast,
    } = theme.palette.keyboard;

    const handleNoteSelect = (note: string) => {
        setBaseNote(note);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: FUNKY_CONTAINER_WIDTH,
                height: FUNKY_CONTAINER_HEIGHT,
                margin: '0 auto',
                bgcolor: theme.palette.background.paper,
            }}
        >
            {/* White keys */}
            {whiteKeys.map((key) => {
                const isActive = baseNote === key.note;
                return (
                    <Box
                        key={key.note}
                        onClick={() => handleNoteSelect(key.note)}
                        sx={{
                            position: 'absolute',
                            left: key.left,
                            width: FUNKY_WHITE_KEY_WIDTH,
                            height: '100%',
                            bgcolor: isActive ? activeWhite : white,
                            border: `1px solid ${whiteContrast}`,
                            borderRadius: '0 0 6px 6px',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'background-color 0.2s ease',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 2,
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                fontSize: '0.8em',
                                pointerEvents: 'none',
                                color: whiteContrast,
                                fontWeight: 'bold',
                            }}
                        >
                            {key.note}
                        </Box>
                    </Box>
                );
            })}

            {/* Black keys */}
            {blackKeys.map((key) => {
                const isActive = baseNote === key.note;
                return (
                    <Box
                        key={key.note}
                        onClick={() => handleNoteSelect(key.note)}
                        sx={{
                            position: 'absolute',
                            left: key.left,
                            width: FUNKY_BLACK_KEY_WIDTH,
                            height: FUNKY_BLACK_KEY_HEIGHT,
                            bgcolor: isActive ? activeBlack : black,
                            border: `1px solid ${blackContrast}`,
                            borderRadius: '0 0 4px 4px',
                            zIndex: 2,
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            transition: 'background-color 0.2s ease',
                        }}
                    />
                );
            })}
        </Box>
    );
}
