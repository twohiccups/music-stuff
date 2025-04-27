"use client"

import { PageActionsProvider } from "@src/contexts/pageActionsContext";
import { PolyrhythmProvider } from "@src/contexts/polyrhythmContext";
import { ReactNode } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import ActionMenu from "@app/components/ActionMenu";

const pageActions = [
    {
        name: "Settings",
        icon: <SettingsIcon />,
        onClick: () => alert("Open your settings…"),
        mobileOnly: true
    },
];

export default function PolyrhythmLayout({ children }: { children: ReactNode }) {
    return (
        <PolyrhythmProvider>
            <PageActionsProvider actions={pageActions}>
                {children}
                <ActionMenu />
            </PageActionsProvider>
        </PolyrhythmProvider>
    );
}
