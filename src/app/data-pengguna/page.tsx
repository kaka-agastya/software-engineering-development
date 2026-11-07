import type { Metadata } from "next";
import { UserTable } from "./user-table";

export const metadata: Metadata = { title: "Data Pengguna" };

/**
 * Halaman Data Pengguna.
 * Datanya diambil di browser oleh UserTable lewat GET /api/user-account
 * (lihat src/hooks/use-user-accounts.ts).
 */
export default function DataPenggunaPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-title">Data Pengguna</h1>
      <p className="mt-2 text-ink-soft">
        Data tabel <code>user_account</code> dari Supabase. Klik Edit untuk mengubah data.
      </p>
      <UserTable />
    </section>
  );
}
