"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface InfoDialogShellProps {
    open: boolean;
    onClose(): void;
    title: string;
    children: React.ReactNode;
}

export default function InfoDialogShell({ open, onClose, title, children }: InfoDialogShellProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {title}
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
