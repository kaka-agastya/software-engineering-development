"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormField, fieldAria } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendJson } from "@/lib/send-json";
import type { FieldErrors, RegisterInput } from "@/lib/validations/auth";

const emptyForm: RegisterInput = {
  full_name: "",
  nickname: "",
  phone_number: "",
  password: "",
  confirm_password: "",
};

/** Dua langkah: isi data diri, lalu masukkan kode OTP. */
export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterInput>(emptyForm);
  const [otp, setOtp] = useState<{ id: string; demoCode: string } | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitForm(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formValues = Object.fromEntries(new FormData(event.currentTarget)) as unknown as RegisterInput;
    setValues(formValues);
    setBusy(true);
    const res = await sendJson<{ otp_id: string; demo_code: string }>("/api/auth/register", "POST", formValues);
    setBusy(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setMessage(res.error ?? null);
      return;
    }
    setErrors({});
    setMessage(null);
    setOtp({ id: res.otp_id, demoCode: res.demo_code });
  }

  async function submitOtp(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!otp) return;
    const otp_code = String(new FormData(event.currentTarget).get("otp_code") ?? "");
    setBusy(true);
    const res = await sendJson("/api/auth/verify-otp", "POST", { otp_id: otp.id, otp_code });
    setBusy(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setMessage(res.error ?? null);
      return;
    }
    router.push("/akun");
  }

  async function resendOtp() {
    if (!otp) return;
    setBusy(true);
    const res = await sendJson<{ demo_code: string }>("/api/auth/resend-otp", "POST", { otp_id: otp.id });
    setBusy(false);
    if (!res.ok) {
      setMessage(res.error ?? "Gagal mengirim ulang OTP.");
      return;
    }
    setErrors({});
    setOtp({ ...otp, demoCode: res.demo_code });
    setMessage("Kode OTP baru sudah dikirim.");
  }

  if (otp) {
    return (
      <div className="rounded-3xl bg-paper-deep p-7 md:p-9">
        <h1 className="text-heading">Konfirmasi Pendaftaran</h1>
        <p className="mt-2 text-ink-soft">
          Masukkan 6 angka kode OTP yang dikirim lewat SMS ke{" "}
          <span className="font-semibold text-ink">{values.phone_number}</span>.
        </p>
        {/* ponytail: hapus kotak ini saat SMS gateway terpasang */}
        <p className="mt-4 rounded-lg bg-caution-50 px-3 py-2 text-small text-main-700">
          Mode demo: SMS belum tersambung, jadi kodenya ditampilkan di sini:{" "}
          <span className="font-semibold tabular-nums">{otp.demoCode}</span>
        </p>

        <form onSubmit={submitOtp} className="mt-6 space-y-4" noValidate>
          <FormField id="otp_code" label="Kode OTP" error={errors.otp_code?.[0]}>
            <Input
              id="otp_code"
              name="otp_code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="h-11 bg-white text-heading tracking-[0.4em] tabular-nums"
              {...fieldAria("otp_code", errors.otp_code?.[0])}
            />
          </FormField>
          {message && (
            <p role="status" className="text-small text-ink-soft">
              {message}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Memeriksa..." : "Konfirmasi"}
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap justify-between gap-2 text-small">
          <button type="button" onClick={resendOtp} disabled={busy} className="font-semibold text-ink underline underline-offset-4">
            Kirim Ulang OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setOtp(null);
              setMessage(null);
              setErrors({});
            }}
            className="text-ink-soft underline underline-offset-4"
          >
            Ubah data pendaftaran
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-paper-deep p-7 md:p-9">
      <h1 className="text-heading">Pendaftaran Akun</h1>
      <p className="mt-2 text-ink-soft">Lengkapi data berikut untuk membuat akun LIVIA.</p>

      <form onSubmit={submitForm} className="mt-6 space-y-4" noValidate>
        <FormField id="full_name" label="Nama Lengkap" error={errors.full_name?.[0]}>
          <Input
            id="full_name"
            name="full_name"
            autoComplete="name"
            defaultValue={values.full_name}
            className="bg-white"
            {...fieldAria("full_name", errors.full_name?.[0])}
          />
        </FormField>
        <FormField id="nickname" label="Nama Panggilan" error={errors.nickname?.[0]}>
          <Input
            id="nickname"
            name="nickname"
            autoComplete="nickname"
            defaultValue={values.nickname}
            className="bg-white"
            {...fieldAria("nickname", errors.nickname?.[0])}
          />
        </FormField>
        <FormField
          id="phone_number"
          label="Nomor Telepon"
          hint="Dengan kode negara, contoh: +6281234567890"
          error={errors.phone_number?.[0]}
        >
          <Input
            id="phone_number"
            name="phone_number"
            type="tel"
            autoComplete="tel"
            defaultValue={values.phone_number}
            className="bg-white"
            {...fieldAria("phone_number", errors.phone_number?.[0], true)}
          />
        </FormField>
        <FormField id="password" label="Kata Sandi" hint="Minimal 8 karakter" error={errors.password?.[0]}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="bg-white"
            {...fieldAria("password", errors.password?.[0], true)}
          />
        </FormField>
        <FormField id="confirm_password" label="Konfirmasi Kata Sandi" error={errors.confirm_password?.[0]}>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            className="bg-white"
            {...fieldAria("confirm_password", errors.confirm_password?.[0])}
          />
        </FormField>

        {message && (
          <p role="alert" className="text-sm text-destructive">
            {message}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Mengirim kode..." : "Berikutnya"}
        </Button>
      </form>

      <p className="mt-5 text-center text-small text-ink-soft">
        Sudah memiliki akun?{" "}
        <Link href="/masuk" className="font-semibold text-ink underline underline-offset-4">
          Masuk
        </Link>
      </p>
    </div>
  );
}
