import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Credits from "../components/Credits";
import NavbarServer from "../components/navbar/Navbar.server";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

// TEMP: Initialize dummy data source for blog preview
// Remove this when connecting to real CMS/API
import { initializeDataSource } from "@/lib/data/blog";
initializeDataSource({ type: "dummy" });

/* ---------------- Fonts - Apple/Google Style ---------------- */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ---------------- SEO Metadata ---------------- */
export const metadata: Metadata = {
  metadataBase: new URL("https://travelnflex.apsgroupco.com"),

  title: {
    default: "TravelnFlex",
    template: "%s | TravelnFlex",
  },

  description:
    "TravelnFlex helps you explore Uttarakhand through curated spiritual journeys, adventure tours, retreats, and authentic local experiences.",

  applicationName: "TravelnFlex",

  keywords: [
    "Uttarakhand tourism",
    "Devbhoomi travel",
    "spiritual tours Uttarakhand",
    "adventure trips Uttarakhand",
    "Uttarakhand travel packages",  
    "tourism in Uttarakhand",
    "Uttarakhand pilgrimage tours",
    "Himalayan adventures",
    "travelnflex",
    "travelnflex travel",
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
    url: "https://travelnflex.apsgroupco.com",
    siteName: "TravelnFlex",
    title: "TravelnFlex – Sacred journeys made simple",
    description:
      "Plan spiritual tours, adventure trips, and authentic experiences across Uttarakhand with TravelnFlex.",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "TravelnFlex – Uttarakhand Travel Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TravelnFlex",
    description:
      "Sacred journeys made simple. Explore Uttarakhand with curated tours and experiences.",
    images: ["/icon.svg"],
  },

  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

/* ---------------- Root Layout ---------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="custom-scrollbar">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
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
              name: "TravelnFlex",
              url: "https://TravelnFlex.apsgroupco.com",
              logo: "https://TravelnFlex.apsgroupco.com/icon.svg",
              description:
                "TravelnFlex offers spiritual, adventure, and cultural travel experiences across Uttarakhand.",
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
