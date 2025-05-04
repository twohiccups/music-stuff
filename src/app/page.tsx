'use client';

import NextLink from 'next/link';
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';

export default function Home() {
  return (
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

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ mt: 4, width: '100%', maxWidth: 800 }}
        >
          {/* Chords Table Card */}
          <Card
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}
          >
            <CardActionArea
              component={NextLink}
              href="/chords-table"
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h2">
                  Chords Table
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse chord voicings and progressions in an interactive grid.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Polyrhythm Card */}
          <Card
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}
          >
            <CardActionArea
              component={NextLink}
              href="/polyrhythm"
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h2">
                  Polyrhythm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore and visualize complex rhythmic patterns.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Ear Training Card */}
          <Card
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}
          >
            <CardActionArea
              component={NextLink}
              href="/ear-training"
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h2">
                  Ear Training
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Train your ear to recognize sounds.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}
