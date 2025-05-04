"use client";

import React, { useState } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import {
    EarTrainingProvider,
    useEarTrainingContext,
} from "@src/contexts/EarTrainingContext";
import InfoIcon from "@mui/icons-material/Info";
import { PageActionsProvider } from "@src/contexts/PageActionsContext";
import SidePanelLayout from "@app/components/SidePanelLayout";
import InfoDialog from "./components/InfoDialog";
import SettingsPanel from "./components/SettingsPanel";
import ActionMenu from "@app/components/ActionMenu";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function EarTraining() {
    const {
        levelIndex,
        correctStreak,
        centsDiff,
        hasStarted,
        guessUp,
        guessDown,
        replay,
        start,
    } = useEarTrainingContext();

    const [infoOpen, setInfoOpen] = useState(false);

    const pageActions = [
        {
            name: "Info",
            icon: <InfoIcon />,
            onClick: () => setInfoOpen(true),
            mobileOnly: false,
        },
    ];

    return (
        <PageActionsProvider actions={pageActions}>
            <SidePanelLayout header={<></>} panel={<SettingsPanel />}>
                <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
                <ActionMenu />
                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,
                        py: 4,
                    }}
                >
                    <Typography variant="h4" gutterBottom textAlign="center">
                        🎧 Ear Training
                    </Typography>

                    {hasStarted && (
                        <Typography
                            variant="h6"
                            sx={{ mb: 4, textAlign: "center" }}
                        >
                            Level {levelIndex + 1} — Pitch Difference: {centsDiff} cents
                        </Typography>
                    )}

                    {/* Button Row with Equal Width */}
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
                            sx={{
                                flex: 1,
                                fontSize: "1.25rem",
                                py: 2,
                            }}
                        >
                            higher <ArrowUpwardIcon />
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={guessDown}
                            disabled={!hasStarted}
                            sx={{
                                flex: 1,
                                fontSize: "1.25rem",
                                py: 2,
                            }}
                        >
                            lower <ArrowDownwardIcon />
                        </Button>
                    </Box>

                    {/* Repeat/Start Button with Same Width */}
                    <Box sx={{ width: "100%", maxWidth: 400, mb: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={hasStarted ? replay : start}
                            sx={{ py: 2, fontSize: "1.125rem" }}
                        >
                            {hasStarted ? "Repeat ⟳ (Space)" : "Play ▶"}
                        </Button>
                    </Box>

                    {/* Streak Progress */}
                    {hasStarted && (
                        <>
                            <LinearProgress
                                variant="determinate"
                                value={(correctStreak / 3) * 100}
                                sx={{
                                    width: "100%",
                                    maxWidth: 200,
                                    height: 10,
                                    borderRadius: 5,
                                    mt: 2,
                                }}
                            />
                            <Typography variant="caption" sx={{ mt: 1 }}>
                                Streak: {correctStreak} / 3
                            </Typography>
                        </>
                    )}
                </Box>
            </SidePanelLayout>
        </PageActionsProvider>
    );
}

export default function EarTrainingPage() {
    return (
        <EarTrainingProvider>
            <EarTraining />
        </EarTrainingProvider>
    );
}
