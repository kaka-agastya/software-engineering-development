import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CrisisStrip } from "./_components/CrisisStrip";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";
import "./globals.css";

// Inter sesuai design system LIVIA
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LIVIA – Tempat bercerita kapan pun kamu perlu",
    template: "%s | LIVIA",
  },
  description:
    "LIVIA (Living Voice for Inner Awareness) adalah aplikasi Android berbasis AI untuk teman bercerita, yang juga mengabari orang terdekatmu ketika kamu perlu ditolong.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Lewati ke isi halaman
        </a>
        <CrisisStrip />
        <SiteHeader />
        <main id="konten">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
