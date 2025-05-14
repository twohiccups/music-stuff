
// src/app/sliding-intervals/SlidingIntervalsTrainer.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Slider } from "@mui/material";
import { useSlidingIntervalsContext } from
    "@src/contexts/SlidingIntervalsContext";

export default function SlidingIntervalsTrainer() {
    const {
        challenge,
        userFreq,
        setUserFreq,
        startUser,
        stopUser,
    } = useSlidingIntervalsContext();

    const [mounted, setMounted] = useState(false);
    const [centsDiff, setCentsDiff] = useState<number | null>(null);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const lowerBound = challenge.baseFreq * 0.8;
    const upperBound = challenge.targetFreq * 1.2;

    const handleStart = async () => {
        setCentsDiff(null);
        await startUser();
    };
    const handleStop = () => {
        stopUser();
        const diff = 1200 *
            Math.log2(userFreq / challenge.targetFreq);
        setCentsDiff(diff);
    };

    const sliderStyles = {
        '& .MuiSlider-thumb': { width: 4, height: 32, borderRadius: 2 },
        '& .MuiSlider-track': { height: 16, borderRadius: 8 },
        '& .MuiSlider-rail': { height: 16, borderRadius: 8, opacity: 0.5 },
    };

    return (
        <Box sx={{ p: 4, flexGrow: 1 }}>
            <Box sx={{ my: 4 }}>
                <Slider
                    sx={sliderStyles}
                    min={lowerBound}
                    max={upperBound}
                    step={0.1}
                    value={userFreq}
                    onChange={(_, v) => setUserFreq(v as number)}
                    onMouseDown={handleStart}
                    onMouseUp={handleStop}
                    onTouchStart={handleStart}
                    onTouchEnd={handleStop}
                />
            </Box>
            {centsDiff !== null && (
                <Typography variant="h6" align="center">
                    {Math.abs(centsDiff) < 1
                        ? 'Perfect!'
                        : `Off by ${centsDiff.toFixed(1)} cents`}
                </Typography>
            )}
        </Box>
    );
}
