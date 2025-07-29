"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { SlidingIntervalsProvider } from "@src/contexts/SlidingIntervalsContext";
import SidePanelLayout from "@app/components/SidePanelLayout";
import SettingsPanel from "@app/sliding-intervals/components/SettingsPanel";
import SlidingIntervalsTrainer from "@app/sliding-intervals/components/SlidingIntervalsTrainer";
import Header from "@app/sliding-intervals/components/Header";
import { PageActionsProvider } from "@src/contexts/PageActionsContext";
import InfoIcon from "@mui/icons-material/Info";
import ActionMenu from "@app/components/ActionMenu";
import InfoDialog from "@app/components/InfoDialog";
import SlidingIntervalsInfoDialog from "@app/sliding-intervals/components/SlidingIntervalsInfoDialog";
import PlaySampleButton from "./components/PlaySampleButton";
import NewChallengeButton from "./components/NewChallengeButton";

export default function SlidingIntervalsPage() {
    const [infoOpen, setInfoOpen] = useState(false);
    const actions = [
        { name: "Info", icon: <InfoIcon />, onClick: () => setInfoOpen(true) },
    ];

    return (
        <SlidingIntervalsProvider>
            <PageActionsProvider actions={actions}>
                <SidePanelLayout
                    header={<></>}
                    panel={<SettingsPanel />}
                >
                    <InfoDialog
                        open={infoOpen}
                        onClose={() => setInfoOpen(false)}
                        title="Sliding Intervals"
                    >
                        <SlidingIntervalsInfoDialog />
                    </InfoDialog>

                    <Box
                        sx={{
                            mt: 4,
                            mx: "auto",
                            width: "100%",
                            px: 2,
                        }}
                    >
                        <Box sx={{ textAlign: "center", mb: 2 }}>
                            <Header />

                            <Box sx={{
                                display: 'flex',
                                gap: 3,
                                justifyContent: 'center'
                            }}>
                                <PlaySampleButton />
                                <NewChallengeButton />
                            </Box>

                        </Box>

                        <SlidingIntervalsTrainer />
                    </Box>

                    <ActionMenu />
                </SidePanelLayout>
            </PageActionsProvider>
        </SlidingIntervalsProvider>
    );
}
