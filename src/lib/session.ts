import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sesi login sederhana: cookie httpOnly berisi id pengguna yang ditandatangani (HMAC).
 * Browser tidak bisa membaca atau memalsukan isinya.
 *
 * ponytail: kunci tanda tangan memakai SUPABASE_SECRET_KEY (sudah rahasia & hanya di server).
 * Kalau nanti ada SESSION_SECRET sendiri, isi di .env.local dan otomatis dipakai.
 */
const COOKIE = "livia_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function secret() {
  const key = process.env.SESSION_SECRET ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY belum diisi di .env.local.");
  return key;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Simpan sesi untuk userId (dipanggil di Route Handler setelah login / registrasi). */
export async function startSession(userId: string) {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${userId}.${expires}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** id pengguna yang sedang login, atau null kalau belum login / cookie tidak sah. */
export async function getSessionUserId(): Promise<string | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;

  const [userId, expires, signature] = value.split(".");
  if (!userId || !expires || !signature) return null;

  const expected = Buffer.from(sign(`${userId}.${expires}`));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  if (Number(expires) < Date.now() / 1000) return null;

  return userId;
}
