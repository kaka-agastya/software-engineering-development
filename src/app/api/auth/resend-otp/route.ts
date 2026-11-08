import { parseBody } from "@/lib/api";
import { db } from "@/lib/db";
import { newOtp, sendOtpSms } from "@/lib/otp";
import { resendOtpSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/resend-otp
 * Tombol "Kirim Ulang OTP": ganti kode & waktu kedaluwarsa untuk pendaftaran yang sama.
 *
 * Respons: 200 { demo_code } | 404 { error }
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, resendOtpSchema);
  if (parsed instanceof Response) return parsed;

  const { data: current, error: lookupError } = await db()
    .from("otp")
    .select("phone_number, pending_data")
    .eq("id", parsed.data.otp_id)
    .eq("verified", false)
    .is("user_id", null)
    .maybeSingle();
  if (lookupError) return Response.json({ error: lookupError.message }, { status: 500 });
  if (!current) {
    return Response.json({ error: "Pendaftaran tidak ditemukan. Ulangi dari awal." }, { status: 404 });
  }

  // Kode baru = jatah tebakan baru
  const otp = newOtp();
  const { error } = await db()
    .from("otp")
    .update({ ...otp, pending_data: { ...current.pending_data, attempts: 0 } })
    .eq("id", parsed.data.otp_id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  await sendOtpSms(current.phone_number, otp.otp_code);
  // ponytail: demo_code dikirim ke browser karena SMS masih simulasi. Hapus saat SMS gateway terpasang.
  return Response.json({ demo_code: otp.otp_code });
}
