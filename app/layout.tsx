import type { Metadata } from "next";
import "./globals.css";
import { MissionProvider } from "@/context/MissionContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "The Case of the Misleading Mind",
  description: "A detective puzzle game for language learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Special+Elite&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <MissionProvider>
          <AppShell>
            {children}
          </AppShell>
        </MissionProvider>
      </body>
    </html>
  );
}
