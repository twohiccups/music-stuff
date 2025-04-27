// src/context/PolyrhythmContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import * as Tone from "tone";

// ─── Types ──────────────────────────────────────────────────
export interface Beat { isOn: boolean }
export interface Track {
    index: number;
    beatNumber: number;
    beats: Beat[];            // always length === state.lcm
    isActive: boolean;
    isMute: boolean;
}

interface State {
    tracks: Track[];
    currentBeat: number;
    lcm: number;
    tempo: number;
}

type Action =
    | { type: 'REBUILD_BEATS'; lcm: number }
    | { type: 'ADVANCE_BEAT'; next: number }
    | { type: 'TOGGLE_BEAT'; trackIdx: number; step: number }
    | { type: 'TOGGLE_ACTIVE'; trackIdx: number }
    | { type: 'TOGGLE_MUTE'; trackIdx: number }
    | { type: 'CHANGE_BEATNUMBER'; trackIdx: number; beatNumber: number }
    | { type: 'CHANGE_TEMPO'; tempo: number }
    | { type: 'ROTATE_CW'; trackIdx: number }
    | { type: 'ROTATE_CCW'; trackIdx: number };

// ─── Helpers to compute GCD/LCM ─────────────────────────────
function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

// ─── Initial setup ─────────────────────────────────────────
// Define four tracks; first two enabled, last two disabled
const initialBeatNumbers = [4, 3, 4, 3];
const initialActiveNumbers = initialBeatNumbers.slice(0, 2);
const initialLcm = initialActiveNumbers.reduce((acc, n) => lcm(acc, n), initialActiveNumbers[0]);
const initialTracks: Track[] = initialBeatNumbers.map((bn, idx) => ({
    index: idx,
    beatNumber: bn,
    isActive: idx < 2,
    isMute: false,
    beats: Array.from({ length: initialLcm }, (_, i) => ({
        isOn: idx < 2 ? i % bn === 0 : false,
    })),
}));

const initialState: State = {
    tracks: initialTracks,
    currentBeat: 0,
    lcm: initialLcm,
    tempo: 120,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'REBUILD_BEATS':
            return {
                ...state,
                lcm: action.lcm,
                tracks: state.tracks.map(t => ({
                    ...t,
                    beats: Array.from({ length: action.lcm }, (_, i) => ({
                        isOn: i % t.beatNumber === 0,
                    })),
                })),
            };

        case 'ADVANCE_BEAT':
            return { ...state, currentBeat: action.next };

        case 'TOGGLE_BEAT':
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? {
                            ...t,
                            beats: t.beats.map((b, i) =>
                                i === action.step ? { isOn: !b.isOn } : b
                            ),
                        }
                        : t
                ),
            };

        case 'TOGGLE_ACTIVE':
            return {
                ...state,
                tracks: state.tracks.map(t => {
                    if (t.index !== action.trackIdx) return t;
                    const nowActive = !t.isActive;
                    return {
                        ...t,
                        isActive: nowActive,
                        beats: nowActive
                            ? Array.from({ length: state.lcm }, (_, i) => ({
                                isOn: i % t.beatNumber === 0,
                            }))
                            : t.beats,
                    };
                }),
            };

        case 'TOGGLE_MUTE':
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx ? { ...t, isMute: !t.isMute } : t
                ),
            };

        case 'CHANGE_BEATNUMBER':
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? { ...t, beatNumber: action.beatNumber }
                        : t
                ),
            };

        case 'ROTATE_CW':
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? {
                            ...t,
                            beats: [
                                t.beats[t.beats.length - 1],
                                ...t.beats.slice(0, t.beats.length - 1),
                            ],
                        }
                        : t
                ),
            };

        case 'ROTATE_CCW':
            return {
                ...state,
                tracks: state.tracks.map(t =>
                    t.index === action.trackIdx
                        ? {
                            ...t,
                            beats: [
                                ...t.beats.slice(1),
                                t.beats[0],
                            ],
                        }
                        : t
                ),
            };

        default:
            return state;
    }
}

const PolyrhythmContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export const PolyrhythmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const beatRef = useRef(state.currentBeat);

    // keep beatRef in sync
    useEffect(() => {
        beatRef.current = state.currentBeat;
    }, [state.currentBeat]);

    // recompute LCM when active tracks change
    useEffect(() => {
        const nums = state.tracks.filter(t => t.isActive).map(t => t.beatNumber);
        const newLcm = nums.length ? nums.reduce((acc, n) => lcm(acc, n), nums[0]) : 1;
        if (newLcm !== state.lcm) {
            dispatch({ type: 'REBUILD_BEATS', lcm: newLcm });
        }
    }, [state.tracks]);

    // schedule Tone.js Transport
    useEffect(() => {
        (async () => {
            await Tone.start();
            Tone.Transport.cancel();
            Tone.Transport.stop();
            Tone.Transport.bpm.value = state.tempo;

            const synths = state.tracks.map(() => new Tone.Synth().toDestination());
            const id = Tone.Transport.scheduleRepeat((time) => {
                const next = (beatRef.current + 1) % state.lcm;
                dispatch({ type: 'ADVANCE_BEAT', next });

                state.tracks.forEach((t, ti) => {
                    if (!t.isActive || t.isMute) return;
                    if (t.beats[next].isOn) synths[ti].triggerAttackRelease('C4', '8n', time);
                });
            }, '8n');

            Tone.Transport.start('+0.1');
            return () => {
                Tone.Transport.clear(id);
                Tone.Transport.stop();
                synths.forEach(s => s.dispose());
            };
        })();
    }, [state.tracks, state.lcm, state.tempo]);

    return (
        <PolyrhythmContext.Provider value={{ state, dispatch }}>
            {children}
        </PolyrhythmContext.Provider>
    );
};

export const usePolyrhythm = () => {
    const ctx = useContext(PolyrhythmContext);
    if (!ctx) throw new Error('usePolyrhythm must be used within PolyrhythmProvider');
    return ctx;
};
