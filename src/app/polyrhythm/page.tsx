// src/app/polyrhythm/page.tsx
"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";
import { PageActionsProvider } from "@src/contexts/PageActionsContext";

import SidePanelLayout from "@app/components/SidePanelLayout";
import ActionMenu from "@app/components/ActionMenu";
import InfoDialog from "@app/components/InfoDialog";
import SettingsPanel from "@app/polyrhythm/components/SettingsPanel";
import RhythmCircle from "@app/polyrhythm/components/RhythmCircle";

import type { Action } from "@src/types/types";
import Header from "@app/polyrhythm/components/Header";
import PolyrhythmInfoDialog from "@app/polyrhythm/components/PolyrhythmInfoDialog";

export default function PolyrhythmPage() {
    const { state, dispatch } = usePolyrhythm();
    const { tracks, currentBeat, lcm } = state;
    const [infoOpen, setInfoOpen] = useState(false);

    const pageActions: Action[] = [
        { name: "Info", icon: <InfoIcon />, onClick: () => setInfoOpen(true) },
    ];

    return (
        <PageActionsProvider actions={pageActions}>
            <SidePanelLayout
                header={<Header />}
                panel={<SettingsPanel />}
            >
                {/* Info modal */}

                <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} title="Polyrhythms" >
                    <PolyrhythmInfoDialog />
                </InfoDialog>

                {/* Main visualizer */}
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    <RhythmCircle
                        activeTracks={tracks.filter((t) => t.isActive)}
                        currentBeatIndex={currentBeat}
                        lcm={lcm}
                        onToggleBeat={(ti, step) =>
                            dispatch({ type: 'TOGGLE_BEAT', trackIdx: ti, step })
                        }
                    />
                </Box>

                {/* Floating actions */}
                <ActionMenu />
            </SidePanelLayout>
        </PageActionsProvider>
    );
}
