"use client";

import React, { useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import * as Tone from "tone";
import InfoDialogShell from "@app/components/InfoDialogShell";

export default function EarTrainingInfoDialog({ open, onClose }: { open: boolean; onClose(): void }) {
    const lastSampleRef = useRef<number | null>(null);

    const playSample = (cents: number) => {
        const base = 440;
        const ratio = Math.pow(2, cents / 1200);
        const second = base * ratio;
        const now = Tone.now();

        const synth1 = new Tone.Synth().toDestination();
        const synth2 = new Tone.Synth().toDestination();

        synth1.triggerAttackRelease(base, 0.6, now + 0.1);
        synth2.triggerAttackRelease(second, 0.6, now + 1);

        setTimeout(() => {
            synth1.dispose();
            synth2.dispose();
        }, 2000);

        lastSampleRef.current = cents;
    };

    return (
        <InfoDialogShell open={open} onClose={onClose} title="How to Use 🎧 Ear Training">
            <Typography gutterBottom>
                Welcome to <strong>🎧 Ear Training</strong> — a simple app to improve your pitch discrimination skills.
            </Typography>
            {/* …rest of your detailed content... */}
            <Box mt={2}>
                <Typography variant="subtitle2">Try a sample:</Typography>
                {[2400, 100, 3, 1].map((cents) => (
                    <Button
                        key={cents}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mt: 1 }}
                        onClick={() => playSample(cents)}
                    >
                        {cents} cents
                    </Button>
                ))}
            </Box>
        </InfoDialogShell>
    );
}
