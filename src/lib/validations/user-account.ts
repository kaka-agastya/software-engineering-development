import { z } from "zod";

/**
 * Aturan validasi saat mengedit UserAccount.
 * Dipakai di Route Handler PATCH (src/app/api/user-account/[id]/route.ts).
 */
export const userAccountUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi.").max(100, "Maksimal 100 karakter."),
  nickname: z.string().trim().min(1, "Nama panggilan wajib diisi.").max(50, "Maksimal 50 karakter."),
  // FR-02: nomor ponsel harus format E.164
  phone_number: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, "Harus format E.164, contoh: +6281234567890."),
  account_status: z.enum(["pending", "active"], "Pilih status akun."),
  // Isian form berupa teks, jadi diubah ke angka dulu (coerce)
  risk_threshold: z.coerce.number("Harus berupa angka.").min(0, "Minimal 0.").max(1, "Maksimal 1."),
});

/** Isian form edit (sebelum divalidasi). */
export type UserAccountUpdate = z.input<typeof userAccountUpdateSchema>;

/** Pesan error per kolom, mis. { phone_number: ["Harus format E.164..."] } */
export type UserAccountFieldErrors = Partial<Record<keyof UserAccountUpdate, string[]>>;

/** Satu baris user_account seperti yang dikirim API. */
export type UserAccount = z.output<typeof userAccountUpdateSchema> & {
  id: string;
  created_at: string;
};
