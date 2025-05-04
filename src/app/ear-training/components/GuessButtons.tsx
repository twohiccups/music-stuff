// src/app/ear-training/components/GuessButtons.tsx
import React from "react";
import { Button, Box } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useEarTrainingContext } from "@src/contexts/EarTrainingContext";

export default function GuessButtons() {
    const { hasStarted, guessUp, guessDown } = useEarTrainingContext();

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                maxWidth: 400,
                mb: 3,
            }}
        >
            <Button
                variant="contained"
                size="large"
                onClick={guessUp}
                disabled={!hasStarted}
                sx={{ flex: 1, fontSize: "1.25rem", py: 2 }}
            >
                higher <ArrowUpwardIcon />
            </Button>
            <Button
                variant="contained"
                size="large"
                onClick={guessDown}
                disabled={!hasStarted}
                sx={{ flex: 1, fontSize: "1.25rem", py: 2 }}
            >
                lower <ArrowDownwardIcon />
            </Button>
        </Box>
    );
}