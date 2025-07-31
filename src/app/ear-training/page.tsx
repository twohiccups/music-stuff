"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { EarTrainingProvider } from "@src/contexts/EarTrainingContext";
import InfoIcon from "@mui/icons-material/Info";
import { PageActionsProvider } from "@src/contexts/PageActionsContext";
import SidePanelLayout from "@app/components/SidePanelLayout";
import InfoDialog from "@app/components/AppInfoModal";
import SettingsPanel from "./components/SettingsPanel";
import ActionMenu from "@app/components/ActionMenu";

// Newly extracted components
import Header from "./components/Header";
import GuessButtons from "./components/GuessButtons";
import StartOrRepeatButton from "./components/StartOrRepeatButton";
import StreakProgress from "./components/StreakProgress";
import PageTitleHeader from "@app/components/PageTitleHeader";
import EarTrainingInfoDialog from "./components/EarTrainingInfoDialog";

function EarTraining() {
    const [isInfoOpen, setInfoOpen] = useState(false);

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
            <SidePanelLayout header=
                {
                    <>
                        <PageTitleHeader title={'🎧 Ear Training'} absPosition />
                    </>
                } panel={<SettingsPanel />}>
                <InfoDialog open={isInfoOpen} onClose={() => { setInfoOpen(false) }} title={"🎧 Ear Training"} >
                    <EarTrainingInfoDialog />
                </InfoDialog>

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
                    <Header />
                    <GuessButtons />
                    <StartOrRepeatButton />
                    <StreakProgress />
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
