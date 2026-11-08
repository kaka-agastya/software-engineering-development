"use client";

import { useEffect, useState } from "react";
import type {
  UserAccount,
  UserAccountFieldErrors,
  UserAccountUpdate,
} from "@/lib/validations/user-account";

export type UpdateResult =
  | { success: true }
  | { success: false; error?: string; fieldErrors?: UserAccountFieldErrors };

/** GET /api/user-account */
async function fetchUserAccounts(): Promise<{ data: UserAccount[] } | { error: string }> {
  try {
    const res = await fetch("/api/user-account");
    const json = await res.json();
    return res.ok ? { data: json.data } : { error: json.error ?? "Gagal mengambil data." };
  } catch {
    return { error: "Tidak dapat terhubung ke server." };
  }
}

/**
 * Mengambil & mengubah data user_account lewat API.
 *
 *   const { users, loading, error, update } = useUserAccounts();
 *
 * Semua request terlihat di DevTools > Network.
 */
export function useUserAccounts() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Naikkan angka ini untuk mengambil ulang data
  const [reloadKey, setReloadKey] = useState(0);

  // Ambil data saat halaman dibuka, dan setiap kali reloadKey berubah
  useEffect(() => {
    let ignore = false; // abaikan hasil lama kalau sudah ada request baru

    fetchUserAccounts().then((result) => {
      if (ignore) return;
      if ("data" in result) {
        setUsers(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  /** PATCH /api/user-account/:id */
  async function update(id: string, values: UserAccountUpdate): Promise<UpdateResult> {
    try {
      const res = await fetch(`/api/user-account/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.error, fieldErrors: json.fieldErrors };

      setReloadKey((k) => k + 1); // muat ulang tabel supaya menampilkan data terbaru
      return { success: true };
    } catch {
      return { success: false, error: "Tidak dapat terhubung ke server." };
    }
  }

  return { users, loading, error, update };
}
