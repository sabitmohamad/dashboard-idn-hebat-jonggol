import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE =
  "IDN Hebat - Dashboard Prestasi Siswa SMP IDN Jonggol";

const SITE_DESCRIPTION =
  "Dashboard Pemantauan Prestasi, Mengajar, Lomba, Menulis, dan Talking Siswa IDN Boarding School.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | IDN Hebat",
  },
  description: SITE_DESCRIPTION,
  applicationName: "IDN Hebat",
  authors: [{ name: "SMP IDN Jonggol" }],
  keywords: [
    "IDN Hebat",
    "SMP IDN Jonggol",
    "Dashboard Prestasi",
    "IDN Mengajar",
    "IDN Lomba",
    "IDN Menulis",
    "IDN Talking",
    "Boarding School",
  ],
  icons: {
    icon: [
      { url: "/favicon-32.png?v=5", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png?v=5", type: "image/png", sizes: "16x16" },
      { url: "/icon-192.png?v=5", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png?v=5", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon-32.png?v=5",
    apple: [
      {
        url: "/apple-touch-icon.png?v=5",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "IDN Hebat",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/icon-512.png?v=5",
        width: 512,
        height: 512,
        alt: "IDN Hebat",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/icon-512.png?v=5"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563EB" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
