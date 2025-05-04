import React from "react";
import { Typography, Box, Fade } from "@mui/material";
import { useEarTrainingContext } from "@src/contexts/EarTrainingContext";

export default function Header() {
    const { levelIndex, centsDiff, hasStarted } = useEarTrainingContext();

    return (
        <Box
            sx={{
                textAlign: "center",
                mb: 4,
                height: 80, // fixed height to prevent layout shift
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <Fade in={hasStarted} timeout={300}>
                <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                        Level {levelIndex + 1}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                        Pitch Difference: <strong>{centsDiff} cents</strong>
                    </Typography>
                </Box>
            </Fade>
        </Box>
    );
}
