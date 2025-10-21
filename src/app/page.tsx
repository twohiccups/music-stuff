'use client';

import {
  Box,
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
          <Typography variant='h2' component='h1' gutterBottom>
            Music Apps
          </Typography>
          <Typography variant='subtitle1' color='text.secondary' gutterBottom>
            Dive into chords, voicings, modes, and complex rhythmic patterns
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: '100%',
              maxWidth: 600,
              mt: 4,
            }}
          >
            <FeatureCard
              title='Chords Explorer'
              description='Interactive chord grid with keyboard visualization.'
              href='/chords-explorer'
            />
            <FeatureCard
              title='Modes Explorer'
              description='Play through the seven modes with a responsive piano keyboard.'
              href='/modes'
            />
            <FeatureCard
              title='Polyrhythms'
              description='Explore and visualize complex rhythmic patterns.'
              href='/polyrhythms'
            />
            <FeatureCard
              title='Ear Training'
              description='Train your ear to recognize sounds.'
              href='/ear-training'
            />
            <FeatureCard
              title='Sliding Intervals'
              description='Adjust slider to match the sound.'
              href='/sliding-intervals'
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
