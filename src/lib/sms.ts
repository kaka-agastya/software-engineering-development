import "server-only";
import { db } from "@/lib/db";
import type { SmsStatus } from "@/lib/validations/emergency-contact";

/**
 * ponytail: SMS masih disimulasikan (hanya console.log) karena belum ada SMS gateway.
 * Saat gateway (mis. Twilio / Zenziva) dipasang, cukup ganti isi fungsi ini.
 * Kembalikan false kalau pengiriman gagal supaya alur kirim ulang tetap berjalan.
 */
export async function sendSms(phoneNumber: string, message: string): Promise<boolean> {
  console.info(`[SMS ke ${phoneNumber}] ${message}`);
  return true;
}

const MAX_ATTEMPTS = 2; // kirim pertama + satu kali kirim ulang

/**
 * Use case "Mengirim SMS Pemberitahuan ke Kontak Darurat".
 * Membuat baris notification, mengirim SMS, lalu mencatat status pengiriman.
 * Kalau gagal, dicoba ulang; kalau tetap gagal status menjadi "failed".
 */
export async function notifyEmergencyContact(params: {
  userId: string;
  userFullName: string;
  contact: { id: string; phone_number: string };
  type: "registrasi" | "pembaruan";
}): Promise<SmsStatus> {
  const { userId, userFullName, contact, type } = params;
  // Kalimat mengikuti contoh di supabase/seed.sql
  const message =
    type === "registrasi"
      ? `Nomor Anda didaftarkan oleh ${userFullName} sebagai kontak darurat di LIVIA.`
      : `Data kontak darurat Anda di akun ${userFullName} telah diperbarui.`;

  const { data: notification, error } = await db()
    .from("notification")
    .insert({ user_id: userId, emergency_contact_id: contact.id, type, message, status: "pending" })
    .select("id")
    .single();
  if (error) {
    console.error("Gagal mencatat notification:", error.message);
    return "failed";
  }

  let status: SmsStatus = "failed";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && status !== "sent"; attempt++) {
    if (await sendSms(contact.phone_number, message)) status = "sent";
  }

  await db().from("notification").update({ status }).eq("id", notification.id);
  return status;
}
