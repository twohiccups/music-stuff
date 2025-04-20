// src/hooks/usePolyrhythmScheduler.ts
import { useEffect, useRef } from "react";
import * as Tone from "tone";

export function usePolyrhythmScheduler(
    globalLCM: number,
    tempo: number,
    onTick: (nextIndex: number, time: number) => void
) {
    const transport = Tone.getContext().transport;
    const onTickRef = useRef(onTick);

    // keep latest onTick in ref
    useEffect(() => {
        onTickRef.current = onTick;
    }, [onTick]);

    // smooth BPM ramps
    useEffect(() => {
        transport.bpm.rampTo(tempo, 0.1);
    }, [tempo, transport]);

    // schedule/re‑schedule only when LCM changes
    useEffect(() => {
        // clear *just* our old loop
        transport.cancel(0);

        // reset to start so step = 0
        transport.position = "0:0:0";

        // schedule a 4n loop from bar 0
        const id = transport.scheduleRepeat((time) => {
            const step = Math.floor(transport.ticks / transport.PPQ) % globalLCM;

            // UI sync
            Tone.Draw.schedule(() => {
                onTickRef.current(step, time);
            }, time);
        }, "4n", 0);

        // ensure the transport is running
        if (transport.state !== "started") {
            transport.start();
        }

        return () => {
            transport.clear(id);
        };
    }, [globalLCM, transport]);
}
