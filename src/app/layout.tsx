import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://afrobiznetwork.com"),
  title: {
    default: "AfroBiz Network (ABN) — Conectando África ao Mundo",
    template: "%s | AfroBiz Network (ABN)"
  },
  description: "O principal ecossistema de negócios e aceleração empresarial em África. Conectamos startups, PMEs, mentores, investidores e parceiros estratégicos com programas de incubação, eventos e acesso a capital.",
  keywords: [
    "ABN",
    "AfroBiz Network",
    "Empreendedorismo Africano",
    "Startups em África",
    "PMEs Africanas",
    "Incubadora de Startups",
    "Aceleração de Startups",
    "Negócios em África",
    "Investimento em África",
    "Capacitação",
    "Mentoria de Negócios"
  ],
  authors: [{ name: "AfroBiz Network (ABN)" }],
  creator: "AfroBiz Network (ABN)",
  publisher: "AfroBiz Network (ABN)",
  icons: {
    icon: "/abn-logo.png",
    shortcut: "/abn-logo.png",
    apple: "/abn-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://afrobiznetwork.com",
    title: "AfroBiz Network (ABN) — Conectando África ao Mundo",
    description: "O principal ecossistema de negócios e aceleração empresarial em África. Conectamos startups, PMEs, mentores e investidores.",
    siteName: "AfroBiz Network (ABN)",
    images: [
      {
        url: "/hero_entrepreneurs.png",
        width: 1200,
        height: 630,
        alt: "AfroBiz Network Banner - Conectando África ao Mundo",
      },
      {
        url: "/abn-logo.png",
        width: 512,
        height: 512,
        alt: "ABN Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AfroBiz Network (ABN) — Conectando África ao Mundo",
    description: "O principal ecossistema de negócios e aceleração empresarial em África.",
    images: ["/hero_entrepreneurs.png"],
    creator: "@afrobiznetwork"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { LanguageProvider } from "@/lib/LanguageContext";
import CookieConsent from "@/components/CookieConsent";
import PromoBanner from "@/components/PromoBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <LanguageProvider>
          {children}
          <CookieConsent />
          <PromoBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
