// src/contexts/PolyrhythmContext.tsx
"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import * as Tone from "tone";
import { usePolyrhythmScheduler } from "@src/hooks/usePolyrhythm";
import useInstruments from "@src/hooks/useInstruments";


// gcd + lcm
const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

export interface Beat { isOn: boolean; }
export interface Track {
    index: number;
    isActive: boolean;
    isMute: boolean;
    beatNumber: number;
    beats: Beat[];
}

interface ContextValue {
    tracks: Track[];
    tempo: number;
    isPlaying: boolean;
    currentBeatIndex: number;
    globalLCM: number;
    initializeBeats: () => void;
    createPolyrhythm: () => Promise<void>;
    togglePlay: () => void;
    updateTrack: (idx: number, patch: Partial<Track>) => void;
    setTempo: (t: number) => void;
}

const PolyrhythmContext = createContext<ContextValue | undefined>(undefined);

export const usePolyrhythm = () => {
    const ctx = useContext(PolyrhythmContext);
    if (!ctx) throw new Error("usePolyrhythm must be inside PolyrhythmProvider");
    return ctx;
};

export const PolyrhythmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const synth = useInstruments("piano");

    const [tracks, setTracks] = useState<Track[]>(
        Array.from({ length: 4 }).map((_, i) => ({
            index: i,
            isActive: i < 2,
            isMute: false,
            beatNumber: i < 2 ? (i === 0 ? 4 : 3) : 4,
            beats: [],
        }))
    );
    const [tempo, setTempo] = useState(120);
    const [isPlaying, setPlaying] = useState(false);
    const [currentBeatIndex, setCurrentBeatIndex] = useState(0);

    const tracksRef = useRef(tracks);
    useEffect(() => { tracksRef.current = tracks }, [tracks]);

    const globalLCM = React.useMemo(() => {
        const actives = tracks.filter(t => t.isActive).map(t => t.beatNumber);
        return actives.length ? actives.reduce(lcm, actives[0]) : 1;
    }, [tracks]);

    const initializeBeats = () => {
        setTracks(ts =>
            ts.map(t => {
                if (!t.isActive) return t;
                return {
                    ...t,
                    beats: Array(globalLCM).fill(0).map((_, i) => ({
                        isOn: i % t.beatNumber === 0
                    })),
                };
            })
        );
        setCurrentBeatIndex(0);
    };

    const handleTick = useCallback((nextIndex: number, time: number) => {
        setCurrentBeatIndex(nextIndex);
        tracksRef.current.forEach(t => {
            if (t.isActive && !t.isMute && t.beats[nextIndex]?.isOn) {
                synth?.triggerAttackRelease("C4", "8n", time);
            }
        });
    }, [synth]);

    // schedule the loop
    usePolyrhythmScheduler(globalLCM, tempo, tracksRef, handleTick);

    const createPolyrhythm = async () => {
        await Tone.start();
        initializeBeats();
        if (!isPlaying) {
            Tone.Transport.start();
            setPlaying(true);
        }
    };
    const togglePlay = () => {
        if (isPlaying) Tone.Transport.pause();
        else Tone.Transport.start();
        setPlaying(p => !p);
    };
    const updateTrack = (idx: number, patch: Partial<Track>) =>
        setTracks(ts => ts.map(t => (t.index === idx ? { ...t, ...patch } : t)));

    return (
        <PolyrhythmContext.Provider
            value={{
                tracks,
                tempo,
                isPlaying,
                currentBeatIndex,
                globalLCM,
                initializeBeats,
                createPolyrhythm,
                togglePlay,
                updateTrack,
                setTempo,
            }}
        >
            {children}
        </PolyrhythmContext.Provider>
    );
};
