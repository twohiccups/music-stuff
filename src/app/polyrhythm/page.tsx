"use client"

import React from 'react';
import { PolyrhythmProvider, usePolyrhythm } from '@src/contexts/polyrhythmContext';
import { Box } from '@mui/material';
import RhythmCircle from './components/RhythmCircle';
import TrackControls from './components/TrackControls';

const Sequencer: React.FC = () => {
    const { state, dispatch } = usePolyrhythm();
    const { tracks, currentBeat, lcm } = state;

    const ringStep = 50 / (tracks.length + 1);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                {tracks.map(t => (
                    <TrackControls
                        key={t.index}
                        index={t.index}
                        isActive={t.isActive}
                        isMute={t.isMute}
                        beatNumber={t.beatNumber}
                        onSwitchActive={() => dispatch({ type: 'TOGGLE_ACTIVE', trackIdx: t.index })}
                        onSwitchMute={() => dispatch({ type: 'TOGGLE_MUTE', trackIdx: t.index })}
                        onRotateCW={() => dispatch({ type: 'TOGGLE_BEAT', trackIdx: t.index, step: 0 }) /* rotate handled if needed */}
                        onRotateCCW={() => dispatch({ type: 'TOGGLE_BEAT', trackIdx: t.index, step: 0 })}
                        onClearRhythm={() => {/* similar dispatch */ }}
                        onChangeBeatNumber={n => dispatch({ type: 'CHANGE_BEATNUMBER', trackIdx: t.index, beatNumber: n })}
                    />
                ))}
            </Box>

            <RhythmCircle
                activeTracks={tracks}
                currentBeatIndex={currentBeat}
                lcm={lcm}
                onToggleBeat={(ti, step) => dispatch({ type: 'TOGGLE_BEAT', trackIdx: ti, step })}
            />
        </Box>
    );
};

const SequencerPage: React.FC = () => (
    <PolyrhythmProvider>
        <Sequencer />
    </PolyrhythmProvider>
);

export default SequencerPage;
