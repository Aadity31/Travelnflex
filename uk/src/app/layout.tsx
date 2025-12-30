import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Credits from "./components/Credits";
import NavbarServer from "./components/navbar/Navbar.server";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import LoadingOverlay from "./components/LoadingOverlay";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://devbhoomi-darshan.apsgroupco.com"),
  title: "Devbhoomi Darshan",
  description: "Sacred journeys made simple",
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
        {/* ⭐ Cloudinary Script */}
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />

        <Providers>
          <NavbarServer />
          {children}
          <LoadingOverlay />
          <Credits />

          {/* ⭐ RESPONSIVE Toast Notifications */}
          <Toaster
            position="top-right"
            containerClassName="!top-16 sm:!top-20"
            toastOptions={{
              duration: 3000,
              className: "!text-xs sm:!text-sm",
              style: {
                background: "#fff",
                color: "#333",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                borderRadius: "12px",
                padding: "12px 14px", // Reduced for mobile
                fontSize: "0.875rem", // 14px
                maxWidth: "90vw", // Mobile friendly
              },
              success: {
                iconTheme: {
                  primary: "#f97316",
                  secondary: "#fff",
                },
                style: {
                  padding: "12px 14px",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
                style: {
                  padding: "12px 14px",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
