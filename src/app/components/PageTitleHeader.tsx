import { Box, SxProps, Theme, Typography } from "@mui/material";


interface PageTitleHeaderProps {
    title: string,
    subtitle?: string,
    absPosition?: boolean,
}

export default function PageTitleHeader({ title, subtitle, absPosition }: PageTitleHeaderProps) {
    const absolute: SxProps<Theme> = absPosition ? { position: "absolute", left: '50%', transform: 'translateX(-50%)' } : {}
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h3" component="h1" textAlign="center" sx={{ my: 2, ...absolute }}>{title}</Typography>
            {subtitle && (
                <Typography variant="h5" component="h2" textAlign="center" sx={{ my: 2, ...absolute }} gutterBottom>
                    {subtitle}
                </Typography>
            )}
        </Box>
    )
}