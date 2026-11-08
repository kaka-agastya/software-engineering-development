import bcrypt from "bcryptjs";
import { parseBody } from "@/lib/api";
import { db } from "@/lib/db";
import { newOtp, sendOtpSms } from "@/lib/otp";
import { registerSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/register
 * Langkah 1 "Melakukan Registrasi Akun": validasi isian, cek nomor belum terdaftar,
 * lalu kirim OTP. Akun BELUM dibuat; isian disimpan di otp.pending_data sampai OTP benar.
 *
 * Respons:
 *   200 { otp_id, demo_code }
 *   400 { fieldErrors }
 *   409 { fieldErrors: { phone_number } }  ← nomor sudah terdaftar
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, registerSchema);
  if (parsed instanceof Response) return parsed;
  const { full_name, nickname, phone_number, password } = parsed.data;

  const { data: existing, error: lookupError } = await db()
    .from("user_account")
    .select("id")
    .eq("phone_number", phone_number)
    .maybeSingle();
  if (lookupError) return Response.json({ error: lookupError.message }, { status: 500 });
  if (existing) {
    return Response.json({ fieldErrors: { phone_number: ["Nomor ponsel ini sudah terdaftar."] } }, { status: 409 });
  }

  const otp = newOtp();
  const { data, error } = await db()
    .from("otp")
    .insert({
      phone_number,
      ...otp,
      // Kata sandi langsung di-hash; bcrypt kompatibel dengan crypt() di seed.sql
      pending_data: { full_name, nickname, phone_number, password_hash: await bcrypt.hash(password, 10) },
    })
    .select("id")
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  await sendOtpSms(phone_number, otp.otp_code);
  // ponytail: demo_code dikirim ke browser karena SMS masih simulasi. Hapus saat SMS gateway terpasang.
  return Response.json({ otp_id: data.id, demo_code: otp.otp_code });
}
