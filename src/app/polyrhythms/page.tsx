"use client";

import React, { useState, useEffect } from "react"; // ✅ include useEffect
import { Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";
import { PageActionsProvider } from "@src/contexts/PageActionsContext";

import SidePanelLayout from "@app/components/SidePanelLayout";
import ActionMenu from "@app/components/ActionMenu";
import AppInfoModal from "@app/components/AppInfoModal";
import SettingsPanel from "@app/polyrhythms/components/SettingsPanel";
import RhythmCircle from "@app/polyrhythms/components/RhythmCircle";

import type { Action } from "@src/types/types";
import Header from "@app/polyrhythms/components/Header";
import PolyrhythmInfoDialog from "@app/polyrhythms/components/PolyrhythmInfoDialog";

export default function PolyrhythmPage() {
    const { state, dispatch, loadFromUrl } = usePolyrhythm();
    const { tracks, currentBeat, lcm } = state;
    const [infoOpen, setInfoOpen] = useState(false);

    const pageActions: Action[] = [
        { name: "Info", icon: <InfoIcon />, onClick: () => setInfoOpen(true) },
    ];

    // ✅ Load rhythm from URL on first mount
    useEffect(() => {
        loadFromUrl();
    }, []);

    return (
        <PageActionsProvider actions={pageActions}>
            <SidePanelLayout
                header={<Header />}
                panel={<SettingsPanel />}
            >
                {/* Info modal */}
                <AppInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} title="Polyrhythms">
                    <PolyrhythmInfoDialog />
                </AppInfoModal>

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
