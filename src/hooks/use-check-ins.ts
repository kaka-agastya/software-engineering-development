"use client";

import { useEffect, useState } from "react";
import { type ApiResult, sendJson } from "@/lib/send-json";
import type { CheckInInput, CheckInItem } from "@/lib/validations/check-in";

/**
 * Hook untuk mengelola pengambilan data riwayat check-in dan pengiriman check-in baru.
 * Menangani state loading, error, dan status autentikasi pengguna secara reaktif.
 */
export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckInItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    sendJson<{ data: CheckInItem[] }>("/api/check-in", "GET").then((res) => {
      if (ignore) return;
      if (res.ok) {
        setCheckIns(res.data);
        setError(null);
        setUnauthorized(false);
      } else if (res.status === 401) {
        setUnauthorized(true);
      } else {
        setError(res.error ?? "Gagal mengambil data check-in.");
      }
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  /**
   * Mengirimkan data formulir check-in ke server dan memperbarui daftar riwayat jika berhasil.
   *
   * @param values Isian data check-in (mood, influencing_factor, note).
   * @returns Hasil panggilan API berisi ID data baru atau detail error.
   */
  async function submitCheckIn(values: CheckInInput): Promise<ApiResult<{ data: { id: string } }>> {
    const res = await sendJson<{ data: { id: string } }>("/api/check-in", "POST", values);
    if (res.ok) {
      reload();
    }
    return res;
  }

  return { checkIns, loading, error, unauthorized, reload, submitCheckIn };
}
