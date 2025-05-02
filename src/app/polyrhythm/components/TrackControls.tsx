// src/app/polyrhythm/components/TrackControls.tsx
"use client";

import React from "react";
import {
    Box,
    IconButton,
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
import CustomNumberInput from "./CustomNumberInput";

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
                flexWrap: { xs: "wrap", md: "nowrap" },
                gap: { xs: 1, sm: 1.5 },
                transition: "background-color 0.3s",
                opacity: isActive ? 1 : 0.3,
            }}
        >
            {/* First row: toggles + beat input */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    flexBasis: { xs: "100%", md: "auto" },
                    justifyContent: { xs: "center", md: "flex-start" },
                }}
            >
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
                <CustomNumberInput
                    value={beatNumber}
                    onChange={onChangeBeatNumber}
                />
            </Box>

            {/* Second row: sample, rotate, clear */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    flexBasis: { xs: "100%", md: "auto" },
                    justifyContent: { xs: "center", md: "space-between" },
                }}
            >
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
                <IconButton
                    onClick={onClearRhythm}
                    sx={{ p: 0.5, "& .MuiSvgIcon-root": { fontSize: 22 } }}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
