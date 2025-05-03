"use client";

import React from "react";
import {
    Box,
    Drawer,
    Modal,
    useMediaQuery,
    IconButton,
    Divider,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";

import { SettingsProvider, useSettingsContext } from "@src/contexts/SettingsContext";

interface SidePanelLayoutProps {
    header: React.ReactNode;
    panel: React.ReactNode;
    children: React.ReactNode;
}

function SidePanelLayoutContent({ header, panel, children }: SidePanelLayoutProps) {
    const { isOpen, openSettings, closeSettings } = useSettingsContext();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const wrappedPanel = (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Settings</Typography>
                <IconButton size="small" onClick={closeSettings}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            <Divider />
            {panel}
        </Box>
    );

    return (
        <Box sx={{ width: "100%" }}>
            {/* header slot */}
            <Box sx={{}}>{header}</Box>

            {/* desktop expander */}
            {isDesktop && !isOpen && (
                <IconButton
                    onClick={openSettings}
                    aria-label="Open settings"
                    size="large"
                    sx={{
                        position: "fixed",
                        top: "50%",
                        left: 0,
                        p: 5,
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        borderRadius: "0 8px 8px 0",
                        boxShadow: 3,
                        zIndex: 1300,
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ChevronRightIcon sx={{ ml: 3, width: 50, height: 50 }} />
                </IconButton>
            )}

            {/* side panel */}
            {isDesktop ? (
                <Drawer
                    anchor="left"
                    variant="persistent"
                    open={isOpen}
                    sx={{ display: { xs: "none", md: "block" } }}
                >
                    {wrappedPanel}
                </Drawer>
            ) : (
                <Modal open={isOpen} onClose={closeSettings}>
                    <Box
                        sx={{
                            position: "absolute",
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

            {/* main content */}
            <Box>{children}</Box>
        </Box>
    );
}

export default function SidePanelLayout(props: SidePanelLayoutProps) {
    return (
        <SettingsProvider>
            <SidePanelLayoutContent {...props} />
        </SettingsProvider>
    );
}
