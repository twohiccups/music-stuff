export interface Track {
    index: number;
    beatNumber: number;
    beats: boolean[];            // length === state.lcm
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



type TrackData = {
    index: number;
    beatNumber: number;
    isActive: boolean;
    isMute: boolean;
    sampleName: string;
    beats: string | boolean[] | number[];
};

export type ParsedData = {
    tracks?: TrackData[];
    tempo?: number;
};

