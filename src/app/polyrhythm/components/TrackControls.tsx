"use client";

import React from "react";
import { Box, IconButton, TextField, useTheme } from "@mui/material";
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
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1, sm: 2 },
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: isActive
                    ? "background.paper"
                    : theme.palette.custom.disabledBackground, // <-- use theme's chord.inactive
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 0.5, sm: 1.5 },
                flexWrap: "nowrap",
                transition: "background-color 0.3s",
                opacity: isActive ? 1 : 0.3
            }}
        >
            {/* activation & mute toggles */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                    onClick={onSwitchActive}
                    sx={{
                        p: 0.5,
                        "& .MuiSvgIcon-root": { fontSize: 22 },
                    }}
                >
                    {isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </IconButton>
                <IconButton
                    onClick={onSwitchMute}
                    sx={{
                        p: 0.5,
                        "& .MuiSvgIcon-root": { fontSize: 22 },
                    }}
                >
                    {isMute ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
            </Box>

            {/* beat count input */}
            <TextField
                type="number"
                inputProps={{
                    min: 1,
                    max: 64,
                    style: { textAlign: "center", padding: "4px" },
                }}
                value={beatNumber}
                onChange={(e) => onChangeBeatNumber(+e.target.value)}
                size="small"
                sx={{ width: "50px" }}
            />

            {/* rotation controls */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                    onClick={onRotateCCW}
                    sx={{
                        p: 0.5,
                        "& .MuiSvgIcon-root": { fontSize: 22 },
                    }}
                >
                    <RotateLeftIcon />
                </IconButton>
                <IconButton
                    onClick={onRotateCW}
                    sx={{
                        p: 0.5,
                        "& .MuiSvgIcon-root": { fontSize: 22 },
                    }}
                >
                    <RotateRightIcon />
                </IconButton>
            </Box>

            {/* clear/delete */}
            <IconButton
                onClick={onClearRhythm}
                sx={{
                    p: 0.5,
                    "& .MuiSvgIcon-root": { fontSize: 22 },
                }}
            >
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}
