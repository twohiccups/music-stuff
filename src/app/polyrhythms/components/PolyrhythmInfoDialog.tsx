import React from "react";
import { Typography, Box, Divider, List, ListItem, ListItemText } from "@mui/material";

export default function PolyrhythmInfoDialog() {
    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom>
                About This App
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
                What is a Polyrhythm?
            </Typography>
            <Typography>
                A polyrhythm occurs when two or more rhythms with different beat counts are played simultaneously. For example, a 3:2 polyrhythm layers a 3-beat pattern over a 2-beat pattern. These rhythmic interactions can create fascinating grooves found in many musical traditions, including West African drumming, Afro-Cuban music, jazz, and electronic genres.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
                How to Use the App
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemText
                        primary="Play/Pause"
                        secondary="Use the play button in the header to start or stop the rhythm playback."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Presets"
                        secondary="Load pre-built rhythm configurations (like 3:2, Son Clave, etc.) to quickly explore interesting combinations."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Tempo"
                        secondary="Use the tempo slider to adjust the speed (in BPM) of the rhythm."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Tracks"
                        secondary="Each track represents a separate rhythmic layer. You can enable/disable it, change the number of beats, rotate the pattern, mute it, or select a different percussion sound."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Beat Editor"
                        secondary="Click on any beat dot in the circle to toggle whether it’s active. The circle updates in real-time to reflect your rhythm."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Share"
                        secondary="After creating a rhythm, use the share button to copy a link to your exact rhythm and send it to others."
                    />
                </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
                Built with ❤️ using React, Tone.js, and MUI. Inspired by rhythmic traditions around the world.
            </Typography>
        </Box>
    );
}
