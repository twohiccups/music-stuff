"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    useState,
    useCallback,
    useEffect,
} from "react";
import * as Tone from "tone";
import { usePolyrhythmScheduler } from "@src/hooks/usePolyrhythmScheduler";
import useInstruments from "@src/hooks/useInstruments";

// ─── Types ────────────────────────────────────────────────────
export interface Beat { isOn: boolean }
export interface Track {
    index: number
    isActive: boolean
    isMute: boolean
    beatNumber: number
    beats: Beat[]
}

interface State {
    tracks: Track[]
    globalLCM: number
}

// ─── Actions ─────────────────────────────────────────────────
type Action =
    | { type: "INIT_BEATS" }
    | { type: "TOGGLE_ACTIVE"; idx: number }
    | { type: "TOGGLE_MUTE"; idx: number }
    | { type: "SET_BEAT_NUMBER"; idx: number; beatNumber: number }
    | { type: "ROTATE"; idx: number; dir: "CW" | "CCW" }
    | { type: "CLEAR"; idx: number }
    | { type: "ADD_TRACK" }
    | { type: "TOGGLE_BEAT"; idx: number; beatIdx: number }



const computeLCM = (tracks: Track[]) => {
    const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b))
    const lcmCalc = (a: number, b: number): number => (a * b) / gcd(a, b)
    const counts = tracks.filter((t) => t.isActive).map((t) => t.beatNumber)
    return counts.length ? counts.reduce(lcmCalc) : 1
}

const withUpdatedLCM = (tracks: Track[]): State => {
    return {
        tracks,
        globalLCM: computeLCM(tracks)
    }
}

// ─── Reducer ─────────────────────────────────────────────────
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "INIT_BEATS": {
            const lcm = computeLCM(state.tracks)
            const tracks = state.tracks.map((t) =>
                !t.isActive
                    ? t
                    : {
                        ...t,
                        beats: Array(lcm)
                            .fill(0)
                            .map((_, i) => ({ isOn: i % t.beatNumber === 0 })),
                    },
            )
            return { tracks, globalLCM: lcm }
        }

        case "TOGGLE_ACTIVE":
            return withUpdatedLCM(
                state.tracks.map((t) =>
                    t.index === action.idx ? { ...t, isActive: !t.isActive } : t,
                ),
            )

        case "TOGGLE_MUTE":
            return {
                ...state,
                tracks: state.tracks.map((t) =>
                    t.index === action.idx ? { ...t, isMute: !t.isMute } : t,
                ),
            }

        case "SET_BEAT_NUMBER":
            return withUpdatedLCM(
                state.tracks.map((t) =>
                    t.index !== action.idx
                        ? t
                        : (() => {
                            const beats = t.beats.slice(0, action.beatNumber)
                            while (beats.length < action.beatNumber)
                                beats.push({ isOn: false })
                            return { ...t, beatNumber: action.beatNumber, beats }
                        })(),
                ),
            )

        case "ROTATE":
            return {
                ...state,
                tracks: state.tracks.map((t) => {
                    if (t.index !== action.idx) return t
                    const b = [...t.beats]
                    action.dir === "CW" ? b.unshift(b.pop()!) : b.push(b.shift()!)
                    return { ...t, beats: b }
                }),
            }

        case "CLEAR":
            return {
                ...state,
                tracks: state.tracks.map((t) =>
                    t.index === action.idx
                        ? { ...t, beats: t.beats.map(() => ({ isOn: false })) }
                        : t,
                ),
            }

        case "ADD_TRACK":
            if (state.tracks.length >= 4) return state
            return withUpdatedLCM([
                ...state.tracks,
                {
                    index: state.tracks.length,
                    isActive: true,
                    isMute: false,
                    beatNumber: 4,
                    beats: [],
                },
            ])

        case "TOGGLE_BEAT":
            return {
                ...state,
                tracks: state.tracks.map((t) =>
                    t.index !== action.idx || !t.isActive
                        ? t
                        : {
                            ...t,
                            beats: t.beats.map((b, i) =>
                                i === action.beatIdx ? { isOn: !b.isOn } : b,
                            ),
                        },
                ),
            }

        default:
            return state
    }
}

// ─── Context & Provider ──────────────────────────────────────
interface ContextValue {
    tracks: Track[]
    tempo: number
    isPlaying: boolean
    currentBeatIndex: number
    globalLCM: number
    toggleActiveTrack: (idx: number) => void
    toggleMuteTrack: (idx: number) => void
    changeBeatNumber: (idx: number, beatNumber: number) => void
    rotateTrack: (idx: number, dir: "CW" | "CCW") => void
    clearTrack: (idx: number) => void
    addTrack: () => void
    toggleBeat: (idx: number, beatIdx: number) => void
    setTempo: React.Dispatch<React.SetStateAction<number>>
    togglePlay: () => void
}

const PolyrhythmContext = createContext<ContextValue | undefined>(undefined)
export const usePolyrhythm = () => {
    const ctx = useContext(PolyrhythmContext)
    if (!ctx) throw new Error("usePolyrhythm must be inside PolyrhythmProvider")
    return ctx
}

export const PolyrhythmProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const synth = useInstruments("piano")

    // default tracks
    const initialState: State = {
        tracks: [
            { index: 0, isActive: true, isMute: false, beatNumber: 4, beats: [] },
            { index: 1, isActive: true, isMute: false, beatNumber: 3, beats: [] },
            { index: 2, isActive: false, isMute: false, beatNumber: 4, beats: [] },
            { index: 3, isActive: false, isMute: false, beatNumber: 4, beats: [] },
        ],
        globalLCM: 12,
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const { tracks, globalLCM } = state

    const [tempo, setTempo] = useState(120)
    const [isPlaying, setPlaying] = useState(false)
    const [currentBeatIndex, setCurrent] = useState(0)

    // tick handler
    const handleTick = useCallback(
        (step: number, time: number) => {
            Tone.Draw.schedule(() => setCurrent(step), time)
            tracks.forEach((t) => {
                if (t.isActive && !t.isMute && t.beats[step]?.isOn) {
                    synth?.triggerAttackRelease("C4", "8n", time)
                }
            })
        },
        [synth, tracks],
    )

    // create polyrhythm
    const createPolyrhythm = async () => {
        dispatch({ type: "INIT_BEATS" })
        setCurrent(0)

        await Tone.start()
        Tone.getTransport().stop()
        Tone.getTransport().position = "0:0:0"
        Tone.getTransport().start()
        setPlaying(true)
    }


    // schedule loop

    useEffect(() => {
        createPolyrhythm()
    }, [])

    usePolyrhythmScheduler(globalLCM, tempo, handleTick)

    // wrapped actions
    const toggleActiveTrack = (idx: number) => {
        dispatch({ type: "TOGGLE_ACTIVE", idx })
        createPolyrhythm()
    }
    const toggleMuteTrack = (idx: number) => dispatch({ type: "TOGGLE_MUTE", idx })

    const changeBeatNumber = (idx: number, beatNumber: number) => {
        dispatch({ type: "SET_BEAT_NUMBER", idx, beatNumber })
        createPolyrhythm()
    }

    const rotateTrack = (idx: number, dir: "CW" | "CCW") =>
        dispatch({ type: "ROTATE", idx, dir })

    const clearTrack = (idx: number) => dispatch({ type: "CLEAR", idx })

    const addTrack = () => {
        dispatch({ type: "ADD_TRACK" })
        createPolyrhythm()
    }
    const toggleBeat = (idx: number, beatIdx: number) =>
        dispatch({ type: "TOGGLE_BEAT", idx, beatIdx })

    const togglePlay = () => {
        if (isPlaying) Tone.getTransport().pause()
        else Tone.getTransport().start()
        setPlaying((p) => !p)
    }

    return (
        <PolyrhythmContext.Provider
            value={{
                tracks,
                tempo,
                isPlaying,
                currentBeatIndex,
                globalLCM,
                toggleActiveTrack,
                toggleMuteTrack,
                changeBeatNumber,
                rotateTrack,
                clearTrack,
                addTrack,
                toggleBeat,
                setTempo,
                togglePlay,
            }}
        >
            {children}
        </PolyrhythmContext.Provider>
    )
}
