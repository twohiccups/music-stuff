"use client";

import React, { useState } from "react";
import { Box, Button, Typography, Stack, LinearProgress } from "@mui/material";
import {
    EarTrainingProvider,
    useEarTrainingContext,
} from "@src/contexts/EarTrainingContext";
import InfoIcon from "@mui/icons-material/Info"
import { PageActionsProvider } from "@src/contexts/PageActionsContext";
import SidePanelLayout from "@app/components/SidePanelLayout";
import InfoDialog from "./components/InfoDialog";
import SettingsPanel from "./components/SettingsPanel";
import ActionMenu from "@app/components/ActionMenu";
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
            name: 'Info',
            icon: <InfoIcon />,
            onClick: () => setInfoOpen(true),
            mobileOnly: false,
        },
    ]



    return (
        <PageActionsProvider actions={pageActions}>
            <SidePanelLayout header={<></>} panel={<SettingsPanel/>}>
                <InfoDialog open={infoOpen} onClose={() => { setInfoOpen(false) }} />
                <ActionMenu />
                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 4,
                        py: 6,
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        🎧 Ear Training
                    </Typography>

                    {hasStarted && (
                        <Typography variant="h5" sx={{ mb: 4 }}>
                            Level {levelIndex + 1} — Pitch Difference: {centsDiff} cents
                        </Typography>
                    )}

                    <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={guessUp}
                            disabled={!hasStarted}
                            sx={{ px: 4, py: 2, fontSize: "1.5rem" }}
                        >
                            Up ↑
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={guessDown}
                            disabled={!hasStarted}
                            sx={{ px: 4, py: 2, fontSize: "1.5rem" }}
                        >
                            Down ↓
                        </Button>
                    </Stack>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={hasStarted ? replay : start}
                        sx={{ minWidth: 240, px: 4, py: 2, fontSize: "1.25rem" }}
                    >
                        {hasStarted ? "Repeat ⟳ (Space)" : "Play ▶"}
                    </Button>

                    {hasStarted && (
                        <>
                            <LinearProgress
                                variant="determinate"
                                value={(correctStreak / 3) * 100}
                                sx={{ width: 200, height: 10, mt: 4, borderRadius: 5 }}
                            />
                            <Typography variant="caption" sx={{ mt: 1 }}>
                                Streak: {correctStreak} / 3
                            </Typography></>
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
