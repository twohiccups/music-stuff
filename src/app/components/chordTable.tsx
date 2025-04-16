"use client";

import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { chords } from "../data/constants";
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface ChordTableProps {
    playChord: (type: string, inversion: string) => void;
    buttonColor?: string;
}

// Define mappings for inversions
const INVERSION_MAP = [
    { label: "Root", key: "root" },
    { label: "1st", key: "inv1" },
    { label: "2nd", key: "inv2" },
    { label: "3rd", key: "inv3" },
];

export default function ChordTable({
    playChord,
    buttonColor = 'white'
}: ChordTableProps) {
    const chordTypes = Object.keys(chords);

    // State to track selected chord and inversion
    const [selectedChord, setSelectedChord] = useState<string | null>(null);
    const [selectedInversion, setSelectedInversion] = useState<string | null>(null);

    const handleChordClick = (type: string, inversion: string) => {
        setSelectedChord(type);
        setSelectedInversion(inversion);
        playChord(type, inversion);

        // Reset selection after 1.5 seconds
        setTimeout(() => {
            setSelectedChord(null);
            setSelectedInversion(null);
        }, 1500);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2, overflow: 'visible' }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: `80px repeat(${chordTypes.length}, 50px)`, // Desktop layout
                    gap: 1,
                    padding: "2rem",
                    alignItems: "center",
                    justifyItems: "center",
                    maxWidth: "100%",
                    "@media (max-width: 1000px)": {
                        gridTemplateColumns: `minmax(50px, 1fr) repeat(${INVERSION_MAP.length}, minmax(40px, 1fr))`,
                        gridTemplateRows: `minmax(40px, auto) repeat(${chordTypes.length}, minmax(40px, auto))`,
                        width: "100%",
                        padding: "1rem",
                        gap: "4px",
                    },
                }}
            >
                {/* Empty top-left cell */}
                <Box sx={{ height: "60px", width: "80px", "@media (max-width: 1000px)": { display: "none" } }} />

                {/* Chord type labels */}
                {chordTypes.map((type, index) => (
                    <Box
                        key={type}
                        sx={{
                            width: "60px",
                            height: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                            textAlign: "left",
                            fontWeight: "bold",
                            transform: "rotate(-50deg)",
                            transformOrigin: "left bottom",
                            position: "relative",
                            left: "50px",
                            bottom: "-10px",
                            "@media (max-width: 1000px)": {
                                transform: "rotate(0)",
                                gridColumn: "1 / span 1",
                                gridRow: `${index + 2} / span 1`,
                                justifyContent: "center",
                                textAlign: "center",
                                left: 0,
                                bottom: 0,
                                marginRight: '1.5rem'
                            },
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: "bold",
                                fontVariant: 'small-caps',
                                whiteSpace: "nowrap",
                                color: selectedChord === type ? "blue" : "inherit", // Change text color temporarily
                                transition: "color 0.3s ease",
                                "@media (max-width: 1000px)": {
                                    whiteSpace: "wrap",
                                },
                                padding: 1,
                                borderRadius: 2

                            }}
                        >
                            {type}
                        </Typography>
                    </Box>
                ))}

                {/* Inversion labels and chord buttons */}
                {INVERSION_MAP.map(({ label, key }, invIndex) => (
                    <React.Fragment key={key}>
                        {/* Inversion labels */}
                        <Box
                            sx={{
                                width: "60px",
                                textAlign: "center",
                                "@media (max-width: 1000px)": {
                                    gridColumn: `${invIndex + 2} / span 1`,
                                    gridRow: "1 / span 1",
                                    textAlign: "center",
                                    width: "auto",
                                    transform: "rotate(-60deg)",
                                },
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    whiteSpace: "nowrap",
                                    fontVariant: 'small-caps',
                                    fontWeight: "bold",
                                    color: selectedInversion === key ? "blue" : "inherit",
                                    transition: "color 0.3s ease",
                                }}
                            >
                                {label}
                            </Typography>
                        </Box>

                        {/* Chord buttons */}
                        {chordTypes.map((type) => {
                            const chordExists = !!chords[type]?.[key];
                            if (chordExists) {
                                return (
                                    <Button
                                        key={`${type}-${key}`}
                                        onClick={() => handleChordClick(type, key)}
                                        disabled={!chordExists}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 5,
                                            border: "none",
                                            boxShadow: "0px 3px 2px #581B7E",
                                            width: "100%",
                                            aspectRatio: "1/1",
                                            minWidth: 40,
                                            minHeight: 40,
                                            padding: 0,
                                            textAlign: "center",
                                            fontSize: "0.8rem",
                                            backgroundColor: selectedChord === type && selectedInversion === key ? "rgba(255, 255, 0, 0.2)" : buttonColor,
                                            transition: "background-color 0.3s ease, border-color 0.3s ease",
                                            "@media (max-width: 1000px)": {
                                                minWidth: "initial",
                                                minHeight: "initial",
                                                fontSize: "0.7rem",
                                                gridColumn: `${invIndex + 2} / span 1`,
                                                gridRow: `${chordTypes.indexOf(type) + 2} / span 1`,
                                            },
                                        }}
                                    >
                                        {chordExists ? <MusicNoteIcon /> : "x"}
                                    </Button>
                                );
                            } else return (
                                <Button
                                    key={`${type}-${key}`}
                                    disabled={true}
                                    variant="outlined"
                                    sx={{
                                        width: "100%",
                                        borderRadius: 5,
                                        aspectRatio: "1/1",
                                        minWidth: 40,
                                        minHeight: 40,
                                        padding: 0,
                                        border: 'none !important',
                                        color: buttonColor,
                                        backgroundColor: buttonColor,
                                        "@media (max-width: 1000px)": {
                                            minWidth: "initial",
                                            minHeight: "initial",
                                            gridColumn: `${invIndex + 2} / span 1`,
                                            gridRow: `${chordTypes.indexOf(type) + 2} / span 1`,
                                        },
                                    }}
                                >  </Button>

                            )

                        })}
                    </React.Fragment>
                ))}
            </Box>
        </Box >
    );
}
