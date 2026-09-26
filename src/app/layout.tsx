import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://abnafrobiznetwork.com"),
  title: {
    default: "AfroBiz Network (ABN) – Ecossistema africano de empreendedorismo e negócios",
    template: "%s | AfroBiz Network (ABN)"
  },
  description: "Ecossistema africano de empreendedorismo com representações em cinco países: incubação, formação, mentoria, loja digital, oportunidades e parcerias.",
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
    url: "https://abnafrobiznetwork.com",
    title: "AfroBiz Network (ABN) – Ecossistema africano de empreendedorismo e negócios",
    description: "Ecossistema africano de empreendedorismo com representações em cinco países: incubação, formação, mentoria, loja digital, oportunidades e parcerias.",
    siteName: "AfroBiz Network (ABN)",
    images: [
      {
        url: "https://abnafrobiznetwork.com/hero_entrepreneurs.png",
        width: 1200,
        height: 630,
        alt: "AfroBiz Network Banner - Conectando África ao Mundo",
      },
      {
        url: "https://abnafrobiznetwork.com/abn-logo.png",
        width: 512,
        height: 512,
        alt: "ABN Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AfroBiz Network (ABN) – Ecossistema africano de empreendedorismo e negócios",
    description: "Ecossistema africano de empreendedorismo com representações em cinco países: incubação, formação, mentoria, loja digital, oportunidades e parcerias.",
    images: ["https://abnafrobiznetwork.com/hero_entrepreneurs.png"],
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
            // Nota: Substituir G-XXXXXXXXXX pelo ID real do Google Analytics
          `}
        </Script>
      </head>
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
