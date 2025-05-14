'use client';

import {
  Box,
  Grid,
  Typography,
  GlobalStyles,
} from '@mui/material';
import FeatureCard from './components/FeatureCard';

export default function Home() {
  return (
    <>
      <GlobalStyles
        styles={{
          'html, body': {
            overflow: 'auto !important',
            height: 'auto !important',
            width: 'auto !important',
          },
        }}
      />

      <Box
        sx={{
          height: '100vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 2,
            py: 4,
            gap: 2,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Music Stuff !
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Dive into chords, voicings, and complex rhythmic patterns
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ mt: 4, width: '100%', maxWidth: 800 }}>
            <FeatureCard
              title="Chords Table"
              description="Browse chord voicings and progressions in an interactive grid."
              href="/chords-table"
            />
            <FeatureCard
              title="Polyrhythm"
              description="Explore and visualize complex rhythmic patterns."
              href="/polyrhythm"
            />
            <FeatureCard
              title="Ear Training"
              description="Train your ear to recognize sounds."
              href="/ear-training"
            />
            <FeatureCard
              title="Sliding Intervals"
              description="Adjust slider to match the sound."
              href="/sliding-intervals"
            />
          </Grid>

        </Box>
      </Box>

    </>
  );
}
