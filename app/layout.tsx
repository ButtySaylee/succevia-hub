import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PWARegister from "@/components/PWARegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://succeviahub.vercel.app"),
  manifest: "/manifest.webmanifest",
  title: "Succevia Hub – Global Jobs, Scholarships & Marketplace",
  description:
    "The world's trusted hub for jobs, scholarships, and buying & selling items safely via WhatsApp.",
  keywords: [
    "succevia hub",
    "global jobs",
    "international scholarships",
    "worldwide marketplace",
    "buy and sell globally",
    "international trading",
    "global commerce",
    "classified ads worldwide",
    "whatsapp marketplace",
    "global e-commerce",
    "international opportunities",
    "worldwide trading platform",
  ],
  authors: [{ name: "Butty Saylee" }],
  alternates: {
    canonical: "https://succeviahub.vercel.app",
  },
  openGraph: {
    title: "Succevia Hub - Global Marketplace",
    description:
      "The world's trusted hub for jobs, scholarships, and global commerce.",
    url: "https://succeviahub.vercel.app",
    siteName: "Succevia Hub",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://succeviahub.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Succevia Hub - Global Jobs, Scholarships & Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@succeviahub",
    creator: "@succeviahub",
    title: "Succevia Hub - Global Marketplace",
    description:
      "The world's trusted hub for jobs, scholarships, and global commerce.",
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
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Succevia Hub",
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
      <body suppressHydrationWarning className={`${geistSans.variable} antialiased min-h-screen bg-slate-50`}>
          <PWARegister />
          <PWAInstallPrompt />
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"} />
        {children}
      </body>
    </html>
  );
}
