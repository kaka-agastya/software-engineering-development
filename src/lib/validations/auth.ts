import { z } from "zod";

/**
 * FR-02: nomor ponsel harus format E.164.
 * Spasi dan tanda hubung dibuang dulu, jadi "+62 812-3456-7890" tetap diterima.
 */
export const phoneNumberSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^\+[1-9]\d{7,14}$/, "Harus format E.164, contoh: +6281234567890."));

/** Halaman Registrasi Akun (use case "Melakukan Registrasi Akun"). */
export const registerSchema = z
  .object({
    full_name: z.string().trim().min(1, "Nama lengkap wajib diisi.").max(100, "Maksimal 100 karakter."),
    nickname: z.string().trim().min(1, "Nama panggilan wajib diisi.").max(50, "Maksimal 50 karakter."),
    phone_number: phoneNumberSchema,
    password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(72, "Maksimal 72 karakter."),
    confirm_password: z.string(),
  })
  .refine((v) => v.password === v.confirm_password, {
    path: ["confirm_password"],
    message: "Konfirmasi kata sandi tidak sama.",
  });

/** Halaman Konfirmasi Pendaftaran (OTP). */
export const verifyOtpSchema = z.object({
  otp_id: z.uuid("Sesi OTP tidak valid. Ulangi pendaftaran."),
  otp_code: z.string().trim().regex(/^\d{6}$/, "Kode OTP terdiri dari 6 angka."),
});

export const resendOtpSchema = verifyOtpSchema.pick({ otp_id: true });

/** Halaman Masuk (use case "Masuk ke Akun"). */
export const loginSchema = z.object({
  phone_number: phoneNumberSchema,
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export type RegisterInput = z.input<typeof registerSchema>;
export type LoginInput = z.input<typeof loginSchema>;

/** Pesan error per kolom dari API, mis. { phone_number: ["..."] } */
export type FieldErrors = Partial<Record<string, string[]>>;

/** Data akun yang boleh dikirim ke browser (tanpa password_hash). */
export type CurrentUser = {
  id: string;
  full_name: string;
  nickname: string;
  phone_number: string;
  account_status: "pending" | "active";
};
