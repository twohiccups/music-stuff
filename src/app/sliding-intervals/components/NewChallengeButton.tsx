"use client";

import React from "react";
import { Button } from "@mui/material";
import { useSlidingIntervalsContext } from "@src/contexts/SlidingIntervalsContext";

export default function NewChallengeButton() {
    const { newChallenge } = useSlidingIntervalsContext();

    return (
        <Button
            onClick={newChallenge}
            variant="outlined"
        >
            New Challenge
        </Button>
    );
}
