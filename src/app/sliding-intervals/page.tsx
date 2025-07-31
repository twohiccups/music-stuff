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
import AppInfoModal from "@app/components/AppInfoModal";
import SlidingIntervalsInfoDialog from "@app/sliding-intervals/components/SlidingIntervalsInfoDialog";
import PlaySampleButton from "./components/PlaySampleButton";
import NewChallengeButton from "./components/NewChallengeButton";
import PageTitleHeader from "@app/components/PageTitleHeader";

export default function SlidingIntervalsPage() {
    const [infoOpen, setInfoOpen] = useState(false);
    const actions = [
        { name: "Info", icon: <InfoIcon />, onClick: () => setInfoOpen(true) },
    ];

    return (
        <SlidingIntervalsProvider>
            <PageActionsProvider actions={actions}>
                <SidePanelLayout
                    header={<>
                        <PageTitleHeader
                            title={'Sliding Intervals'}
                            subtitle={'Match the interval using the slider'}
                        />
                    </>
                    }
                    panel={<SettingsPanel />}
                >
                    <AppInfoModal
                        open={infoOpen}
                        onClose={() => setInfoOpen(false)}
                        title="Sliding Intervals"
                    >
                        <SlidingIntervalsInfoDialog />
                    </AppInfoModal>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            px: 2,
                            width: '80%',
                            textAlign: 'center',
                        }}
                    >
                        <Header />

                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <PlaySampleButton />
                            <NewChallengeButton />
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <SlidingIntervalsTrainer />
                        </Box>
                    </Box>



                    <ActionMenu />
                </SidePanelLayout>
            </PageActionsProvider>
        </SlidingIntervalsProvider>
    );
}
