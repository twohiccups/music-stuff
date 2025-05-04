"use client";

import React from "react";
import {
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { useCommonActionsContext } from "@src/contexts/CommonActionsContext";
import { useSettingsContext } from "@src/contexts/SettingsContext";
import { usePageActionsContext } from "@src/contexts/PageActionsContext";
import { Action } from "@src/types/types";

export default function ActionMenu() {
    const common = useCommonActionsContext();        // only “Theme”
    const page = usePageActionsContext();            // e.g. Info
    const { openSettings } = useSettingsContext();   // from SidePanelLayout

    // Explicit Settings action comes from our shared layout
    const settingsAction: Action = {
        name: "Settings",
        icon: <SettingsIcon />,
        onClick: openSettings,
        mobileOnly: true
    };

    const actions: Action[] = [
        // theme is already in `common`
        settingsAction,
        ...page,    // e.g. Info
        ...common,
    ];

    const WrapIcon = (icon: React.ReactNode) => (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {icon}
        </Box>
    );

    return (
        <SpeedDial
            ariaLabel="Quick actions"
            icon={<SpeedDialIcon icon={<MenuIcon />} openIcon={<CloseIcon />} />}
            sx={{
                position: "fixed",
                bottom: {
                    xs: 65, md: 12
                },
                right: 12,
                zIndex: 1200,
            }
            }
            direction="up"
        >
            {actions.map(({ name, icon, onClick, mobileOnly }) => (
                <SpeedDialAction
                    key={name}
                    icon={WrapIcon(icon)}
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
