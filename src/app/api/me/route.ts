import { unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

/**
 * GET /api/me
 * Data akun yang sedang login (tanpa password_hash).
 * Respons: 200 { data: CurrentUser } | 401 { error }
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { data, error } = await db()
    .from("user_account")
    .select("id, full_name, nickname, phone_number, account_status")
    .eq("id", userId)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return unauthorized(); // akun sudah dihapus

  return Response.json({ data });
}
