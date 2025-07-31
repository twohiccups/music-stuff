// src/context/PolyrhythmContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import * as Tone from "tone";
import useInstruments, { percussionSampleMap } from "@src/hooks/useInstruments";
import { RhythmPreset, State, Track } from "@src/types/polyrhythmTypes";



type Action =
    | { type: "ADVANCE_BEAT"; next: number }
    | { type: "LOAD_PRESET"; preset: RhythmPreset }
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
        case "LOAD_PRESET": {
            const sampleNames = Object.keys(percussionSampleMap);

            // Normalize to 4 tracks
            const rawTracks: Track[] = Array.from({ length: 4 }, (_, idx) => {
                const t = action.preset.tracks[idx];

                if (!t) {
                    return {
                        index: idx,
                        beatNumber: 4,
                        isActive: false,
                        isMute: false,
                        sampleName: sampleNames[idx % sampleNames.length],
                        beats: [],
                    };
                }

                return {
                    index: idx,
                    beatNumber: t.beatNumber,
                    isActive: t.isActive,
                    isMute: t.isMute ?? false,
                    sampleName: t.sampleName ?? sampleNames[idx % sampleNames.length],
                    beats: t.beats ?? [],
                };
            });

            const activeBeatNumbers = rawTracks
                .filter((t) => t.isActive)
                .map((t) => t.beatNumber);

            const newLcm = activeBeatNumbers.length
                ? activeBeatNumbers.reduce((acc, n) => lcm(acc, n), activeBeatNumbers[0])
                : 1;

            const normalizedTracks = rawTracks.map((t) => {
                if (t.beats.length === newLcm) return t;

                const autoBeats = Array.from({ length: newLcm }, (_, i) => ({
                    isOn: t.isActive ? i % t.beatNumber === 0 : false,
                }));

                return { ...t, beats: autoBeats };
            });

            return {
                ...state,
                tempo: action.preset.tempo,
                currentBeat: 0,
                lcm: newLcm,
                tracks: normalizedTracks,
            };
        }

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

const PolyrhythmContext = createContext<{ state: State; dispatch: React.Dispatch<Action>, shareUrl: () => string, loadFromUrl: () => void } | null>(null);

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

    const shareUrl = () => {
        return JSON.stringify(state)
    }

    const loadFromUrl = () => {
        if (typeof window === "undefined") return;

        const url = new URL(window.location.href);
        const data = url.searchParams.get("data");
        if (!data) return;

        try {
            const parsed = JSON.parse(decodeURIComponent(data));
            if (!parsed || typeof parsed !== "object") return;

            dispatch({
                type: "LOAD_PRESET",
                preset: {
                    name: "Imported",
                    tempo: parsed.tempo ?? 120,
                    tracks: parsed.tracks ?? [],
                },
            });

            // Optionally clear the URL after loading
            url.searchParams.delete("data");
            window.history.replaceState({}, "", url.toString());
        } catch (err) {
            console.error("Invalid shared rhythm data:", err);
        }
    };


    // schedule once unless sampler or tempo changes
    useEffect(() => {
        if (!sampler) return;
        let id: number;

        const start = async () => {
            await Tone.start();
            await Tone.loaded(); // ensure buffers loaded
            Tone.getTransport().cancel();
            Tone.getTransport().stop();
            Tone.getTransport().bpm.value = state.tempo;

            id = Tone.getTransport().scheduleRepeat((time) => {
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

            Tone.getTransport().start("+0.1");
        };

        start();
        return () => {
            if (id !== undefined) Tone.getTransport().clear(id);
            Tone.getTransport().stop();
        };
    }, [sampler, state.tempo]);

    return (
        <PolyrhythmContext.Provider value={{ state, dispatch, shareUrl, loadFromUrl }}>
            {children}
        </PolyrhythmContext.Provider>
    );
};

export const usePolyrhythm = () => {
    const ctx = useContext(PolyrhythmContext);
    if (!ctx) throw new Error("usePolyrhythm must be used within PolyrhythmProvider");
    return ctx;
};
