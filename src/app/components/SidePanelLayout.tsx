// src/app/components/SidePanelLayout.tsx
"use client";

import React, {
    ReactNode,
    createContext,
    useContext,
    useState,
} from "react";
import {
    Box,
    Drawer,
    Modal,
    useMediaQuery,
    ClickAwayListener,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";

type SettingsContextType = {
    openSettings(): void;
    closeSettings(): void;
};
const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);
export function useSettingsContext() {
    const ctx = useContext(SettingsContext);
    if (!ctx)
        throw new Error("useSettingsContext must be inside SidePanelLayout");
    return ctx;
}

interface SidePanelLayoutProps {
    header: ReactNode;
    panel: (args: { onClose(): void }) => ReactNode;
    children: ReactNode;
}

export default function SidePanelLayout({
    header,
    panel,
    children,
}: SidePanelLayoutProps) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const openSettings = () => setOpen(true);
    const closeSettings = () => setOpen(false);

    // Panel wrapper with close-X
    const wrappedPanel = (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1, pr: 1 }}>
                <IconButton onClick={closeSettings} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            {panel({ onClose: closeSettings })}
        </Box>
    );

    return (
        <SettingsContext.Provider value={{ openSettings, closeSettings }}>
            <Box sx={{ width: "100%" }}>
                {/* header slot */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {header}
                </Box>

                {/* desktop-only chevron to open */}
                {isDesktop && !open && (
                    <IconButton
                        onClick={openSettings}
                        aria-label="Open settings"
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: 0,
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            borderRadius: "0 4px 4px 0",
                            boxShadow: 1,
                            zIndex: 1300,
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                )}

                {/* drawer on desktop, modal on mobile */}
                {isDesktop ? (
                    <Drawer
                        anchor="left"
                        variant="persistent"
                        open={open}
                        sx={{ display: { xs: "none", md: "block" } }}
                    >
                        {wrappedPanel}
                    </Drawer>
                ) : (
                    <Modal open={open} onClose={closeSettings}>
                        <Box
                            sx={{
                                position: "absolute" as const,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "90%",
                                maxHeight: "80%",
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                borderRadius: 2,
                                overflowY: "auto",
                            }}
                        >
                            {wrappedPanel}
                        </Box>
                    </Modal>
                )}

                {/* page content: clicking away on desktop closes */}
                {isDesktop && open ? (
                    <ClickAwayListener onClickAway={closeSettings}>
                        <Box>{children}</Box>
                    </ClickAwayListener>
                ) : (
                    <Box>{children}</Box>
                )}
            </Box>
        </SettingsContext.Provider>
    );
}
