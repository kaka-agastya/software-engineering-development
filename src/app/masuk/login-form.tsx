"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormField, fieldAria } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendJson } from "@/lib/send-json";
import type { FieldErrors, LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Sudah login? Langsung ke halaman akun.
  useEffect(() => {
    sendJson("/api/me", "GET").then((res) => {
      if (res.ok) router.replace("/akun");
    });
  }, [router]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget)) as unknown as LoginInput;
    setBusy(true);
    const res = await sendJson("/api/auth/login", "POST", values);
    setBusy(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setMessage(res.error ?? null);
      return;
    }
    router.push("/akun");
  }

  return (
    <div className="rounded-3xl bg-paper-deep p-7 md:p-9">
      <h1 className="text-heading">Masuk</h1>
      <p className="mt-2 text-ink-soft">Masuk ke akun LIVIA yang sudah terdaftar.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
            className="bg-white"
            {...fieldAria("phone_number", errors.phone_number?.[0], true)}
          />
        </FormField>
        <FormField id="password" label="Kata Sandi" error={errors.password?.[0]}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="bg-white"
            {...fieldAria("password", errors.password?.[0])}
          />
        </FormField>

        {message && (
          <p role="alert" className="rounded-lg bg-alert-soft px-3 py-2 text-small text-alert-ink">
            {message}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Memeriksa..." : "Masuk"}
        </Button>
      </form>

      <p className="mt-5 text-center text-small text-ink-soft">
        Belum memiliki akun?{" "}
        <Link href="/daftar" className="font-semibold text-ink underline underline-offset-4">
          Daftar
        </Link>
      </p>
    </div>
  );
}
