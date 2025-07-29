"use client";

import React from "react";
import { Button } from "@mui/material";
import * as Tone from "tone";
import { useSlidingIntervalsContext } from "@src/contexts/SlidingIntervalsContext";

export default function PlaySampleButton() {
    const { challenge, volume, waveform } = useSlidingIntervalsContext();

    const handleClick = async () => {
        await Tone.start();

        const now = Tone.now();

        // 1. Play base
        const baseOsc = new Tone.Oscillator(challenge.baseFreq, waveform).toDestination();
        baseOsc.volume.value = Tone.gainToDb(volume);
        baseOsc.start(now).stop(now + 0.4);

        // 2. Play target
        const targetOsc = new Tone.Oscillator(challenge.targetFreq, waveform).toDestination();
        targetOsc.volume.value = Tone.gainToDb(volume);
        targetOsc.start(now + 0.5).stop(now + 0.9);

        // 3. Play both together
        const bothBase = new Tone.Oscillator(challenge.baseFreq, waveform).toDestination();
        const bothTarget = new Tone.Oscillator(challenge.targetFreq, waveform).toDestination();
        bothBase.volume.value = Tone.gainToDb(volume);
        bothTarget.volume.value = Tone.gainToDb(volume);

        bothBase.start(now + 1.1).stop(now + 2.1);
        bothTarget.start(now + 1.1).stop(now + 2.1);
    };

    return (

        <Button variant="contained" onClick={handleClick}>
            Play Sample
        </Button>
    );
}
