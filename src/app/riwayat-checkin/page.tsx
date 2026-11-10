import type { Metadata } from "next";
import { CheckInList } from "./check-in-list";

export const metadata: Metadata = {
  title: "Riwayat Check-In",
  description: "Daftar riwayat catatan check-in harian dan refleksi emosi pengguna di LIVIA.",
};

export default function RiwayatCheckInPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Riwayat Check-In
        </h1>
        <p className="mt-2 text-ink-soft">
          Perjalanan perasaanmu dari waktu ke waktu. Amati pola emosimu dan faktor-faktor yang menyertainya.
        </p>
      </div>

      <CheckInList />
    </section>
  );
}
