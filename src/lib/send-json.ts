import type { FieldErrors } from "@/lib/validations/auth";

export type ApiResult<T> =
  | ({ ok: true } & T)
  | { ok: false; status: number; error?: string; fieldErrors?: FieldErrors };

/**
 * fetch JSON ke API kita dari browser, dengan pesan error yang seragam.
 *
 *   const res = await sendJson<{ otp_id: string }>("/api/auth/register", "POST", values);
 *   if (!res.ok) tampilkan res.fieldErrors / res.error
 */
export async function sendJson<T = object>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = await res.json();
    return res.ok ? { ok: true, ...json } : { ok: false, status: res.status, ...json };
  } catch {
    return { ok: false, status: 0, error: "Tidak dapat terhubung ke server." };
  }
}
