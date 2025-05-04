"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useEarTrainingContext } from "@src/contexts/EarTrainingContext";

export default function StreakProgress() {
    const {
        hasStarted,
        correctStreak,
        justLeveledUp,
        acknowledgeLevelUp,
    } = useEarTrainingContext();

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (justLeveledUp) {
            setShowSuccess(true);
            const timeout = setTimeout(() => {
                setShowSuccess(false);
                acknowledgeLevelUp();
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [justLeveledUp, acknowledgeLevelUp]);

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 400,
                minHeight: 60, // stable shell to prevent layout shift
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
            }}
        >
            {hasStarted && (
                <>
                    <LinearProgress
                        variant="determinate"
                        value={showSuccess ? 100 : (correctStreak / 3) * 100}
                        sx={{
                            width: "100%",
                            height: 10,
                            borderRadius: 5,
                        }}
                    />
                    <Typography
                        variant="h5"
                        sx={{ mt: 1, textAlign: "center", width: "100%" }}
                    >
                        {showSuccess ? "✅ Level up! 🎉" : `Streak: ${correctStreak} / 3`}
                    </Typography>
                </>
            )}
        </Box>
    );
}
