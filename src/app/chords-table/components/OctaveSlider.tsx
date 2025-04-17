"use client";

import React from "react";
import { Box, Slider, Typography } from "@mui/material";

interface OctaveSliderProps {
    octave: number;
    setOctave: React.Dispatch<React.SetStateAction<number>>;
}

const OctaveSlider = ({ octave, setOctave }: OctaveSliderProps) => {
    const minOctave = 1;
    const maxOctave = 7;



    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        setOctave(newValue as number);
    };

    return (
        <Box sx={{ my: 3, textAlign: "center" }}>
            <Typography variant="h6">Octave</Typography>

            <Slider
                min={minOctave}
                max={maxOctave}
                step={1}
                value={octave}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                sx={{ width: 200, mx: "auto" }}
                marks={Array.from({ length: maxOctave - minOctave + 1 }, (_, i) => ({
                    value: minOctave + i,
                    label: `${minOctave + i}`,
                }))}
            />
        </Box>
    );
};

export default OctaveSlider;
