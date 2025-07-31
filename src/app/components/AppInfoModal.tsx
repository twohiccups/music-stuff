// src/app/components/InfoDialogShell.tsx
"use client";

import React, { ReactNode } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface InfoDialogShellProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function AppInfoModal({
    open,
    onClose,
    title,
    children,
}: InfoDialogShellProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={fullScreen ? false : "sm"}
            fullScreen={fullScreen}
            sx={{
                "& .MuiDialog-paper": fullScreen
                    ? {
                        width: "100%",
                        height: "100%",
                        margin: 0,
                        borderRadius: 0,
                        display: "flex",
                        flexDirection: "column",
                    }
                    : {},
            }}
        >
            <DialogTitle sx={{ position: "relative", pr: 4 }}>
                {title}
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ flexGrow: 1, overflowY: "auto" }}>
                {children}
            </DialogContent>

            <DialogActions sx={{ flexShrink: 0 }}>
                <Button onClick={onClose} fullWidth={fullScreen}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
