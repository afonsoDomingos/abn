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
  title: {
    default: "ABN – AfroBiz Network",
    template: "%s | ABN – AfroBiz Network"
  },
  description: "A principal plataforma estratégica para o empreendedorismo africano e afrodescendente. Conectamos startups a mentores, investidores e recursos digitais.",
  keywords: [
    "ABN",
    "AfroBiz Network",
    "Empreendedorismo Africano",
    "Startups em África",
    "PMEs Africanas",
    "Incubadora Digital",
    "Aceleração de Startups",
    "Negócios em África",
    "Investimento em África",
    "Presença Digital",
    "Afro-futurismo"
  ],
  authors: [{ name: "ABN – AfroBiz Network" }],
  creator: "ABN – AfroBiz Network",
  publisher: "ABN – AfroBiz Network",
  icons: {
    icon: "/abn-logo.png",
    shortcut: "/abn-logo.png",
    apple: "/abn-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://abnafrobiznetwork.com",
    title: "ABN – AfroBiz Network | Incubadora & Aceleração de Startups",
    description: "A principal plataforma estratégica para o empreendedorismo africano e afrodescendente. Conectamos startups a mentores, investidores e recursos de escala.",
    siteName: "ABN – AfroBiz Network",
    images: [
      {
        url: "/abn-logo.png",
        width: 512,
        height: 512,
        alt: "ABN – AfroBiz Network Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABN – AfroBiz Network",
    description: "A principal plataforma estratégica para o empreendedorismo africano e afrodescendente.",
    images: ["/abn-logo.png"],
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
        </LanguageProvider>
      </body>
    </html>
  );
}
