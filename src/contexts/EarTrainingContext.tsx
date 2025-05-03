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
const difficultyCents = [2400, 1700, 1200, 600, 300, 200, 100, 50, 25, 10, 5, 3, 2, 1, 0.75, 0.5, 0.25, 0.1];
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

// ─── State ───
interface EarTrainingState {
    levelIndex: number;
    correctStreak: number;
    currentChallenge: Challenge;
    hasStarted: boolean;
}

type Action =
    | { type: "START"; challenge: Challenge }
    | { type: "GUESS"; guess: "up" | "down" };

function earReducer(state: EarTrainingState, action: Action): EarTrainingState {
    switch (action.type) {
        case "START":
            return {
                ...state,
                hasStarted: true,
                currentChallenge: action.challenge,
            };
        case "GUESS": {
            const isCorrect = action.guess === state.currentChallenge.dir;
            let nextStreak = isCorrect ? state.correctStreak + 1 : 0;
            let nextLevel = state.levelIndex;
            if (isCorrect && nextStreak >= 3 && nextLevel < difficultyCents.length - 1) {
                nextLevel++;
                nextStreak = 0;
            }
            return {
                hasStarted: true,
                levelIndex: nextLevel,
                correctStreak: nextStreak,
                currentChallenge: generateChallenge(nextLevel),
            };
        }
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
    guessUp(): void;
    guessDown(): void;
    replay(): void;
    start(): void;
}

const EarTrainingContext = createContext<EarTrainingContextValue | null>(null);

// ─── Provider ───
export function EarTrainingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(earReducer, {
        levelIndex: 0,
        correctStreak: 0,
        currentChallenge: generateChallenge(0),
        hasStarted: false,
    });

    const synthRef = useRef<Tone.Synth | null>(null);
    const challengeRef = useRef<Challenge>(state.currentChallenge); // NEW



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

        // Clean up after
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

    // ⌨️ Key control with debounce
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
        guessUp,
        guessDown,
        replay,
        start,
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
