import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MusicPlayer from "./components/MusicPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nikhil Meena - Full Stack Developer",
  description:
    "Portfolio of Nikhil Meena, a passionate full stack developer specializing in React, Next.js, and modern web technologies.",
  keywords: ["developer", "full stack", "react", "next.js", "portfolio"],
  authors: [{ name: "Nikhil Meena" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
        <MusicPlayer />
      </body>
    </html>
  );
}
