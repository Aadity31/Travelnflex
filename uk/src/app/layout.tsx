import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Credits from "./components/Credits";
import NavbarServer from "./components/navbar/Navbar.server";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

/* ---------------- Fonts ---------------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ---------------- SEO Metadata ---------------- */
export const metadata: Metadata = {
  metadataBase: new URL("https://devbhoomi-darshan.apsgroupco.com"),

  title: {
    default: "Devbhoomi Darshan",
    template: "%s | Devbhoomi Darshan",
  },

  description:
    "Devbhoomi Darshan helps you explore Uttarakhand through curated spiritual journeys, adventure tours, retreats, and authentic local experiences.",

  applicationName: "Devbhoomi Darshan",

  keywords: [
    "Uttarakhand tourism",
    "Devbhoomi travel",
    "Char Dham Yatra",
    "Rishikesh tours",
    "spiritual tourism India",
    "adventure travel Uttarakhand",
  ],

  authors: [{ name: "APS Groups Soft" }],
  creator: "APS Groups Soft",
  publisher: "APS Groups Soft",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://devbhoomi-darshan.apsgroupco.com",
    siteName: "Devbhoomi Darshan",
    title: "Devbhoomi Darshan – Sacred journeys made simple",
    description:
      "Plan spiritual tours, adventure trips, and authentic experiences across Uttarakhand with Devbhoomi Darshan.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Devbhoomi Darshan – Uttarakhand Travel Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Devbhoomi Darshan",
    description:
      "Sacred journeys made simple. Explore Uttarakhand with curated tours and experiences.",
    images: ["/icon.png"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

/* ---------------- Root Layout ---------------- */
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
        {/* Cloudinary Upload Widget */}
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "Devbhoomi Darshan",
              url: "https://devbhoomi-darshan.apsgroupco.com",
              logo: "https://devbhoomi-darshan.apsgroupco.com/icon.png",
              description:
                "Devbhoomi Darshan offers spiritual, adventure, and cultural travel experiences across Uttarakhand.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
            }),
          }}
        />

        <Providers>
          {/* ✅ Navbar ALWAYS mounted */}
          <NavbarServer />

          {/* ✅ Only page / route content swaps (loading.tsx here) */}
          {children}

          <Credits />

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
                padding: "12px 14px",
                fontSize: "0.875rem",
                maxWidth: "90vw",
              },
              success: {
                iconTheme: {
                  primary: "#f97316",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
