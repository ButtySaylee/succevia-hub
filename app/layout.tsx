import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gbana Market – The Liberian Trust-First Marketplace",
  description:
    "Buy and sell used & new items in Liberia. Trusted, affordable, and mobile-friendly.",
  keywords: "Liberia, marketplace, buy, sell, Monrovia, Gbana, mobile money",
  authors: [{ name: "Butty Saylee" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
