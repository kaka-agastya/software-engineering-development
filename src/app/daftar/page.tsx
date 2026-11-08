import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun LIVIA dengan nomor ponselmu, lalu tambahkan kontak darurat.",
};

/** Halaman Registrasi Akun + Konfirmasi Pendaftaran (storyboard 4.1, frame 2 dan 3). */
export default function DaftarPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <RegisterForm />
    </section>
  );
}
