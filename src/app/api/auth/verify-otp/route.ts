import { parseBody } from "@/lib/api";
import { db } from "@/lib/db";
import { startSession } from "@/lib/session";
import { verifyOtpSchema } from "@/lib/validations/auth";

type PendingData = {
  full_name: string;
  nickname: string;
  phone_number: string;
  password_hash: string;
  attempts?: number;
};

// Batas tebakan per kode supaya OTP 6 angka tidak bisa ditebak beruntun
const MAX_OTP_ATTEMPTS = 5;

/**
 * POST /api/auth/verify-otp
 * Langkah 2 "Melakukan Registrasi Akun": cocokkan OTP, buat user_account (status "pending"
 * sampai kontak darurat pertama tersimpan), lalu langsung masuk.
 *
 * Respons:
 *   200 { success: true }
 *   400 { fieldErrors: { otp_code } }  ← kode salah / kedaluwarsa
 *   409 { error }                      ← nomor keburu dipakai akun lain
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, verifyOtpSchema);
  if (parsed instanceof Response) return parsed;
  const { otp_id, otp_code } = parsed.data;

  const { data: otp, error } = await db()
    .from("otp")
    .select("id, otp_code, expires_at, pending_data, verified")
    .eq("id", otp_id)
    .is("user_id", null)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const wrongCode = () =>
    Response.json(
      { fieldErrors: { otp_code: ["Kode OTP salah atau kedaluwarsa. Minta kode baru bila perlu."] } },
      { status: 400 },
    );

  if (!otp || otp.verified || new Date(otp.expires_at) < new Date()) return wrongCode();

  const { attempts = 0, ...pending } = otp.pending_data as PendingData;
  if (attempts >= MAX_OTP_ATTEMPTS) return wrongCode();
  if (otp.otp_code !== otp_code) {
    await db()
      .from("otp")
      .update({ pending_data: { ...pending, attempts: attempts + 1 } })
      .eq("id", otp.id);
    return wrongCode();
  }

  const { data: user, error: insertError } = await db()
    .from("user_account")
    .insert({ ...pending, account_status: "pending" })
    .select("id")
    .single();
  if (insertError) {
    if (insertError.code === "23505") {
      return Response.json({ error: "Nomor ponsel ini sudah terdaftar. Silakan masuk." }, { status: 409 });
    }
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  // Tandai OTP terpakai & buang hash kata sandi dari pending_data
  await db().from("otp").update({ verified: true, user_id: user.id, pending_data: {} }).eq("id", otp.id);
  await startSession(user.id);
  return Response.json({ success: true });
}
