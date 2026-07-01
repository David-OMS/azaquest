import { Barlow_Condensed, Geist } from "next/font/google";

export const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-family",
});

export const bodyFont = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
