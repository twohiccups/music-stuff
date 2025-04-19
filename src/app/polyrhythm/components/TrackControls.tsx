// components/TrackControls.tsx
"use client";

import React from "react";
import {
    Box,
    IconButton,
    TextField,
    useTheme,
    useMediaQuery,
} from "@mui/material";
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
    const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1, sm: 2 },
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 1, sm: 2 },
                transition: "background-color 0.3s",
            }}
        >
            {/* activation & mute toggles */}
            <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
                <IconButton onClick={onSwitchActive} size={isSmUp ? "large" : "medium"}>
                    {isActive ? (
                        <ToggleOnIcon fontSize={isSmUp ? "large" : "medium"} />
                    ) : (
                        <ToggleOffIcon fontSize={isSmUp ? "large" : "medium"} />
                    )}
                </IconButton>
                <IconButton onClick={onSwitchMute} size={isSmUp ? "large" : "medium"}>
                    {isMute ? (
                        <VolumeOffIcon fontSize={isSmUp ? "large" : "medium"} />
                    ) : (
                        <VolumeUpIcon fontSize={isSmUp ? "large" : "medium"} />
                    )}
                </IconButton>
            </Box>

            {/* beat count input */}
            <TextField
                type="number"
                inputProps={{ min: 1, max: 64 }}
                value={beatNumber}
                onChange={(e) => onChangeBeatNumber(+e.target.value)}
                size="small"
                sx={{
                    width: { xs: "100%", sm: "64px" },
                }}
            />

            {/* rotation controls */}
            <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
                <IconButton
                    onClick={onRotateCCW}
                    size={isSmUp ? "large" : "medium"}
                >
                    <RotateLeftIcon fontSize={isSmUp ? "large" : "medium"} />
                </IconButton>
                <IconButton onClick={onRotateCW} size={isSmUp ? "large" : "medium"}>
                    <RotateRightIcon fontSize={isSmUp ? "large" : "medium"} />
                </IconButton>
            </Box>

            {/* clear/delete */}
            <IconButton onClick={onClearRhythm} size={isSmUp ? "large" : "medium"}>
                <DeleteIcon fontSize={isSmUp ? "large" : "medium"} />
            </IconButton>
        </Box>
    );
}
