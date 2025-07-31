"use client";

import React from "react";
import { Box, Paper, useTheme } from "@mui/material";
import { useSlidingIntervalsContext } from "@src/contexts/SlidingIntervalsContext";

export default function Header() {
    const { challenge } = useSlidingIntervalsContext();
    const theme = useTheme();

    return (
        <Box sx={{ textAlign: "center", mb: 3 }}>

            <Paper
                elevation={4}
                sx={{
                    display: "inline-block",
                    px: 3,
                    py: 1,
                    borderRadius: "999px",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    fontSize: "1rem",
                    mt: 1,
                }}
            >
                {challenge.interval.name}
            </Paper>
        </Box>
    );
}
