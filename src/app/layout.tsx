import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piano Claro | Aprende piano entendiendo lo que tocas",
  description:
    "Plataforma en español para aprender piano leyendo partituras desde el primer día.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
