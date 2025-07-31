// src/components/InfoDialog.tsx
"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface InfoDialogProps {
    open: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({
    open,
    title = "Information",
    message,
    onClose,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Typography>{message}</Typography>
            </DialogContent>
        </Dialog>
    );
};

export default InfoDialog;
