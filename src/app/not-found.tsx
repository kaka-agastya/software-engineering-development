import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-night">
      <div className="mx-auto max-w-6xl px-5 py-32">
        <h1 className="text-display text-paper md:text-display-lg">Halaman ini tidak ada</h1>
        <p className="mt-5 text-lead text-paper/85">Alamatnya mungkin salah ketik atau halamannya sudah pindah.</p>
        <Link
          href="/"
          className="mt-9 inline-block rounded-full bg-caution-500 px-6 py-3 text-button text-night hover:bg-caution-100"
        >
          Kembali ke beranda
        </Link>
      </div>
    </section>
  );
}
