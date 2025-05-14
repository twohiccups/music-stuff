// src/app/sliding-intervals/page.tsx
"use client";

import React from "react";
import { SlidingIntervalsProvider } from
    "@src/contexts/SlidingIntervalsContext";
import SidePanelLayout from "@app/components/SidePanelLayout";
import SettingsPanel from "@app/sliding-intervals/components/SettingsPanel";
import SlidingIntervalsTrainer from
    "@app/sliding-intervals/SlidingIntervalsTrainer";
import Header from "@app/sliding-intervals/components/Header";
import { PageActionsProvider } from "@src/contexts/PageActionsContext";
import InfoIcon from "@mui/icons-material/Info";
import ActionMenu from "@app/components/ActionMenu";
import InfoDialog from "@app/components/InfoDialog";
import { useState } from "react";
import SlidingIntervalsInfoDialog from "./components/SlidingIntervalsInfoDialog";

export default function SlidingIntervalsPage() {
    const [infoOpen, setInfoOpen] = useState(false);
    const actions = [
        { name: "Info", icon: <InfoIcon />, onClick: () => setInfoOpen(true) },
    ];

    return (
        <SlidingIntervalsProvider>
            <PageActionsProvider actions={actions}>
                <SidePanelLayout
                    header={<Header />}
                    panel={<SettingsPanel />}
                >
                    <InfoDialog open={infoOpen}
                        onClose={() => setInfoOpen(false)} title="Sliding Intervals"
                    >
                        <SlidingIntervalsInfoDialog />
                    </InfoDialog>
                    <SlidingIntervalsTrainer />
                    <ActionMenu />
                </SidePanelLayout>
            </PageActionsProvider>
        </SlidingIntervalsProvider >
    );
}
