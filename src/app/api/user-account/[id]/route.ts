import { z } from "zod";
import { db } from "@/lib/db";
import { userAccountUpdateSchema } from "@/lib/validations/user-account";

/**
 * PATCH /api/user-account/:id
 * MENGUBAH satu baris user_account.
 * Body (JSON): { full_name, nickname, phone_number, account_status, risk_threshold }
 *
 * Respons:
 *   200 { success: true }
 *   400 { fieldErrors: { kolom: ["pesan"] } }  ← gagal validasi zod
 *   404 { error }                              ← id tidak ditemukan
 *   409 { fieldErrors: { phone_number } }      ← nomor sudah dipakai
 *   500 { error }
 */
export async function PATCH(request: Request, ctx: RouteContext<"/api/user-account/[id]">) {
  const { id } = await ctx.params;

  // 1. Baca body JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body harus berupa JSON." }, { status: 400 });
  }

  // 2. Validasi dengan zod
  const parsed = userAccountUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ fieldErrors: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  // 3. Simpan ke database
  const { data, error } = await db().from("user_account").update(parsed.data).eq("id", id).select("id");

  if (error) {
    // 23505 = melanggar UNIQUE, 22P02 = format id (uuid) salah
    if (error.code === "23505") {
      return Response.json({ fieldErrors: { phone_number: ["Nomor ini sudah dipakai akun lain."] } }, { status: 409 });
    }
    if (error.code === "22P02") {
      return Response.json({ error: "Data tidak ditemukan." }, { status: 404 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (data.length === 0) {
    return Response.json({ error: "Data tidak ditemukan." }, { status: 404 });
  }

  return Response.json({ success: true });
}
