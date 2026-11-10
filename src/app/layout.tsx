import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CrisisStrip } from "@/components/CrisisStrip";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

// Inter sesuai design system LIVIA
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LIVIA - Teman cerita yang selalu ada",
    template: "%s | LIVIA",
  },
  description:
    "LIVIA (Living Voice for Inner Awareness) adalah aplikasi Android berbasis AI yang mendampingi kamu secara emosional dan menghubungi orang terdekatmu saat kamu butuh bantuan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Langsung ke konten
        </a>
        <CrisisStrip />
        <SiteHeader />
        <main id="konten">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
