
// src/app/SequencerPage.tsx
"use client";

import React, { useState } from 'react';
import * as Tone from 'tone';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { PolyrhythmProvider, usePolyrhythm } from '@src/contexts/polyrhythmContext';
import TempoControls from './components/TempoControls';
import RhythmCircle from './components/RhythmCircle';
import TrackControls from './components/TrackControls';

const Sequencer: React.FC = () => {
    const { state, dispatch } = usePolyrhythm();
    const { tracks, currentBeat, lcm, tempo } = state;
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        if (isPlaying) {
            Tone.Transport.pause();
        } else {
            Tone.Transport.start();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={togglePlay} aria-label="Play/Pause">
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <TempoControls tempo={tempo} onTempoChange={val => dispatch({ type: 'CHANGE_TEMPO', tempo: val })} />
            </Box>

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
                        onRotateCW={() => dispatch({ type: 'ROTATE_CW', trackIdx: t.index })}
                        onRotateCCW={() => dispatch({ type: 'ROTATE_CCW', trackIdx: t.index })}
                        onClearRhythm={() => dispatch({ type: 'REBUILD_BEATS', lcm })}
                        onChangeBeatNumber={n => dispatch({ type: 'CHANGE_BEATNUMBER', trackIdx: t.index, beatNumber: n })}
                    />
                ))}
            </Box>

            <RhythmCircle
                activeTracks={tracks.filter(t => t.isActive)}
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



// https://www.youtube.com/@donit. Thank you for samples