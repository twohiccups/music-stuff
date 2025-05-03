// src/app/polyrhythm/components/Header.tsx
"use client";

import React, { useState } from "react";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import * as Tone from "tone";

export default function Header() {
    const [isPlaying, setIsPlaying] = useState(false);
    const toggle = () => {
        if (isPlaying) Tone.getTransport().pause();
        else Tone.getTransport().start();
        setIsPlaying(!isPlaying);
    };

    return (
        <IconButton onClick={toggle} aria-label="Play/Pause" sx={{
            position: "absolute"
        }}>
            {isPlaying ? <PauseIcon sx={{ width: 60, height: 60 }} /> : <PlayArrowIcon sx={{ width: 60, height: 60 }} />}
        </IconButton>
    );
}
