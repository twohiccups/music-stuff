import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import "./globals.css";
import { ThemeContextProvider } from "@src/contexts/ThemeContext";
import { CssBaseline } from "@mui/material";
import { CommonActionsProvider } from "@src/contexts/CommonActionsContext";
import ThemeOptions from "./components/ThemeOptions";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Projects",
  description: "Educational and experimental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {






  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <ThemeContextProvider>
            <CommonActionsProvider>
              {children}
              <ThemeOptions />
            </CommonActionsProvider>
            <CssBaseline />
          </ThemeContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html >
  );
}


