import type { Metadata } from "next";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "AZAQUEST",
  description: "Every quest has a reward. Find yours.",
  icons: {
    icon: "/brand/azaquest-icon-dark.png",
    apple: "/brand/azaquest-icon-dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${fontVariables} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
