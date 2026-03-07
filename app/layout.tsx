import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gbanamarket.vercel.app"),
  title: "GbanaMarket – Buy and Sell Products Online",
  description:
    "GbanaMarket is an online marketplace where users can buy and sell products easily. Shop trusted sellers in Liberia.",
  keywords: [
    "gbanas market",
    "online marketplace",
    "buy and sell",
    "liberia marketplace",
    "monrovia shopping",
    "classified ads",
    "whatsapp marketplace",
    "mobile money",
  ],
  authors: [{ name: "Butty Saylee" }],
  alternates: {
    canonical: "https://gbanamarket.vercel.app",
  },
  openGraph: {
    title: "GbanaMarket – Buy and Sell Products Online",
    description:
      "GbanaMarket is an online marketplace where users can buy and sell products easily.",
    url: "https://gbanamarket.vercel.app",
    siteName: "GbanaMarket",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://gbanamarket.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "GbanaMarket - Online Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gbanamarket",
    creator: "@gbanamarket",
    title: "GbanaMarket – Buy and Sell Products Online",
    description:
      "GbanaMarket is an online marketplace where users can buy and sell products easily.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

const organizationData = organizationSchema();
const websiteData = websiteSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data - Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        {/* Structured Data - Website */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData),
          }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={`${geistSans.variable} antialiased min-h-screen bg-slate-50`}>
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"} />
        {children}
      </body>
    </html>
  );
}
