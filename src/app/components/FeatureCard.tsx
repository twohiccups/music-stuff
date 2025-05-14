'use client';

import React from 'react';
import NextLink from 'next/link';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

interface FeatureCardProps {
    title: string;
    description: string;
    href: string;
}

export default function FeatureCard({ title, description, href }: FeatureCardProps) {
    return (
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
                href={href}
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
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
