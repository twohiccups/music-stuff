"use client";

import React from "react";
import { Box, Button, Slider, Typography } from "@mui/material";
import * as Tone from "tone";

interface BaseNoteSliderProps {
    baseNote: number;
    setBaseNote: React.Dispatch<React.SetStateAction<number>>;
}

const BaseNoteSlider = ({ baseNote, setBaseNote }: BaseNoteSliderProps) => {
    // Handle octave shift, ensuring the value stays within the MIDI range
    const handleOctaveChange = (direction: "up" | "down") => {
        setBaseNote((prev) => {
            const newNote = direction === "up" ? prev + 12 : prev - 12;
            return Math.max(21, Math.min(108, newNote));
        });
    };

    // Handle note change within the current octave
    const handleNoteChange = (_: Event, newValue: number | number[]) => {
        setBaseNote(newValue as number);
    };

    const octaveStart = baseNote - (baseNote % 12);

    // Generate labels for 12 notes in the current octave
    const noteLabels = Array.from({ length: 12 }, (_, i) => {
        return Tone.Frequency(octaveStart + i, "midi").toNote();
    }).map(note => note.substring(0, note.length - 1));


    return (
        <Box sx={{ my: 3, textAlign: "center" }}>
            <Typography variant="h6">Base Note: {Tone.Frequency(baseNote, "midi").toNote()}</Typography>
            
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2}}>
                <Button variant="contained" onClick={() => handleOctaveChange("down")}>
                    - Octave
                </Button>
                <Button variant="contained" onClick={() => handleOctaveChange("up")}>
                    + Octave
                </Button>
            </Box>
            <Slider
                min={octaveStart}
                max={octaveStart + 11}
                step={1}
                value={baseNote}
                onChange={handleNoteChange}
                valueLabelDisplay="auto"
                sx={{ width: 300, mx: "auto" }}
                marks={noteLabels.map((note, i) => ({
                    value: octaveStart + i,
                    label: note,
                }))}
            />
        </Box>
    );
};

export default BaseNoteSlider;
