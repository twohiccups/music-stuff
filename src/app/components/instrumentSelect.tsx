import { Box, MenuItem, Select, Typography } from "@mui/material";

interface InstrumentSelectProps {
    instrument: string;
    setInstrument: (newInstrument: string) => void;
}
const InstrumentSelect = ({ instrument, setInstrument }: InstrumentSelectProps) => {
    return (
        <>
            <Box sx={{ my: 2, textAlign: "center" }}>
                <Typography variant="h6">Select Instrument</Typography>
                <Select
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    displayEmpty
                    sx={{ width: 300, mx: "auto", display: "block" }}
                >
                    <MenuItem value="synth">Synth</MenuItem>
                    <MenuItem value="piano">Piano</MenuItem>
                    <MenuItem value="violin">Violin</MenuItem>
                </Select>
            </Box>
        </>
    )
}

export default InstrumentSelect;