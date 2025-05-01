// src/app/polyrhythm/components/Header.tsx
"use client";

import React, { useState } from "react";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import * as Tone from "tone";

export default function Header() {
    const [isPlaying, setIsPlaying] = useState(true);
    const toggle = () => {
        if (isPlaying) Tone.Transport.pause();
        else Tone.Transport.start();
        setIsPlaying(!isPlaying);
    };

    return (
        <IconButton onClick={toggle} aria-label="Play/Pause">
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
    );
}
