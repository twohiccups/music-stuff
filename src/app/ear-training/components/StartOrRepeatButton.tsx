// src/app/ear-training/components/StartOrRepeatButton.tsx
import React from "react";
import { Button, Box } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEarTrainingContext } from "@src/contexts/EarTrainingContext";

export default function StartOrRepeatButton() {
    const { hasStarted, replay, start } = useEarTrainingContext();

    const repeatButton = (<>Repeat <ReplayIcon /></>);
    const playButton = (<>Play <PlayArrowIcon /></>);

    return (
        <Box sx={{ width: "100%", maxWidth: 400, mb: 3 }}>
            <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={hasStarted ? replay : start}
                sx={{ py: 2, fontSize: "1.125rem" }}
            >
                {hasStarted ? repeatButton : playButton}
            </Button>
        </Box>
    );
}
