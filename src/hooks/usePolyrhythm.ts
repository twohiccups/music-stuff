import { useEffect, useRef } from "react";
import * as Tone from "tone";

export function usePolyrhythmScheduler(
    globalLCM: number,
    tempo: number,
    tracksRef: React.MutableRefObject<Track[]>,
    onTick: (nextIndex: number, time: number) => void
) {
    const loopRef = useRef<Tone.Loop>();

    // re‐configure transport when globalLCM changes or tempo changes
    useEffect(() => {
        if (loopRef.current) {
            loopRef.current.dispose();
            Tone.Transport.cancel(); // clear previous callbacks
        }

        // set new BPM
        Tone.Transport.bpm.rampTo(tempo, 0.1);

        // create a new Loop
        loopRef.current = new Tone.Loop((time) => {
            // compute next step index based on Transport ticks
            const position = Tone.Transport.position.split(":"); // ["0","0","n"]
            const quarterNotesElapsed = Tone.Transport.state === "started"
                ? Tone.Transport.ticks / Tone.Transport.PPQ
                : 0;
            const nextIndex = Math.floor(quarterNotesElapsed) % globalLCM;

            onTick(nextIndex, time);
        }, "4n");

        loopRef.current.start(0);

        return () => {
            loopRef.current?.dispose();
            Tone.Transport.cancel();
        };
    }, [globalLCM, tempo, onTick]);
}
