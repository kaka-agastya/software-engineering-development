import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Koneksi ke Supabase, HANYA untuk dipakai di server
 * (Server Component dan Server Action).
 *
 * Memakai secret key yang punya akses penuh ke database, jadi:
 * - nilainya disimpan di .env.local (tidak ikut ter-commit)
 * - `import "server-only"` membuat build error kalau file ini
 *   tidak sengaja dipakai di komponen "use client".
 */
export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi di .env.local. " +
        "Lihat supabase/README.md, lalu restart `bun dev`.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
