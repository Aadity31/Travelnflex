import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Credits from "./components/Credits";
import NavbarServer from "./components/navbar/Navbar.server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devbhoomi Darshan - Sacred Adventures & Spiritual Journeys",
  description:
    "Discover sacred adventures in Rishikesh & Haridwar with expert local guides, adventure activities, and customized spiritual journeys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarServer />
        {children}
        <Credits />
      </body>
    </html>
  );
}
