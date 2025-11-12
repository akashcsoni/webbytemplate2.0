import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "optional", // Prevent layout shift - use fallback if font not ready
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true, // Match fallback font metrics
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false, // Not critical for initial render
  fallback: ["monospace"],
});
