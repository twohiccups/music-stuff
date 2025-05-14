
"use client";

import React from "react";
import {
    Box,
    Typography,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSlidingIntervalsContext } from
    "@src/contexts/SlidingIntervalsContext";
import { ToneOscillatorType } from "tone";

export default function SettingsPanel() {
    const {
        newChallenge,
        volume,
        setVolume,
        waveform,
        setWaveform,
    } = useSlidingIntervalsContext();

    const sliderStyles = {
        '& .MuiSlider-thumb': {
            width: 4,
            height: 32,
            backgroundColor: 'primary.main',
            borderRadius: 2,
        },
        '& .MuiSlider-track': { height: 16, borderRadius: 8 },
        '& .MuiSlider-rail': { height: 16, borderRadius: 8, opacity: 0.5 },
    };

    return (
        <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="subtitle2">Controls</Typography>

            <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>🔊 Volume</Typography>
                <Slider
                    sx={sliderStyles}
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(_, v) => setVolume(v as number)}
                />
            </Box>

            <Box sx={{ mt: 4 }}>
                <FormControl fullWidth>
                    <InputLabel id="waveform-label">Waveform</InputLabel>
                    <Select
                        labelId="waveform-label"
                        value={waveform}
                        label="Waveform"
                        onChange={(e) => setWaveform(e.target.value as ToneOscillatorType)}
                    >
                        <MenuItem value="sine">Sine</MenuItem>
                        <MenuItem value="square">Square</MenuItem>
                        <MenuItem value="triangle">Triangle</MenuItem>
                        <MenuItem value="sawtooth">Sawtooth</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={newChallenge}
                >
                    New Interval
                </Button>
            </Box>
        </Box>
    );
}
