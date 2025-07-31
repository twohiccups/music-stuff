// components/TempoControls.tsx
"use client";

import React from "react";
import { Box, Slider, IconButton, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface Props {
    tempo: number;
    onTempoChange: (val: number) => void;
}

export default function TempoControls({ tempo, onTempoChange }: Props) {
    const decrease = () => onTempoChange(Math.max(30, tempo - 1));
    const increase = () => onTempoChange(Math.min(400, tempo + 1));

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                px: { xs: 1, md: 2 },
                py: { xs: 1, md: 0 },
                gap: { xs: 1, md: 2 },
            }}
        >
            <IconButton size="small" onClick={decrease} aria-label="Decrease tempo">
                <RemoveIcon fontSize="small" />
            </IconButton>

            <Slider
                value={tempo}
                min={30}
                max={400}
                step={1}
                size="small"
                aria-label="Tempo"
                sx={{ flex: 1, mx: { xs: 0.5, md: 2 } }}
                onChange={(_, v) => onTempoChange(v as number)}
            />

            <IconButton size="small" onClick={increase} aria-label="Increase tempo">
                <AddIcon fontSize="small" />
            </IconButton>

            <Typography
                variant="body2"
                sx={{ width: 48, textAlign: "center", userSelect: "none" }}
            >
                {tempo}
            </Typography>
        </Box>
    );
}
