import { Box, Typography } from "@mui/material";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <Box className={styles.page}>
      <Typography variant="h1">      Oy Oy are are
      </Typography>

      <Link href="/chords-table">Chords Table</Link>
    </Box>
  );
}
