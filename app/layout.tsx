import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Palgonic — l'identité pro des indépendants connectés",
    template: "%s · Palgonic",
  },
  description:
    "La carte de visite numérique des indépendants francophones. NFC, QR, partage en un geste. Gratuit pour commencer.",
  applicationName: "Palgonic",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Palgonic",
    title: "Palgonic — l'identité pro des indépendants connectés",
    description:
      "La carte de visite numérique des indépendants francophones.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palgonic",
    description:
      "La carte de visite numérique des indépendants francophones.",
  },
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="bg-creme text-encre antialiased">{children}</body>
    </html>
  );
}