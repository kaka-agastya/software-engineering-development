import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun LIVIA dengan nomor ponsel dan kata sandi.",
};

/** Halaman Masuk (storyboard 4.1, frame 4). */
export default function MasukPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <LoginForm />
    </section>
  );
}
