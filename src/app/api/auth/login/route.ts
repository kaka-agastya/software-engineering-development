import bcrypt from "bcryptjs";
import { parseBody } from "@/lib/api";
import { db } from "@/lib/db";
import { startSession } from "@/lib/session";
import { loginSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/login
 * Use case "Masuk ke Akun": cocokkan nomor ponsel & kata sandi dengan user_account.
 *
 * Respons:
 *   200 { account_status }
 *   400 { fieldErrors }
 *   401 { error }  ← nomor atau kata sandi salah (sengaja tidak dibedakan)
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, loginSchema);
  if (parsed instanceof Response) return parsed;
  const { phone_number, password } = parsed.data;

  const { data: user, error } = await db()
    .from("user_account")
    .select("id, password_hash, account_status")
    .eq("phone_number", phone_number)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return Response.json({ error: "Nomor ponsel atau kata sandi salah." }, { status: 401 });
  }

  await startSession(user.id);
  return Response.json({ account_status: user.account_status });
}
