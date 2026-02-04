import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const inter = Inter({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Plinng – Contenido para redes sociales",
  description: "Genera contenido para redes sociales con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`min-h-screen bg-[#F5F5EB] ${GeistSans.className} ${GeistSans.variable} ${inter.variable}`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
