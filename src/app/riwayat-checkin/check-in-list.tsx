"use client";

import Link from "next/link";
import { Calendar, Plus, Sparkles } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { useCheckIns } from "@/hooks/use-check-ins";
import { getMoodInfo } from "@/lib/validations/check-in";

/**
 * Memformat string ISO timestamp menjadi tanggal dan waktu berbahasa Indonesia.
 *
 * @param isoString String tanggal dalam format ISO 8601.
 * @returns Teks tanggal berformat lokal (contoh: "Selasa, 10 November 2026 pukul 08.16").
 */
function formatTimestamp(isoString: string | null) {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Komponen daftar riwayat check-in pengguna.
 * Menampilkan catatan check-in berurutan dari yang paling baru, lengkap dengan badge mood,
 * waktu pencatatan, faktor yang memengaruhi, dan catatan opsional.
 */
export function CheckInList() {
  const { checkIns, loading, error, unauthorized } = useCheckIns();

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-28 animate-pulse rounded-2xl border border-line bg-card/60" />
        <div className="h-28 animate-pulse rounded-2xl border border-line bg-card/60" />
        <div className="h-28 animate-pulse rounded-2xl border border-line bg-card/60" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="rounded-3xl border border-line bg-card p-8 text-center shadow-sm">
        <h2 className="text-heading text-ink">Perlu Masuk Akun</h2>
        <p className="mt-3 text-ink-soft">
          Silakan masuk terlebih dahulu untuk melihat riwayat check-in emosimu.
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

  if (error) {
    return (
      <div role="alert" className="rounded-2xl bg-alert-soft p-5 text-alert-ink">
        <p className="font-semibold">Terjadi kendala saat memuat riwayat:</p>
        <p className="mt-1 text-small">{error}</p>
      </div>
    );
  }

  if (checkIns.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-card/70 p-10 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-paper-deep text-ink">
          <Sparkles className="size-6 text-main-500" />
        </div>
        <h2 className="mt-4 text-card-title text-ink">Belum Ada Riwayat Check-In</h2>
        <p className="mx-auto mt-2 max-w-md text-small text-ink-soft">
          Kamu belum pernah mengisi check-in harian. Luangkan satu menit untuk mengenali kondisimu saat ini.
        </p>
        <div className="mt-6">
          <Link
            href="/checkin"
            className={cn(buttonVariants({ size: "lg" }), "rounded-2xl")}
          >
            <Plus className="mr-1.5 size-4" />
            Mulai Check-In Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <p className="text-small text-muted">
          Menampilkan <span className="font-semibold text-ink">{checkIns.length}</span> catatan check-in
        </p>
        <Link
          href="/checkin"
          className={cn(buttonVariants({ size: "sm" }), "rounded-xl")}
        >
          <Plus className="mr-1 size-3.5" />
          Check-In Baru
        </Link>
      </div>

      <div className="space-y-4">
        {checkIns.map((item) => {
          const moodInfo = getMoodInfo(item.mood);
          const timeLabel = formatTimestamp(item.response_time ?? item.scheduled_for);

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-line bg-card p-5 transition-shadow hover:shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-paper-deep px-3 py-1">
                  <span className="text-xl" role="img" aria-label={moodInfo.label}>
                    {moodInfo.emoji}
                  </span>
                  <span className="text-small font-semibold text-ink">{moodInfo.label}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <Calendar className="size-3.5" />
                  <time dateTime={item.response_time ?? item.scheduled_for}>{timeLabel}</time>
                </div>
              </div>

              {item.influencing_factor && item.influencing_factor.length > 0 && (
                <div className="mt-3.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Faktor yang Memengaruhi:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.influencing_factor.map((factor) => (
                      <span
                        key={factor}
                        className="rounded-full border border-line/80 bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.note && (
                <div className="mt-4 rounded-xl border border-line/50 bg-paper/50 p-3.5">
                  <p className="whitespace-pre-wrap text-small text-ink-soft">{item.note}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
