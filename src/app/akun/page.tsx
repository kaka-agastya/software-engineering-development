import type { Metadata } from "next";
import { AccountView } from "./account-view";

export const metadata: Metadata = {
  title: "Akun",
  description: "Profil akun LIVIA dan daftar kontak daruratmu.",
};

/**
 * Halaman Profil - Kontak Darurat (storyboard 4.2).
 * Data diambil di browser lewat GET /api/me dan GET /api/emergency-contact.
 */
export default function AkunPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <AccountView />
    </section>
  );
}
