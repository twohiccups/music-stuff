"use client";

import React,
{
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
    useCallback,
} from "react";
import * as Tone from "tone";

interface Interval {
    name: string;
    semitones: number;
}

interface Challenge {
    baseFreq: number;
    interval: Interval;
    targetFreq: number;
}

interface SlidingIntervalsContextValue {
    challenge: Challenge;
    userFreq: number;
    setUserFreq: (v: number) => void;
    newChallenge: () => void;
    startUser: () => void;
    stopUser: () => void;
    volume: number;
    setVolume: (v: number) => void;
    waveform: Tone.ToneOscillatorType;
    setWaveform: (w: Tone.ToneOscillatorType) => void;
}

const SlidingIntervalsContext =
    createContext<SlidingIntervalsContextValue | null>(null);

export function SlidingIntervalsProvider({
    children,
}: {
    children: ReactNode;
}) {
    const intervals: Interval[] = [
        { name: "Minor 2nd", semitones: 1 },
        { name: "Major 2nd", semitones: 2 },
        { name: "Minor 3rd", semitones: 3 },
        { name: "Major 3rd", semitones: 4 },
        { name: "Perfect 4th", semitones: 5 },
        { name: "Tritone", semitones: 6 },
        { name: "Perfect 5th", semitones: 7 },
        { name: "Minor 6th", semitones: 8 },
        { name: "Major 6th", semitones: 9 },
        { name: "Minor 7th", semitones: 10 },
        { name: "Major 7th", semitones: 11 },
    ];

    const getNewChallenge = (): Challenge => {
        const baseFreq = 220;
        const interval =
            intervals[Math.floor(Math.random() * intervals.length)];
        return {
            baseFreq,
            interval,
            targetFreq:
                baseFreq * Math.pow(2, interval.semitones / 12),
        };
    };

    const [challenge, setChallenge] = useState<Challenge>(
        getNewChallenge
    );
    const [userFreq, setUserFreq] =
        useState(challenge.baseFreq);
    const [volume, setVolume] = useState(1);
    const [waveform, setWaveform] =
        useState<Tone.ToneOscillatorType>("sawtooth");
    const [toneStarted, setToneStarted] = useState(false);

    // refs for oscillators and gains
    const baseOscRef = useRef<Tone.Oscillator | null>(null);
    const baseGainRef = useRef<Tone.Gain | null>(null);
    const userOscRef = useRef<Tone.Oscillator | null>(null);
    const userGainRef = useRef<Tone.Gain | null>(null);

    const ensureAudioSetup = useCallback(async () => {
        if (!toneStarted) {
            await Tone.start();

            // Base tone: routed through gain (silent until pressed)
            const baseGain = new Tone.Gain(0).toDestination();
            const baseOsc = new Tone.Oscillator(
                challenge.baseFreq,
                waveform
            ).connect(baseGain);
            baseOsc.volume.value = -12;
            baseOsc.start();
            baseGainRef.current = baseGain;
            baseOscRef.current = baseOsc;

            // User tone: routed through gain (silent until pressed)
            const userGain = new Tone.Gain(0).toDestination();
            const userOsc = new Tone.Oscillator(
                userFreq,
                waveform
            ).connect(userGain);
            userOsc.start();
            userGainRef.current = userGain;
            userOscRef.current = userOsc;

            setToneStarted(true);
        }
    }, [toneStarted, challenge.baseFreq, userFreq, waveform]);

    useEffect(() => {
        if (baseOscRef.current) {
            baseOscRef.current.frequency.value =
                challenge.baseFreq;
        }
    }, [challenge]);

    useEffect(() => {
        if (userOscRef.current) {
            userOscRef.current.frequency.value =
                userFreq;
        }
    }, [userFreq]);

    useEffect(() => {
        if (baseOscRef.current) {
            baseOscRef.current.type = waveform;
        }
        if (userOscRef.current) {
            userOscRef.current.type = waveform;
        }
    }, [waveform]);

    const newChallenge = () => {
        const next = getNewChallenge();
        setChallenge(next);
        setUserFreq(next.baseFreq);
    };

    const startUser = async () => {
        await ensureAudioSetup();
        // ramp both base and user gains on press
        baseGainRef.current?.gain.linearRampTo(1, 0.1);
        userGainRef.current?.gain.linearRampTo(volume, 0.1);
    };

    const stopUser = () => {
        // ramp both off on release
        baseGainRef.current?.gain.linearRampTo(0, 0.1);
        userGainRef.current?.gain.linearRampTo(0, 0.1);
    };

    return (
        <SlidingIntervalsContext.Provider
            value={{
                challenge,
                userFreq,
                setUserFreq,
                newChallenge,
                startUser,
                stopUser,
                volume,
                setVolume,
                waveform,
                setWaveform,
            }}
        >
            {children}
        </SlidingIntervalsContext.Provider>
    );
}

export function useSlidingIntervalsContext():
    SlidingIntervalsContextValue {
    const ctx = useContext(SlidingIntervalsContext);
    if (!ctx)
        throw new Error(
            "SlidingIntervalsContext must be used within provider"
        );
    return ctx;
}
