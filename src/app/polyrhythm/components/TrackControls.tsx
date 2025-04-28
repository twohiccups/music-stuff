"use client";

import React from "react";
import {
    Box,
    IconButton,
    TextField,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import DeleteIcon from "@mui/icons-material/Delete";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { percussionSampleMap } from "@src/hooks/useInstruments";

interface Props {
    index: number;
    isActive: boolean;
    isMute: boolean;
    beatNumber: number;
    sampleName: string;
    onSwitchActive: () => void;
    onSwitchMute: () => void;
    onRotateCW: () => void;
    onRotateCCW: () => void;
    onClearRhythm: () => void;
    onChangeBeatNumber: (val: number) => void;
    onChangeSample: (name: string) => void;
}

export default function TrackControls({
    index,
    isActive,
    isMute,
    beatNumber,
    sampleName,
    onSwitchActive,
    onSwitchMute,
    onRotateCW,
    onRotateCCW,
    onClearRhythm,
    onChangeBeatNumber,
    onChangeSample,
}: Props) {
    const theme = useTheme();
    const sampleNames = Object.keys(percussionSampleMap);

    return (
        <Box
            sx={{
                minHeight: 56,
                width: "100%",
                p: { xs: 1, sm: 2 },
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: isActive
                    ? "background.paper"
                    : theme.palette.custom.disabledBackground,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 0.5, sm: 1.5 },
                flexWrap: "nowrap",
                transition: "background-color 0.3s",
                opacity: isActive ? 1 : 0.3,
            }}
        >
            {/* activation & mute toggles */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                    onClick={onSwitchActive}
                    sx={{ p: 0.5, "& .MuiSvgIcon-root": { fontSize: 22 } }}
                >
                    {isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </IconButton>
                <IconButton
                    onClick={onSwitchMute}
                    sx={{ p: 0.5, "& .MuiSvgIcon-root": { fontSize: 22 } }}
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

            {/* sample selector */}
            <FormControl size="small" sx={{ minWidth: 130, maxWidth: 130 }}>
                <InputLabel id={`sample-select-${index}`}>Sample</InputLabel>
                <Select
                    labelId={`sample-select-${index}`}
                    value={sampleName}
                    label="Sample"
                    onChange={(e) => onChangeSample(e.target.value)}
                >
                    {sampleNames.map((name) => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* rotation controls */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                    onClick={onRotateCCW}
                    sx={{ p: 0.5, "& .MuiSvgIcon-root": { fontSize: 22 } }}
                >
                    <RotateLeftIcon />
                </IconButton>
                <IconButton
                    onClick={onRotateCW}
                    sx={{ p: 0.5, "& .MuiSvgIcon-root": { fontSize: 22 } }}
                >
                    <RotateRightIcon />
                </IconButton>
            </Box>

            {/* clear/delete */}
            <IconButton
                onClick={onClearRhythm}
                sx={{ p: 0.5, "& .MuiSvgIcon-root": { fontSize: 22 } }}
            >
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}
