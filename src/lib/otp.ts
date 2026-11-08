import "server-only";
import { randomInt } from "node:crypto";
import { sendSms } from "@/lib/sms";

export const OTP_TTL_MINUTES = 5;

/** Kode OTP 6 angka baru beserta waktu kedaluwarsanya. */
export function newOtp() {
  return {
    otp_code: String(randomInt(0, 1_000_000)).padStart(6, "0"),
    expires_at: new Date(Date.now() + OTP_TTL_MINUTES * 60_000).toISOString(),
  };
}

export async function sendOtpSms(phoneNumber: string, code: string) {
  await sendSms(phoneNumber, `Kode OTP LIVIA kamu: ${code}. Berlaku ${OTP_TTL_MINUTES} menit.`);
}
