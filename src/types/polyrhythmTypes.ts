export interface Beat { isOn: boolean; }
export interface Track {
    index: number;
    beatNumber: number;
    beats: Beat[];            // length === state.lcm
    isActive: boolean;
    isMute: boolean;
    sampleName: string;       // which percussion sample to play
}

export interface State {
    tracks: Track[];
    currentBeat: number;
    lcm: number;
    tempo: number;
}

export interface RhythmPreset {
    name: string;
    tempo: number;
    tracks: Track[]; // Use full Track interface
}


