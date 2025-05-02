// src/context/PolyrhythmContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import * as Tone from "tone";
import useInstruments, { percussionSampleMap } from "@src/hooks/useInstruments";

// ─── Types ──────────────────────────────────────────────────
export interface Beat { isOn: boolean; }
export interface Track {
    index: number;
    beatNumber: number;
    beats: Beat[];            // length === state.lcm
    isActive: boolean;
    isMute: boolean;
    sampleName: string;       // which percussion sample to play
}

interface State {
    tracks: Track[];
    currentBeat: number;
    lcm: number;
    tempo: number;
}

type Action =
    | { type: "ADVANCE_BEAT"; next: number }
    | { type: "TOGGLE_BEAT"; trackIdx: number; step: number }
    | { type: "TOGGLE_ACTIVE"; trackIdx: number }
    | { type: "TOGGLE_MUTE"; trackIdx: number }
    | { type: "CHANGE_BEATNUMBER"; trackIdx: number; beatNumber: number }
    | { type: "CHANGE_SAMPLE"; trackIdx: number; sampleName: string }
    | { type: "CHANGE_TEMPO"; tempo: number }
    | { type: "ROTATE_CW"; trackIdx: number }
    | { type: "ROTATE_CCW"; trackIdx: number }
    | { type: "CLEAR_BEATS"; trackIdx: number }
    | { type: "CHANGE_SAMPLE", trackIdx: number, sampleName: string };





// ─── Helpers ────────────────────────────────────────────────
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }

/**
 * Given an array of tracks, compute new LCM and rebuild each track.beats
 */
function rebuildState(tracks: Track[]): { tracks: Track[]; lcm: number } {
    const activeBeats = tracks.filter(t => t.isActive).map(t => t.beatNumber);
    const newLcm = activeBeats.length === 0
        ? 1
        : activeBeats.reduce((acc, n) => lcm(acc, n), activeBeats[0]);

    const rebuilt = tracks.map(t => ({
        ...t,
        beats: Array.from({ length: newLcm }, (_, i) => ({
            isOn: t.isActive ? i % t.beatNumber === 0 : false,
        })),
    }));

    return { tracks: rebuilt, lcm: newLcm };
}

// ─── Initial setup ─────────────────────────────────────────
const initialBeatNumbers = [4, 3, 4, 3];
const sampleNames = Object.keys(percussionSampleMap);
const {
    tracks: initialTracks,
    lcm: initialLcm,
} = rebuildState(
    initialBeatNumbers.map((bn, idx) => ({
        index: idx,
        beatNumber: bn,
        isActive: idx < 2,
        isMute: false,
        beats: [],      // will be set in rebuildState
        sampleName: sampleNames[idx] || sampleNames[0],
    })) as Track[]
);

const initialState: State = {
    tracks: initialTracks,
    currentBeat: 0,
    lcm: initialLcm,
    tempo: 120,
};

// ─── Reducer ────────────────────────────────────────────────
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "ADVANCE_BEAT":
            return { ...state, currentBeat: action.next };

        case "TOGGLE_BEAT":
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? { ...t, beats: t.beats.map((b, i) => i === action.step ? { isOn: !b.isOn } : b) }
                        : t
                ),
            };

        case "TOGGLE_ACTIVE": {
            const toggled = state.tracks.map(t =>
                t.index === action.trackIdx ? { ...t, isActive: !t.isActive } : t
            );
            const { tracks, lcm } = rebuildState(toggled);
            return { ...state, tracks, lcm };
        }

        case "CHANGE_BEATNUMBER": {
            const updated = state.tracks.map(t =>
                t.index === action.trackIdx ? { ...t, beatNumber: action.beatNumber } : t
            );
            const { tracks, lcm } = rebuildState(updated);
            return { ...state, tracks, lcm };
        }

        case "CHANGE_SAMPLE":
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx ? { ...t, sampleName: action.sampleName } : t
                ),
            };

        case "CHANGE_TEMPO":
            return { ...state, tempo: action.tempo };

        case "ROTATE_CW":
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? { ...t, beats: [t.beats[t.beats.length - 1], ...t.beats.slice(0, -1)] }
                        : t
                ),
            };

        case "ROTATE_CCW":
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? { ...t, beats: [...t.beats.slice(1), t.beats[0]] }
                        : t
                ),
            };

        case "TOGGLE_MUTE":
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx ? { ...t, isMute: !t.isMute } : t
                ),
            };
        case "CLEAR_BEATS":
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? {
                            ...t,
                            beats: t.beats.map(() => ({ isOn: false })),
                        }
                        : t
                ),
            };
        case "CHANGE_SAMPLE":
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? {
                            ...t,
                            sampleName: action.sampleName
                        }
                        : t
                )
            }
        default:
            return state;

    }
}

const PolyrhythmContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export const PolyrhythmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // refs to hold latest state slices without rescheduling
    const beatRef = useRef(state.currentBeat);
    const tracksRef = useRef(state.tracks);
    const lcmRef = useRef(state.lcm);
    useEffect(() => {
        beatRef.current = state.currentBeat;
        tracksRef.current = state.tracks;
        lcmRef.current = state.lcm;
    }, [state]);

    const sampler = useInstruments("percussion");

    // schedule once unless sampler or tempo changes
    useEffect(() => {
        if (!sampler) return;
        let id: number;

        const start = async () => {
            await Tone.start();
            await Tone.loaded(); // ensure buffers loaded
            Tone.Transport.cancel();
            Tone.Transport.stop();
            Tone.Transport.bpm.value = state.tempo;

            id = Tone.Transport.scheduleRepeat((time) => {
                const next = (beatRef.current + 1) % lcmRef.current;
                dispatch({ type: "ADVANCE_BEAT", next });

                tracksRef.current.forEach((t) => {
                    if (!t.isActive || t.isMute) return;
                    if (t.beats[next].isOn) {
                        const note = percussionSampleMap[t.sampleName];
                        sampler.triggerAttackRelease(note, "8n", time);
                    }
                });
            }, "8n");

            Tone.Transport.start("+0.1");
        };

        start();
        return () => {
            if (id !== undefined) Tone.Transport.clear(id);
            Tone.Transport.stop();
        };
    }, [sampler, state.tempo]);

    return (
        <PolyrhythmContext.Provider value={{ state, dispatch }}>
            {children}
        </PolyrhythmContext.Provider>
    );
};

export const usePolyrhythm = () => {
    const ctx = useContext(PolyrhythmContext);
    if (!ctx) throw new Error("usePolyrhythm must be used within PolyrhythmProvider");
    return ctx;
};
