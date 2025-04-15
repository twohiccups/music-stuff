import { Box, MenuItem, Select } from "@mui/material";

interface InstrumentSelectProps {
    instrument: string;
    setInstrument: (newInstrument: string) => void;
}

const InstrumentSelect = ({ instrument, setInstrument }: InstrumentSelectProps) => {
    return (
        <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
            <Select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                displayEmpty
                sx={{
                    width: 200,
                    // Force the selected text to be centered by targeting the select element's slot.
                    "& .MuiSelect-select": {
                        textAlign: "center",
                    },
                    fontSize: "2rem"
                }}
                inputProps={{
                    sx: { textAlign: "center" },
                }}
            >
                <MenuItem value="violin" sx={{ textAlign: "center" }}>
                    Violin
                </MenuItem>
                <MenuItem value="piano" sx={{ textAlign: "center" }}>
                    Piano
                </MenuItem>
                <MenuItem value="synth" sx={{ textAlign: "center" }}>
                    Synth
                </MenuItem>
            </Select>
        </Box>
    );
};

export default InstrumentSelect;
