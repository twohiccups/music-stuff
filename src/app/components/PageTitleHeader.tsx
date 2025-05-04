import { SxProps, Theme, Typography } from "@mui/material";


interface PageTitleHeaderProps {
    title: string
    sx?: SxProps<Theme>
}

export default function PageTitleHeader({ title, sx }: PageTitleHeaderProps) {
    return (
        <Typography variant="h3" component="h1" textAlign="center" sx={{ my: 2, ...sx }}>{title}</Typography>
    )
}