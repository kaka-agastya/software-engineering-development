"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCheckIns } from "@/hooks/use-check-ins";
import { sendJson } from "@/lib/send-json";
import {
  FACTORS,
  MOODS,
  type MoodValue,
} from "@/lib/validations/check-in";

/**
 * Komponen formulir check-in harian.
 * Memungkinkan pengguna memilih tingkat mood emosional, faktor-faktor pemicu,
 * dan menuliskan catatan refleksi singkat.
 */
export function CheckInForm() {
  const router = useRouter();
  const { submitCheckIn } = useCheckIns();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [mood, setMood] = useState<MoodValue | null>(null);
  const [factors, setFactors] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    sendJson("/api/me", "GET").then((res) => {
      setCheckingAuth(false);
      setIsAuthenticated(res.ok);
    });
  }, []);

  function toggleFactor(factor: string) {
    setFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) {
      setErrorMessage("Silakan pilih mood kamu terlebih dahulu.");
      return;
    }

    setBusy(true);
    setErrorMessage(null);

    const res = await submitCheckIn({
      mood,
      influencing_factor: factors,
      note: note.trim(),
    });

    setBusy(false);

    if (res.ok) {
      setIsSuccess(true);
    } else {
      if (res.status === 401) {
        setIsAuthenticated(false);
        setErrorMessage("Sesi kamu telah berakhir. Silakan masuk kembali.");
      } else {
        setErrorMessage(res.error ?? "Gagal menyimpan check-in. Coba lagi.");
      }
    }
  }

  function handleReset() {
    setMood(null);
    setFactors([]);
    setNote("");
    setErrorMessage(null);
    setIsSuccess(false);
  }

  if (checkingAuth) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Memeriksa sesi pengguna...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-card p-8 text-center shadow-sm">
        <h2 className="text-heading text-ink">Perlu Masuk Akun</h2>
        <p className="mt-3 text-ink-soft">
          Kamu perlu masuk ke akun LIVIA untuk mencatat check-in harian dan melihat riwayat emosimu.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/masuk" className={cn(buttonVariants({ size: "lg" }))}>
            Masuk ke Akun
          </Link>
          <Link href="/daftar" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-card p-8 text-center shadow-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-main-50 text-main-700">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="mt-4 text-heading text-ink">Check-In Berhasil Disimpan</h2>
        <p className="mt-2 text-ink-soft">
          Terima kasih telah mengambil jeda sejenak untuk mengenali perasaanmu hari ini.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/riwayat-checkin"
            className={cn(buttonVariants({ size: "lg" }), "rounded-2xl")}
          >
            Lihat Riwayat Check-In
          </Link>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-2xl"
            onClick={handleReset}
          >
            Check-In Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-line bg-card p-6 shadow-sm sm:p-10">
      <div className="relative mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="grid size-10 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-deep focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-small font-semibold text-ink-soft">Check-In Harian</span>
        <div className="size-10" aria-hidden />
      </div>

      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Bagaimana kabarmu hari ini?
        </h1>
        <p className="mt-2 text-small text-ink-soft sm:text-body">
          Setiap perasaanmu valid. Ambil jeda sejenak untuk mengenali kondisimu saat ini.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8" noValidate>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            PILIH MOOD KAMU
          </h2>
          <div
            role="radiogroup"
            aria-label="Pilih mood kamu"
            className="mt-4 grid grid-cols-5 gap-2 sm:gap-4"
          >
            {MOODS.map((item) => {
              const isSelected = mood === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setMood(item.value)}
                  className="group flex flex-col items-center focus-visible:outline-none"
                >
                  <span
                    className={`grid size-14 place-items-center rounded-full text-2xl transition-all sm:size-16 sm:text-3xl ${
                      isSelected
                        ? "border-2 border-[#E9A8A8] bg-[#FCEBEA] shadow-sm ring-4 ring-[#FCEBEA]"
                        : "border border-line/80 bg-white hover:border-main-100 hover:bg-paper-deep"
                    }`}
                  >
                    {item.emoji}
                  </span>
                  <span
                    className={`mt-2 text-center text-xs transition-colors ${
                      isSelected ? "font-bold text-ink" : "text-muted group-hover:text-ink-soft"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            APA YANG PALING MEMENGARUHI PIKIRANMU?
          </h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {FACTORS.map((factor) => {
              const isSelected = factors.includes(factor);
              return (
                <button
                  key={factor}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleFactor(factor)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all sm:text-sm ${
                    isSelected
                      ? "border border-ink bg-ink text-paper shadow-sm"
                      : "border border-line bg-white text-ink-soft hover:bg-paper-deep"
                  }`}
                >
                  {factor}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-semibold text-ink sm:text-base">
            Ceritakan lebih lanjut (opsional)
          </label>
          <div className="mt-2.5">
            <Textarea
              id="note"
              name="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tuliskan apa yang kamu rasakan atau hal penting lainnya..."
              className="resize-none"
            />
          </div>
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-xl bg-alert-soft p-3 text-small text-alert-ink">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={!mood || busy}
          className="h-12 w-full rounded-2xl bg-ink text-base font-semibold text-paper shadow-md transition-colors hover:bg-ink/90 disabled:opacity-40"
        >
          {busy ? "Mengirim..." : "Kirim Check-in"}
        </Button>
      </form>
    </div>
  );
}
