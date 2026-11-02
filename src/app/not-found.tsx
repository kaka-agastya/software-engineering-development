import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-32 text-center">
      <h1 className="text-display">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-ink-soft">Alamat yang kamu buka tidak ada atau sudah dipindahkan.</p>
      <Link href="/" className="mt-8 inline-block rounded-xl bg-ink px-6 py-3 text-button text-paper">
        Kembali ke beranda
      </Link>
    </section>
  );
}
