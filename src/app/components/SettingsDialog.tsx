"use client";

import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import InstrumentSelect from "@components/InstrumentSelect";
import OctaveSlider from "@components/OctaveSlider";
import MiniPianoKeyboard from "@components/MiniPianoKeyboard";

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
    instrument: string;
    setInstrument: (instrument: string) => void;
    octave: number;
    setOctave: (octave: number) => void;
    selectedNote: string;
    setSelectedNote: (note: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
    open,
    onClose,
    instrument,
    setInstrument,
    octave,
    setOctave,
    selectedNote,
    setSelectedNote,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            fullScreen={isMobile}
            disableScrollLock
        >
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <InstrumentSelect instrument={instrument} setInstrument={setInstrument} />
                <Box>
                    <OctaveSlider octave={octave} setOctave={() => setOctave} />
                    <MiniPianoKeyboard baseNote={selectedNote} setBaseNote={() => setSelectedNote} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;
