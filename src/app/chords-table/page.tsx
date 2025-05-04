'use client';

import React, { useState } from 'react';
import * as Tone from 'tone';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SidePanelLayout from '@app/components/SidePanelLayout';

import { chords } from '../data/constants';
import useInstruments from '@src/hooks/useInstruments';
import ChordNotation from '@app/chords-table/components/ChordNotation';
import PianoKeyboard from '@app/chords-table/components/PianoKeyboard';
import SettingsDialog from '@app/chords-table/components/SettingsPanel';
import ChordTable from '@app/chords-table/components/ChordTable';
import ActionMenu from '@app/components/ActionMenu';
import { PageActionsProvider } from '@src/contexts/PageActionsContext';
import InfoDialog from '@app/chords-table/components/InfoDialog';
import InfoIcon from '@mui/icons-material/Info';
import PageTitleHeader from '@app/components/PageTitleHeader';

// helper ───────────────────────────────────────────────
const maskToChord = (base: number, mask: number[]) =>
  mask.map(i => Tone.Frequency(base + i, 'midi').toFrequency());

// tune this only if your piano bar height changes
const MOBILE_BAR_HEIGHT = 320;          // px

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [instrument, setInstrument] = useState('violin');
  const [selectedNote, setSelectedNote] = useState('C');
  const [octave, setOctave] = useState(4);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [currentChordType, setCurrentChordType] = useState('');
  const [currentInversion, setCurrentInversion] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);

  const synth = useInstruments(instrument);
  const baseMidi = Tone.Frequency(`${selectedNote}${octave}`).toMidi();
  const startMidi = baseMidi - 2;

  function playChord(type: string, inversion: string) {
    if (!synth || !chords[type]?.[inversion]) return;

    const freqs = maskToChord(baseMidi, chords[type][inversion]);
    const names = freqs.map(f => Tone.Frequency(f).toNote());
    setActiveNotes(names);
    setCurrentChordType(type);
    setCurrentInversion(inversion);

    synth.releaseAll?.();

    // <— replaced ternary with if/else to avoid unused-expression lint error
    if (synth instanceof Tone.PolySynth) {
      synth.triggerAttackRelease(freqs, '1m');
    } else {
      freqs.forEach(f => synth.triggerAttackRelease(f, '2m'));
    }
  }

  const pageActions = [
    { name: 'Info', icon: <InfoIcon />, onClick: () => setInfoOpen(true) },
  ];

  return (
    <PageActionsProvider actions={pageActions}>
      <SidePanelLayout
        header={<PageTitleHeader title="Chords Table" />}
        panel={
          <SettingsDialog
            instrument={instrument}
            setInstrument={setInstrument}
            octave={octave}
            setOctave={setOctave}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
          />
        }
      >
        <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />

        {isMobile ? (
          <Box
            sx={{
              height: '100vh',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: `${MOBILE_BAR_HEIGHT}px`,
                overflowY: 'auto',
              }}
            >
              <ChordTable playChord={playChord} />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: `${MOBILE_BAR_HEIGHT}px`,
                px: 2,
                py: 2,
                zIndex: 1000,
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 -2px 6px rgba(0,0,0,0.25)',
                touchAction: 'none',
                overscrollBehavior: 'contain',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <PianoKeyboard activeNotes={activeNotes} startMidi={startMidi} />
              <ChordNotation
                baseNote={selectedNote}
                chordType={currentChordType}
                inversion={currentInversion}
              />
            </Box>
          </Box>
        ) : (
          <Container disableGutters sx={{ height: '90vh', py: 0 }}>
            <ChordTable playChord={playChord} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pb: 2 }}>
              <PianoKeyboard activeNotes={activeNotes} startMidi={startMidi} />
              <ChordNotation
                baseNote={selectedNote}
                chordType={currentChordType}
                inversion={currentInversion}
              />
            </Box>
          </Container>
        )}

        <ActionMenu />
      </SidePanelLayout>
    </PageActionsProvider>
  );
}
