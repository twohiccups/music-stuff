"use client";

import React, { useRef } from "react";
import { Typography, Box, Divider, Button } from "@mui/material";
import * as Tone from "tone";
import InfoDialogShell from "@app/components/InfoDialogShell"; // assuming this is your reusable shell

export const difficultyCents = [
    2400, 1800, 1200, 700, 600, 400, 300, 200, 100, 50,
    25, 15, 10, 7, 5, 3, 2, 1.5, 1, 0.5, 0.25, 0.1
];

export default function InfoDialog({ open, onClose }: { open: boolean; onClose(): void }) {
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

    const replayLastSample = () => {
        if (lastSampleRef.current !== null) {
            playSample(lastSampleRef.current);
        }
    };

    return (
        <InfoDialogShell open={open} onClose={onClose} title="How to Use 🎧 Ear Training">
            <Typography gutterBottom>
                Welcome to <strong>🎧 Ear Training</strong> — a simple app to improve your pitch discrimination skills.
            </Typography>

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">🎯 Goal</Typography>
                <Typography>
                    Learn to tell whether a second tone is higher or lower in pitch compared to the first. As you progress,
                    the difference in pitch gets smaller, training your ear to hear fine variations.
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">🕹️ How to Use</Typography>
                <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                    <li>Click <strong>Play ▶</strong> to hear two tones.</li>
                    <li>Decide whether the second tone is <strong>higher</strong> or <strong>lower</strong> in pitch.</li>
                    <li>Press <em>Higher ↑</em> or <em>Lower ↓</em>.</li>
                    <li>If correct, your streak increases. Reach a 3-streak to level up!</li>
                    <li>The pitch difference gets smaller with each level.</li>
                    <li>Use <strong>Repeat</strong> or <kbd>Space</kbd> to replay tones.</li>
                    <li>Arrow keys (<kbd>↑</kbd> / <kbd>↓</kbd>) work on desktop too.</li>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">🔊 Sample Pitch Differences</Typography>
                <Typography sx={{ mb: 1 }}>
                    Pitch differences are measured in <strong>cents</strong> — <strong>100 cents = 1 semitone</strong>,
                    and <strong>1200 cents = 1 octave</strong>. A semitone is the distance between piano keys like C to C♯.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1, mb: 1 }}>
                    {[2400, 1200, 700, 100, 25, 3, 1].map((cents) => (
                        <Button
                            key={cents}
                            variant="outlined"
                            size="small"
                            onClick={() => playSample(cents)}
                        >
                            {cents} cents
                        </Button>
                    ))}
                    <Button
                        variant="contained"
                        size="small"
                        onClick={replayLastSample}
                        disabled={lastSampleRef.current === null}
                    >
                        🔁 Replay Last Sample
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">🧠 Skill Tiers (based on cent discrimination)</Typography>
                <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                    <li><strong>Novice Listener</strong>: Detects 100–200 cent differences.</li>
                    <li><strong>Music Enthusiast</strong>: Hears 50–100 cent changes.</li>
                    <li><strong>Trained Musician</strong>: Sensitive around 10–25 cents.</li>
                    <li><strong>Advanced Ear</strong>: Detects under 10 cents.</li>
                    <li><strong>Pro Piano Tuner</strong>: Below 1 cent precision.</li>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">💡 Tips</Typography>
                <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                    <li>Use headphones and hum the pitches.</li>
                    <li>Close your eyes to improve focus.</li>
                    <li>Take breaks — don&apos;t brute force!</li>
                    <li>Imagine singing the tones mentally.</li>
                    <li>Trust your first impression!</li>
                </Box>
            </Box>
        </InfoDialogShell>
    );
}
