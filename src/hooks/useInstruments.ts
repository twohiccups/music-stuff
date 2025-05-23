// hooks/useSynth.ts
import { useEffect, useState } from "react";
import * as Tone from "tone";

//
// ─── STANDARD PIANO/VIOLIN ASSIGNMENT ────────────────────────
//
const standardNoteAssignment: Record<string, string> = {
  "A0": "A0.mp3",
  "A#0": "Bb0.mp3",
  "B0": "B0.mp3",
  "C1": "C1.mp3",
  "C#1": "Db1.mp3",
  "D1": "D1.mp3",
  "D#1": "Eb1.mp3",
  "E1": "E1.mp3",
  "F1": "F1.mp3",
  "F#1": "Gb1.mp3",
  "G1": "G1.mp3",
  "G#1": "Ab1.mp3",
  "A1": "A1.mp3",
  "A#1": "Bb1.mp3",
  "B1": "B1.mp3",
  "C2": "C2.mp3",
  "C#2": "Db2.mp3",
  "D2": "D2.mp3",
  "D#2": "Eb2.mp3",
  "E2": "E2.mp3",
  "F2": "F2.mp3",
  "F#2": "Gb2.mp3",
  "G2": "G2.mp3",
  "G#2": "Ab2.mp3",
  "A2": "A2.mp3",
  "A#2": "Bb2.mp3",
  "B2": "B2.mp3",
  "C3": "C3.mp3",
  "C#3": "Db3.mp3",
  "D3": "D3.mp3",
  "D#3": "Eb3.mp3",
  "E3": "E3.mp3",
  "F3": "F3.mp3",
  "F#3": "Gb3.mp3",
  "G3": "G3.mp3",
  "G#3": "Ab3.mp3",
  "A3": "A3.mp3",
  "A#3": "Bb3.mp3",
  "B3": "B3.mp3",
  "C4": "C4.mp3",
  "C#4": "Db4.mp3",
  "D4": "D4.mp3",
  "D#4": "Eb4.mp3",
  "E4": "E4.mp3",
  "F4": "F4.mp3",
  "F#4": "Gb4.mp3",
  "G4": "G4.mp3",
  "G#4": "Ab4.mp3",
  "A4": "A4.mp3",
  "A#4": "Bb4.mp3",
  "B4": "B4.mp3",
  "C5": "C5.mp3",
  "C#5": "Db5.mp3",
  "D5": "D5.mp3",
  "D#5": "Eb5.mp3",
  "E5": "E5.mp3",
  "F5": "F5.mp3",
  "F#5": "Gb5.mp3",
  "G5": "G5.mp3",
  "G#5": "Ab5.mp3",
  "A5": "A5.mp3",
  "A#5": "Bb5.mp3",
  "B5": "B5.mp3",
  "C6": "C6.mp3",
  "C#6": "Db6.mp3",
  "D6": "D6.mp3",
  "D#6": "Eb6.mp3",
  "E6": "E6.mp3",
  "F6": "F6.mp3",
  "F#6": "Gb6.mp3",
  "G6": "G6.mp3",
  "G#6": "Ab6.mp3",
  "A6": "A6.mp3",
  "A#6": "Bb6.mp3",
  "B6": "B6.mp3",
  "C7": "C7.mp3",
  "C#7": "Db7.mp3",
  "D7": "D7.mp3",
  "D#7": "Eb7.mp3",
  "E7": "E7.mp3",
  "F7": "F7.mp3",
  "F#7": "Gb7.mp3",
  "G7": "G7.mp3",
  "G#7": "Ab7.mp3",
  "A7": "A7.mp3",
  "A#7": "Bb7.mp3",
  "B7": "B7.mp3",
  "C8": "C8.mp3",
};

//
// ─── PERCUSSION SAMPLE URLS ───────────────────────────────────
//
const percussionNoteUrls: Record<string, string> = {
  "C1": "cardboard.wav",
  "C#1": "cl-bongo-2.wav",
  "D1": "drum-machine-kick.wav",
  "D#1": "electro-kick.wav",
  "E1": "layered-snare.wav",
  "F1": "metallic.wav",
  "F#1": "plastic.wav",
  "G1": "plastic-2.wav",
  "G#1": "psytrance-kick.wav",
  "A1": "samples_4.wav",
  "A#1": "samples_bass.wav",
  "B1": "samples_bongo.wav",
  "C2": "samples_bop.wav",
  "C#2": "samples_cowbell.wav",
  "D2": "samples_doom.wav",
  "D#2": "samples_drum.mp3",
  "E2": "samples_drum-2.mp3",
  "F2": "samples_drum-3.mp3",
  "F#2": "samples_fart.wav",
  "G2": "samples_tick.mp3",
  "G#2": "tambourine-clean-hit-bright.wav",
  "A2": "wood-2.wav",
};

//
// ─── PERCUSSION NAME → NOTE KEY MAP ──────────────────────────
//
export const percussionSampleMap: Record<string, string> = {
  "cardboard": "C1",
  "cl-bongo-2": "C#1",
  "drum-machine-kick": "D1",
  "electro-kick": "D#1",
  "layered-snare": "E1",
  "metallic": "F1",
  "plastic": "F#1",
  "plastic-2": "G1",
  "psytrance-kick": "G#1",
  "samples_4": "A1",
  "samples_bass": "A#1",
  "samples_bongo": "B1",
  "samples_bop": "C2",
  "samples_cowbell": "C#2",
  "samples_doom": "D2",
  "samples_drum.mp3": "D#2",
  "samples_drum-2.mp3": "E2",
  "samples_drum-3.mp3": "F2",
  "samples_fart": "F#2",
  "samples_tick": "G2",
  "tambourine-clean-hit-bright": "G#2",
  "wood-2": "A2",
};

//
// ─── SINGLETON CACHE ─────────────────────────────────────────
const instrumentInstances: Record<string, Tone.PolySynth | Tone.Sampler> = {};

//
// ─── FACTORY ─────────────────────────────────────────────────
function createInstrument(instrument: string): Tone.PolySynth | Tone.Sampler {
  if (instrument === "piano") {
    return new Tone.Sampler({
      urls: standardNoteAssignment,
      baseUrl: "https://twohiccups.github.io/instrument-sounds/piano-mp3/",
      onload: () => console.log("Piano loaded"),
    }).toDestination();
  } else if (instrument === "violin") {
    return new Tone.Sampler({
      urls: standardNoteAssignment,
      baseUrl: "https://twohiccups.github.io/instrument-sounds/violin-mp3/",
      onload: () => console.log("Violin loaded"),
    }).toDestination();
  } else if (instrument === "percussion") {
    return new Tone.Sampler({
      urls: percussionNoteUrls,
      baseUrl: "https://twohiccups.github.io/instrument-sounds/percussion/",
      onload: () => console.log("Percussion loaded"),
    }).toDestination();
  } else {
    return new Tone.PolySynth(Tone.Synth).toDestination();
  }
}

//
// ─── HOOK ────────────────────────────────────────────────────
export default function useInstruments(
  instrument: string
): Tone.PolySynth | Tone.Sampler | null {
  const [inst, setInst] = useState<Tone.PolySynth | Tone.Sampler | null>(null);

  useEffect(() => {
    if (!instrumentInstances[instrument]) {
      instrumentInstances[instrument] = createInstrument(instrument);
    }
    setInst(instrumentInstances[instrument]);
    return () => void setInst(null);
  }, [instrument]);

  return inst;
}
