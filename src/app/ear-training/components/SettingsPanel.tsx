import React from "react";
import {
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Button,
    SelectChangeEvent,
} from "@mui/material";
import { difficultyCents, useEarTrainingContext } from "@src/contexts/EarTrainingContext";

export default function SettingsPanel() {
    const {
        hasStarted,
        resetTraining,
        setStartingLevel,
        startingLevelIndex,
        streakLength,
        setStreakLength,
    } = useEarTrainingContext();

    const handleLevelChange = (event: SelectChangeEvent<number>) => {
        const newLevel = Number(event.target.value);
        setStartingLevel(newLevel);
    };

    const handleStreakChange = (_: Event, value: number | number[]) => {
        setStreakLength(typeof value === "number" ? value : value[0]);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
            <Typography variant="subtitle1">Settings</Typography>

            {/* Starting Level Selector */}
            <FormControl fullWidth>
                <InputLabel>Starting Level</InputLabel>
                <Select<number>
                    value={startingLevelIndex}
                    onChange={handleLevelChange}
                    disabled={hasStarted}
                    label="Starting Level"
                >
                    {difficultyCents.map((cents, index) => (
                        <MenuItem key={index} value={index}>
                            Level {index + 1} — {cents} cents
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Streak Length */}
            <Box>
                <Typography gutterBottom>
                    Required Correct Streak: {streakLength}
                </Typography>
                <Slider
                    value={streakLength}
                    onChange={handleStreakChange}
                    step={1}
                    marks
                    min={1}
                    max={5}
                />
            </Box>

            {/* Reset Button */}
            <Button
                variant="outlined"
                color="error"
                onClick={resetTraining}
            >
                Reset Progress
            </Button>
        </Box>
    );
}
