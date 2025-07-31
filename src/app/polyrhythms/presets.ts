import { RhythmPreset } from "@src/types/polyrhythmTypes";



export const RHYTHM_PRESETS: RhythmPreset[] = [
    {
        name: "3:2 Polyrhythm",
        tempo: 120,
        tracks: [
            {
                index: 0,
                beatNumber: 3,
                isActive: true,
                isMute: false,
                sampleName: "cardboard",
                beats: [{ isOn: true }, { isOn: false }, { isOn: false }, { isOn: true }, { isOn: false }, { isOn: false }],
            },
            {
                index: 1,
                beatNumber: 2,
                isActive: true,
                isMute: false,
                sampleName: "plastic",
                beats: [{ isOn: true }, { isOn: false }, { isOn: true }, { isOn: false }, { isOn: true }, { isOn: false }],
            }
        ],
    },
];
