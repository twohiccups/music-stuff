import { Box, Card, Typography } from "@mui/material";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <Box className={styles.page}>
      <Typography variant="h1"> Weee hee
      </Typography>

      <Card sx={{ padding: 4 }}>
        <Link href="/chords-table">Chords Table</Link>
      </Card>
    </Box>
  );
}
