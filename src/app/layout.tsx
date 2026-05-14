import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Roboto for the marketing landing page — pairs with the brush-painted logo and
// the Onir-derived design vocabulary (peach hero / navy headings / blue CTA).
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const SITE_URL = "https://sotlobe.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SOTlobe.ai — Upgrade your AI with advanced thinking",
  description:
    "Procedural cognitive protocols (GBB · DVR · CPV · TPF) from the School of Thinking, delivered as a live-updated skill manifest your AI agent fetches in one line.",
  keywords: [
    "School of Thinking",
    "SOT",
    "SOTlobe",
    "AI agent skill",
    "GBB",
    "DVR",
    "CPV",
    "TPF",
    "cvs2bvs",
    "x10 thinking",
    "Michael Hewitt-Gleeson",
  ],
  authors: [{ name: "School of Thinking", url: "https://schoolofthinking.org" }],
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "SOTlobe.ai",
    title: "SOTlobe.ai — Upgrade your AI with advanced thinking",
    description:
      "Procedural cognitive protocols (GBB · DVR · CPV · TPF) from the School of Thinking, delivered live to your AI agent.",
    images: [{ url: "/favicon-512.png", width: 512, height: 512, alt: "SOTlobe" }],
  },
  twitter: {
    card: "summary",
    title: "SOTlobe.ai — Upgrade your AI with advanced thinking",
    description:
      "Procedural cognitive protocols (GBB · DVR · CPV · TPF) from the School of Thinking, delivered live to your AI agent.",
    images: ["/favicon-512.png"],
  },
  // Search-engine ownership verification slots — env-driven so codes can be
  // rotated without a code change.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-roboto)]">
        {children}
      </body>
    </html>
  );
}
