// src/app/components/ActionMenu.tsx
"use client";

import React from "react";
import {
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { useCommonActionsContext } from "@src/contexts/CommonActionsContext";
import { usePageActionsContext } from "@src/contexts/PageActionsContext";
import { useSettingsContext } from "./SidePanelLayout";  // <-- pull in openSettings
import type { Action } from "@src/types/types";

export default function ActionMenu() {
    const common = useCommonActionsContext();   // e.g. Theme toggle
    const page = usePageActionsContext();       // e.g. Info
    const { openSettings } = useSettingsContext();

    // create a Settings action
    const settingsAction: Action = {
        name: "Settings",
        icon: <SettingsIcon />,
        onClick: openSettings,
        mobileOnly: true
    };

    // combine them all
    const actions: Action[] = [...common, settingsAction, ...page];

    return (
        <SpeedDial
            ariaLabel="Quick actions"
            icon={
                <SpeedDialIcon icon={<MenuIcon />} openIcon={<CloseIcon />} />
            }
            sx={{ position: "fixed", bottom: 12, right: 12, zIndex: 1200 }}
            direction="up"
        >
            {actions.map(({ name, icon, onClick, mobileOnly }) => (
                <SpeedDialAction
                    key={name}
                    icon={icon}
                    tooltipTitle={name}
                    onClick={onClick}
                    sx={{
                        display: mobileOnly
                            ? { xs: "block", md: "none" }
                            : { xs: "block", md: "block" },
                    }}
                />
            ))}
        </SpeedDial>
    );
}
