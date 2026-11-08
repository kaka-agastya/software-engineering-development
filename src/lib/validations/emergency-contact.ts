import { z } from "zod";
import { phoneNumberSchema } from "./auth";

/**
 * Aturan validasi tambah/ubah EmergencyContact.
 * Dipakai di src/app/api/emergency-contact/route.ts (POST) dan [id]/route.ts (PATCH).
 */
export const emergencyContactSchema = z.object({
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi.").max(100, "Maksimal 100 karakter."),
  phone_number: phoneNumberSchema,
  relationship: z.string().trim().min(1, "Pilih hubungan dengan kontak.").max(50, "Maksimal 50 karakter."),
});

export type EmergencyContactInput = z.input<typeof emergencyContactSchema>;

export type SmsStatus = "pending" | "sent" | "failed";

/** Satu baris emergency_contact seperti yang dikirim API, plus status SMS terakhir. */
export type EmergencyContact = z.output<typeof emergencyContactSchema> & {
  id: string;
  created_at: string;
  last_sms_status: SmsStatus | null;
};

/** Pilihan hubungan, sama dengan nilai di supabase/seed.sql. */
export const relationshipOptions = ["Orang tua", "Saudara kandung", "Pasangan", "Teman", "Lainnya"];
