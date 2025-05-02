"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function InfoDialog({ open, onClose }: { open: boolean; onClose(): void }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Info
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    This is a chord player. Choose a chord and hear how it sounds.
                </Typography>
                {/* … */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
