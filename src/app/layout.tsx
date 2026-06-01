import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pianoclaro.com"),
  title: "Piano Claro | Aprende piano entendiendo lo que tocas",
  description: "Plataforma en español para aprender piano leyendo partituras desde el primer día.",
  openGraph: {
    title: "Piano Claro",
    description:
      "Plataforma en español para aprender piano leyendo partituras desde el primer día.",
    url: "/",
    siteName: "Piano Claro",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piano Claro",
    description:
      "Plataforma en español para aprender piano leyendo partituras desde el primer día.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
