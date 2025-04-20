// components/TrackControls.tsx
"use client";

import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import DeleteIcon from "@mui/icons-material/Delete";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";

interface Props {
    index: number;
    isActive: boolean;
    isMute: boolean;
    beatNumber: number;
    onSwitchActive: () => void;
    onSwitchMute: () => void;
    onRotateCW: () => void;
    onRotateCCW: () => void;
    onClearRhythm: () => void;
    onChangeBeatNumber: (val: number) => void;
}

export default function TrackControls({
    isActive,
    isMute,
    beatNumber,
    onSwitchActive,
    onSwitchMute,
    onRotateCW,
    onRotateCCW,
    onClearRhythm,
    onChangeBeatNumber,
}: Props) {
    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 2, sm: 2 },
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "row",            // always row
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 1.5, sm: 2 },         // a bit tighter on xs
            }}
        >
            {/* activation & mute toggles */}
            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                    onClick={onSwitchActive}
                    sx={{ p: { xs: 1.25, sm: 1 }, "& .MuiSvgIcon-root": { fontSize: { xs: 24, sm: 28 } } }}
                >
                    {isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </IconButton>
                <IconButton
                    onClick={onSwitchMute}
                    sx={{ p: { xs: 1.25, sm: 1 }, "& .MuiSvgIcon-root": { fontSize: { xs: 24, sm: 28 } } }}
                >
                    {isMute ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
            </Box>

            {/* beat count input */}
            <TextField
                type="number"
                inputProps={{ min: 1, max: 64 }}
                value={beatNumber}
                onChange={(e) => onChangeBeatNumber(+e.target.value)}
                size="small"
                sx={{ width: { xs: "56px", sm: "64px" } }}
            />

            {/* rotation controls */}
            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                    onClick={onRotateCCW}
                    sx={{ p: { xs: 1.25, sm: 1 }, "& .MuiSvgIcon-root": { fontSize: { xs: 24, sm: 28 } } }}
                >
                    <RotateLeftIcon />
                </IconButton>
                <IconButton
                    onClick={onRotateCW}
                    sx={{ p: { xs: 1.25, sm: 1 }, "& .MuiSvgIcon-root": { fontSize: { xs: 24, sm: 28 } } }}
                >
                    <RotateRightIcon />
                </IconButton>
            </Box>

            {/* clear/delete */}
            <IconButton
                onClick={onClearRhythm}
                sx={{ p: { xs: 1.25, sm: 1 }, "& .MuiSvgIcon-root": { fontSize: { xs: 24, sm: 28 } } }}
            >
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}
