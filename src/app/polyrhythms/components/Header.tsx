"use client";

import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ShareIcon from "@mui/icons-material/Share";
import * as Tone from "tone";
import { keyframes } from "@emotion/react";
import { usePolyrhythm } from "@src/contexts/PolyrhythmContext";
import InfoDialog from "@app/chords-table/components/InfoDialog";

// Glow animation keyframes
const glow = keyframes`
  0% {
    box-shadow: 0 0 0px rgba(0, 255, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.9);
  }
  100% {
    box-shadow: 0 0 0px rgba(0, 255, 0, 0.6);
  }
`;

export default function Header() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [glowEffect, setGlowEffect] = useState(true);
    const { shareUrl } = usePolyrhythm();
    const [shareDialogOpen, setShareDialogOpen] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setGlowEffect(false), 2000);
        return () => clearTimeout(timeout);
    }, []);

    const toggle = () => {
        if (isPlaying) Tone.getTransport().pause();
        else Tone.getTransport().start();
        setIsPlaying(!isPlaying);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/polyrhythms?data=${encodeURIComponent(shareUrl())}`;
        try {
            await navigator.clipboard.writeText(url);
            setShareDialogOpen(true)

        } catch {
            alert("Failed to create a link. This must be my fault!");
        }
    };

    return (
        <>
            <IconButton
                onClick={toggle}
                aria-label="Play/Pause"
                sx={{
                    position: "absolute",
                    ml: 1,
                    mt: 1,
                    animation: glowEffect ? `${glow} 1.5s ease-in-out infinite` : "none",
                }}
            >
                {isPlaying ? (
                    <PauseIcon sx={{ width: 80, height: 80 }} />
                ) : (
                    <PlayArrowIcon sx={{ width: 80, height: 80 }} />
                )}
            </IconButton>

            <InfoDialog
                open={shareDialogOpen}
                title="Link copied to clipboard"
                message="You can share it with a friend or save this preset for later"
                onClose={() => setShareDialogOpen(false)}
            />


            <Tooltip title="Share rhythm">
                <IconButton
                    onClick={handleShare}
                    aria-label="Share"
                    sx={{ position: "absolute", right: 0, mr: 1, mt: 1 }}
                >
                    <ShareIcon sx={{ width: 80, height: 80 }} />
                </IconButton>
            </Tooltip>
        </>
    );
}
