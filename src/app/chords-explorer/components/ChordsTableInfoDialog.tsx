"use client";

import React from "react";
import { Typography, Box, Divider } from "@mui/material";

export default function ChordExplorerInfoDialog() {
    return (
        <>
            <Typography gutterBottom>
                Welcome to <strong>Chord Explorer</strong> — learn how chords and their inversions work in music.
            </Typography>

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">🎼 What Are Chords?</Typography>
                <Typography sx={{ mb: 1 }}>
                    At its most basic, <strong>a chord</strong> is a group of notes played together at the same time. Most commonly, chords use three or four notes — but they can include any number (the more, the jazzier).
                    What shapes a chord’s quality and character is the distance between its notes, known as <em>intervals</em>.
                </Typography>
                <Typography sx={{ mb: 1 }}>
                    One of the most common chord types is the <strong>triad</strong>, made up of:
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                    <li><strong>Root</strong>: the main note the chord is named after.</li>
                    <li><strong>Third</strong>: helps define whether the chord sounds major or minor.</li>
                    <li><strong>Fifth</strong>: adds stability and fullness to the chord.</li>
                </Box>
                <Typography sx={{ mt: 1 }}>
                    For example, a <strong>C major triad</strong> contains the notes C (root), E (major third), and G (perfect fifth).
                </Typography>
                <Typography sx={{ mt: 1 }}>
                    Chords form the harmonic foundation of most Western music, shaping emotional tone and musical movement.
                    But the idea of combining notes — whether for harmony, color, or texture — exists in many musical traditions worldwide, each with its own approach.
                </Typography>
            </Box>


            <Divider sx={{ my: 2 }} />

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">🔄 What Are Chord Inversions?</Typography>
                <Typography sx={{ mb: 1 }}>
                    An <strong>inversion</strong> happens when the notes in a chord are rearranged so that a note other than the root is in the lowest (bass) position.
                    The harmonic identity stays the same, but the <em>voicing</em> changes.
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                    <li><strong>Root Position</strong>: the root is the lowest note.</li>
                    <li><strong>1st Inversion</strong>: the third is the lowest note.</li>
                    <li><strong>2nd Inversion</strong>: the fifth is the lowest note.</li>
                    <li><strong>3rd Inversion</strong> (for 7th chords): the seventh is the lowest note.</li>
                </Box>
                <Typography sx={{ mt: 1 }}>
                    Inversions add variety and help create smoother, more interesting transitions between chords.
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">🎛 How the App Works</Typography>
                <Typography sx={{ mb: 1 }}>
                    Use the interactive grid to explore different chords and their inversions:
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                    <li>Each <strong>row</strong> represents a chord type (e.g., major, minor, diminished).</li>
                    <li>Each <strong>column</strong> represents an inversion (root, 1st, 2nd, etc.).</li>
                    <li>Each cell contains a button — click it to hear the chord and see it briefly highlighted.</li>
                    <li>Buttons with a 🎵 icon indicate playable chord-inversion combinations.</li>
                    <li>The interface is <strong>responsive</strong> for use on both desktop and mobile devices.</li>
                </Box>
                <Typography sx={{ mt: 1 }}>
                    This layout helps you understand how inversions sound and how they affect harmonic flow.
                </Typography>
            </Box>


            <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4 }}>
                    Do All Musical Cultures Use Chords?
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    In <strong>Western music</strong> — particularly from the Baroque era through Classical, Romantic, and into jazz and pop — chords are central.
                    Harmony is often created by stacking intervals into <strong>triads</strong> and extended chords, then organizing them into progressions that give music direction, emotion, and resolution.
                    This approach to harmony, based on <strong>vertical structures</strong> and <strong>functional relationships</strong> between chords, has become a core feature of how Western music is written, taught, and analyzed.
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    But not all musical cultures build harmony this way. Many create rich musical experiences using entirely different systems — some without chords at all.
                    Harmony can emerge from <strong>melody</strong>, <strong>texture</strong>, <strong>rhythm</strong>, or <strong>timbre</strong>, rather than from stacked notes played simultaneously.
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    In much of <strong>sub-Saharan African music</strong>, for example, harmony is often the result of <strong>interlocking melodic patterns</strong> and <strong>layered rhythms</strong>.
                    Multiple vocal or instrumental lines may be played simultaneously, each with its own rhythmic phrasing or contour, creating a dense, textured soundscape.
                    Rather than relying on fixed chord progressions, this music often emphasizes <strong>cyclical structure</strong>, <strong>call and response</strong>, and <strong>polyrhythmic interaction</strong> — producing harmony as a natural outcome of musical dialogue and community participation.
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    In <strong>Indian classical music</strong>, harmony is approached differently again: the <strong>drone</strong> establishes a tonal center while the melodic line explores the <strong>raga</strong> — a scale with emotional and cultural meaning.
                    Chord changes are absent; instead, <strong>tension and release</strong> unfold over time through pitch, rhythm, and ornamentation.
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    In <strong>traditional East Asian music</strong>, such as Chinese or Japanese classical traditions, harmony often plays a subtle role.
                    The focus may be on <strong>melody</strong>, <strong>mode</strong>, or <strong>timbre</strong>, with parallel lines or <strong>heterophonic textures</strong> rather than stacked chords.
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    So while chords are essential in many Western styles, they are not a universal requirement for making expressive, complex, or emotionally powerful music.
                    Across cultures, harmony can be built in many ways — not just vertically through chords, but also through <strong>horizontal movement</strong>, <strong>rhythmic layering</strong>, or <strong>tonal resonance</strong>.
                </Typography>
            </Box>

        </>
    );
}
