import { connection } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/user-account
 * MENGAMBIL semua data user_account dan mengembalikannya sebagai JSON.
 * Coba buka langsung: http://localhost:3000/api/user-account
 */
export async function GET() {
  // Selalu ambil data terbaru (jangan dijalankan sekali saat build)
  await connection();

  const { data, error } = await db()
    .from("user_account")
    .select("id, full_name, nickname, phone_number, account_status, risk_threshold, created_at")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true }); // urutan cadangan supaya posisi baris tidak berpindah-pindah

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ data });
}
