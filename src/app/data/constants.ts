interface ChordInversions {
    [key: string]: number[];
}

interface Chords {
    [key: string]: ChordInversions;
}


export const chords: Chords = {
    major: {
        root: [0, 4, 7],
        inv1: [4, 7, 12],
        inv2: [7, 12, 16],
    },
    minor: {
        root: [0, 3, 7],
        inv1: [3, 7, 12],
        inv2: [7, 12, 15],
    },
    diminished: {
        root: [0, 3, 6],
        inv1: [3, 6, 12],
        inv2: [6, 12, 15],
    },
    augmented: {
        root: [0, 4, 8],
        inv1: [4, 8, 12],
        inv2: [8, 12, 16],
    },
    "suspended 2nd": { root: [0, 2, 7], inv1: [2, 7, 12], inv2: [7, 12, 14] },
    "suspended 4th": { root: [0, 5, 7], inv1: [5, 7, 12], inv2: [7, 12, 17] },
    "major 6th": {
        root: [0, 4, 7, 9],
        inv1: [4, 7, 9, 12],
        inv2: [7, 9, 12, 16],
        inv3: [9, 12, 16, 19],
    },
    "minor 6th": {
        root: [0, 3, 7, 9],
        inv1: [3, 7, 9, 12],
        inv2: [7, 9, 12, 15],
        inv3: [9, 12, 15, 19],
    },
    "dominant 7th": {
        root: [0, 4, 7, 10],
        inv1: [4, 7, 10, 12],
        inv2: [7, 10, 12, 16],
        inv3: [10, 12, 16, 19],
    },
    "major 7th": {
        root: [0, 4, 7, 11],
        inv1: [4, 7, 11, 12],
        inv2: [7, 11, 12, 16],
        inv3: [11, 12, 16, 19],
    },
    "minor 7th": {
        root: [0, 3, 7, 10],
        inv1: [3, 7, 10, 12],
        inv2: [7, 10, 12, 15],
        inv3: [10, 12, 15, 19],
    },
    "half diminished 7th": {
        root: [0, 3, 6, 10],
        inv1: [3, 6, 10, 12],
        inv2: [6, 10, 12, 15],
        inv3: [10, 12, 15, 18],
    },
    "diminished 7th": {
        root: [0, 3, 6, 9],
        inv1: [3, 6, 9, 12],
        inv2: [6, 9, 12, 15],
        inv3: [9, 12, 15, 18],
    },
    "minor major 7th": {
        root: [0, 3, 7, 11],
        inv1: [3, 7, 11, 12],
        inv2: [7, 11, 12, 15],
        inv3: [11, 12, 15, 19],
    },
    "augmented 7th": {
        root: [0, 4, 8, 10],
        inv1: [4, 8, 10, 12],
        inv2: [8, 10, 12, 16],
        inv3: [10, 12, 16, 20],
    },
    "augmented major 7th": {
        root: [0, 4, 8, 11],
        inv1: [4, 8, 11, 12],
        inv2: [8, 11, 12, 16],
        inv3: [11, 12, 16, 20],
    },
};
