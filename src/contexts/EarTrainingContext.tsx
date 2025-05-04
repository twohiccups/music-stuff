"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useRef,
    ReactNode,
} from "react";
import * as Tone from "tone";

// ─── Constants ───
export const difficultyCents = [
    2400, 1800, 1200, 700, 600, 400, 300, 200, 100, 50,
    25, 15, 10, 6, 3, 1.5, 1, 0.5, 0.25, 0.1,
];

const centsRatio = (c: number) => Math.pow(2, c / 1200);

interface Challenge {
    base: number;
    second: number;
    dir: "up" | "down";
}

function generateChallenge(level: number): Challenge {
    const base = 300 + Math.random() * 300;
    const dir = Math.random() < 0.5 ? "up" : "down";
    const ratio = centsRatio(difficultyCents[level]);
    const second = dir === "up" ? base * ratio : base / ratio;
    return { base, second, dir };
}

// ─── State & Actions ───
interface EarTrainingState {
    levelIndex: number;
    startingLevelIndex: number;
    correctStreak: number;
    currentChallenge: Challenge;
    hasStarted: boolean;
    justLeveledUp: boolean;
    streakLength: number;
}

type Action =
    | { type: "START"; challenge: Challenge }
    | { type: "GUESS"; guess: "up" | "down" }
    | { type: "ACKNOWLEDGE_LEVEL_UP" }
    | { type: "SET_STARTING_LEVEL"; value: number }
    | { type: "SET_STREAK_LENGTH"; value: number }
    | { type: "RESET" };

function earReducer(state: EarTrainingState, action: Action): EarTrainingState {
    switch (action.type) {
        case "START":
            return {
                ...state,
                hasStarted: true,
                currentChallenge: action.challenge,
                justLeveledUp: false,
            };
        case "GUESS": {
            const isCorrect = action.guess === state.currentChallenge.dir;
            let nextStreak = isCorrect ? state.correctStreak + 1 : 0;
            let nextLevel = state.levelIndex;
            let justLeveledUp = false;

            if (isCorrect && nextStreak >= state.streakLength && nextLevel < difficultyCents.length - 1) {
                nextLevel++;
                nextStreak = 0;
                justLeveledUp = true;
            }

            return {
                ...state,
                levelIndex: nextLevel,
                correctStreak: nextStreak,
                currentChallenge: generateChallenge(nextLevel),
                justLeveledUp,
            };
        }
        case "ACKNOWLEDGE_LEVEL_UP":
            return { ...state, justLeveledUp: false };
        case "SET_STARTING_LEVEL":
            return {
                ...state,
                startingLevelIndex: action.value,
                levelIndex: action.value,
                currentChallenge: generateChallenge(action.value),
            };
        case "SET_STREAK_LENGTH":
            return { ...state, streakLength: action.value };
        case "RESET":
            return {
                ...state,
                hasStarted: false,
                levelIndex: state.startingLevelIndex,
                correctStreak: 0,
                currentChallenge: generateChallenge(state.startingLevelIndex),
                justLeveledUp: false,
            };
        default:
            return state;
    }
}

// ─── Context ───
interface EarTrainingContextValue {
    levelIndex: number;
    correctStreak: number;
    centsDiff: number;
    hasStarted: boolean;
    justLeveledUp: boolean;
    startingLevelIndex: number;
    streakLength: number;
    guessUp(): void;
    guessDown(): void;
    replay(): void;
    start(): void;
    resetTraining(): void;
    setStartingLevel(index: number): void;
    setStreakLength(length: number): void;
    acknowledgeLevelUp(): void;
}

const EarTrainingContext = createContext<EarTrainingContextValue | null>(null);

// ─── Provider ───
export function EarTrainingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(earReducer, {
        levelIndex: 0,
        startingLevelIndex: 0,
        correctStreak: 0,
        currentChallenge: generateChallenge(0),
        hasStarted: false,
        justLeveledUp: false,
        streakLength: 3,
    });

    const synthRef = useRef<Tone.Synth | null>(null);
    const challengeRef = useRef<Challenge>(state.currentChallenge);

    useEffect(() => {
        synthRef.current = new Tone.Synth().toDestination();
        return () => {
            synthRef.current?.dispose();
        };
    }, []);

    const playNotes = useCallback((challenge: Challenge) => {
        challengeRef.current = challenge;

        const now = Tone.now();
        const dur = 0.6;
        const offset = 0.05;

        const synth1 = new Tone.Synth().toDestination();
        const synth2 = new Tone.Synth().toDestination();

        synth1.triggerAttackRelease(challenge.base, dur, now + offset);
        synth2.triggerAttackRelease(challenge.second, dur, now + dur + 0.2 + offset);

        setTimeout(() => {
            synth1.dispose();
            synth2.dispose();
        }, 2000);
    }, []);

    useEffect(() => {
        if (state.hasStarted) {
            playNotes(state.currentChallenge);
        }
    }, [state.currentChallenge, state.hasStarted, playNotes]);

    const guessUp = () => dispatch({ type: "GUESS", guess: "up" });
    const guessDown = () => dispatch({ type: "GUESS", guess: "down" });

    const replay = () => {
        if (challengeRef.current) {
            playNotes(challengeRef.current);
        }
    };

    const start = () => {
        const challenge = generateChallenge(state.levelIndex);
        dispatch({ type: "START", challenge });
        setTimeout(() => {
            playNotes(challenge);
        }, 100);
    };

    const acknowledgeLevelUp = () => dispatch({ type: "ACKNOWLEDGE_LEVEL_UP" });
    const resetTraining = () => dispatch({ type: "RESET" });
    const setStartingLevel = (index: number) => dispatch({ type: "SET_STARTING_LEVEL", value: index });
    const setStreakLength = (value: number) => dispatch({ type: "SET_STREAK_LENGTH", value });

    useEffect(() => {
        let spaceCooldown = false;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!state.hasStarted) return;

            if (e.code === "ArrowUp") {
                guessUp();
            } else if (e.code === "ArrowDown") {
                guessDown();
            } else if (e.code === "Space") {
                e.preventDefault();
                if (!spaceCooldown) {
                    spaceCooldown = true;
                    replay();
                    setTimeout(() => {
                        spaceCooldown = false;
                    }, 300);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [state.hasStarted]);

    useEffect(() => {
        void Tone.start();
    }, []);

    const value: EarTrainingContextValue = {
        levelIndex: state.levelIndex,
        correctStreak: state.correctStreak,
        centsDiff: difficultyCents[state.levelIndex],
        hasStarted: state.hasStarted,
        justLeveledUp: state.justLeveledUp,
        startingLevelIndex: state.startingLevelIndex,
        streakLength: state.streakLength,
        guessUp,
        guessDown,
        replay,
        start,
        resetTraining,
        setStartingLevel,
        setStreakLength,
        acknowledgeLevelUp,
    };

    return (
        <EarTrainingContext.Provider value={value}>
            {children}
        </EarTrainingContext.Provider>
    );
}

export function useEarTrainingContext() {
    const ctx = useContext(EarTrainingContext);
    if (!ctx) throw new Error("Must be used inside EarTrainingProvider");
    return ctx;
}
