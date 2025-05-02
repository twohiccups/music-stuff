'use client';

import React from 'react';
import {
    Box,
    Typography,
} from '@mui/material';
import InstrumentSelect from '@app/chords-table/components/InstrumentSelect';
import OctaveSlider from '@app/chords-table/components/OctaveSlider';
import MiniPianoKeyboard from '@app/chords-table/components/MiniPianoKeyboard';

interface SettingsPanelProps {
    onClose(): void;
    instrument: string;
    setInstrument: (instrument: string) => void;
    octave: number;
    setOctave: React.Dispatch<React.SetStateAction<number>>;
    selectedNote: string;
    setSelectedNote: React.Dispatch<React.SetStateAction<string>>;
}

export default function SettingsPanel({
    instrument,
    setInstrument,
    octave,
    setOctave,
    selectedNote,
    setSelectedNote,
}: SettingsPanelProps) {
    return (
        <Box sx={{ width: 300, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Instrument selector */}
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    Instrument
                </Typography>
                <InstrumentSelect instrument={instrument} setInstrument={setInstrument} />
            </Box>

            {/* Octave controls + keyboard */}
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    Octave
                </Typography>
                <OctaveSlider octave={octave} setOctave={setOctave} />

            </Box>
            <Box>

                <Typography variant="subtitle2" gutterBottom>
                    Base note
                </Typography>
                <MiniPianoKeyboard baseNote={selectedNote} setBaseNote={setSelectedNote} />

            </Box>
        </Box>
    );
}
