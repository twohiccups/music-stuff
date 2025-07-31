
// src/app/sliding-intervals/SlidingIntervalsTrainer.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Slider, useTheme } from "@mui/material";
import { useSlidingIntervalsContext } from
    "@src/contexts/SlidingIntervalsContext";

export default function SlidingIntervalsTrainer() {

    const theme = useTheme()


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
    const getFeedback = (centsDifference: number): string => {
        centsDifference = Math.abs(centsDifference);
        if (centsDifference < 3) return "🎯 Perfect!";
        if (centsDifference < 8) return "💫 Excellent!";
        if (centsDifference < 20) return "👍 Good job!";
        if (centsDifference < 35) return "🙂 Close, keep refining!";
        if (centsDifference < 60) return "🧐 Getting there";
        return "👂 Keep going!";
    };


    const radius = 32; // adjust as needed

    const sliderStyles = {
        '& .MuiSlider-thumb': {
            width: 4,
            height: 64,
            borderRadius: 2,
            backgroundColor: !!centsDiff && Math.abs(centsDiff) < 3 ? "green" : ""
        },
        '& .MuiSlider-track': {
            height: 64,
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        '& .MuiSlider-rail': {
            height: 64,
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
            backgroundColor: theme.palette.primary.dark,
            opacity: 0.5,
        },
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
            <Typography
                variant="h6"
                align="center"
                sx={{
                    minHeight: '1.5em', // Reserve space even when empty
                    visibility: centsDiff === null ? 'hidden' : 'visible',
                }}
            >
                {centsDiff !== null
                    ? `${getFeedback(centsDiff)} Off by ${centsDiff.toFixed(1)} cents`
                    : ''}
            </Typography>


        </Box>
    );
}
