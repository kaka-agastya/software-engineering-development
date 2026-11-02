import type { Metadata } from "next";
import { TEAM_EMAIL } from "@/lib/site";
import { PageIntro } from "../_components/PageIntro";

export const metadata: Metadata = {
  title: "Untuk kontak darurat",
  description:
    "Untuk kamu yang didaftarkan sebagai kontak darurat di LIVIA: arti SMS yang masuk dan langkah yang perlu diambil.",
};

const emergencySteps = [
  {
    title: "Telepon dia sekarang juga",
    body: "Kalau tidak diangkat, coba lagi. Kirim juga pesan singkat bahwa kamu sedang menuju ke sana atau sedang mencari bantuan.",
  },
  {
    title: "Buka tautan lokasinya",
    body: "Tautan di SMS menunjukkan posisi terakhirnya. Datanglah kalau bisa, atau minta orang yang lebih dekat untuk ke sana.",
  },
  {
    title: "Beri konfirmasi bahwa kamu menanggapi",
    body: "Ikuti petunjuk konfirmasi di SMS supaya LIVIA tahu bantuan sedang berjalan. LIVIA menunggu konfirmasi ini selama satu menit.",
  },
  {
    title: "Telepon 112 kalau ada bahaya langsung",
    body: "Bila dia tidak bisa dihubungi dan kamu khawatir nyawanya terancam, telepon layanan darurat 112 lalu sebutkan lokasinya.",
  },
];

const doList = [
  "Tanyakan terus terang apakah dia sedang berpikir untuk menyakiti diri. Menanyakannya tidak akan mendorong dia melakukannya.",
  "Lebih banyak mendengarkan daripada berbicara.",
  "Tetap bersamanya, atau pastikan ada orang lain yang menemani.",
  "Bila memungkinkan, singkirkan benda yang bisa membahayakan.",
  "Bantu dia tersambung ke psikolog, psikiater, atau layanan kesehatan.",
];

const dontList = [
  "Menghakimi, menasihati panjang lebar, atau meremehkan perasaannya.",
  "Berjanji menyimpan rahasia ketika keselamatannya terancam.",
  "Membiarkannya sendiri selagi keadaan masih genting.",
];

export default function KontakDaruratPage() {
  return (
    <>
      <PageIntro
        title="Seseorang memilihmu sebagai kontak daruratnya."
        lead="Halaman ini ditujukan bagi kamu yang mendapat SMS dari LIVIA. Tidak ada aplikasi yang perlu dipasang. Kamu hanya perlu tahu arti pesannya dan apa yang bisa kamu lakukan."
      />

      {/* Langkah darurat ditaruh paling atas: orang yang baru menerima SMS darurat mencari ini lebih dulu */}
      <section id="saat-darurat" className="scroll-mt-20 bg-alert-soft">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-heading text-alert-ink md:text-title">Baru menerima notifikasi darurat?</h2>
          <ol className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
            {emergencySteps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span aria-hidden className="w-7 shrink-0 text-display leading-none text-alert">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-card-title text-alert-ink">{s.title}</h3>
                  <p className="mt-1.5 text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {/*
            TODO (catatan desain): FR-17 & FR-18 menyebut LIVIA menunggu konfirmasi kontak,
            tetapi mekanisme konfirmasinya belum didefinisikan di use-case specification.
            Jika memakai tautan, halaman konfirmasi bisa dibuat di app/k/[token]/page.tsx.
          */}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <h2 className="text-heading md:text-title">Dua macam SMS yang bisa masuk</h2>
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <article>
            <h3 className="text-card-title">Pemberitahuan pendaftaran</h3>
            <p className="mt-2 text-ink-soft">
              Masuk ketika nomormu didaftarkan atau datamu diperbarui. Kamu tidak perlu melakukan apa
              pun.
            </p>
            <blockquote className="mt-5 rounded-2xl rounded-tl-md bg-paper-deep px-4 py-3 text-small">
              Livia: Rani telah mendaftarkan nomor Anda sebagai kontak daruratnya. Anda akan menerima
              pemberitahuan terkait kondisi darurat Rani.
            </blockquote>
          </article>

          <article>
            <h3 className="text-card-title text-alert-ink">Notifikasi darurat</h3>
            <p className="mt-2 text-ink-soft">
              Masuk ketika orang yang mendaftarkanmu menekan tombol darurat, atau ketika LIVIA menangkap
              risiko tinggi. Langsung bertindak.
            </p>
            <blockquote className="mt-5 rounded-2xl rounded-tl-md bg-alert-soft px-4 py-3 text-small">
              Livia: Rani mungkin sedang membutuhkan bantuan. Lokasi terakhirnya: livia.app/l/8f2k. Mohon
              segera hubungi Rani dan konfirmasi lewat tautan tersebut.
            </blockquote>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <h2 className="text-heading md:text-title">Mendampingi dengan aman</h2>
        <div className="mt-8 grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h3 className="text-card-title">Yang bisa membantu</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-main-500">
              {doList.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-card-title">Yang perlu dihindari</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-ink-soft marker:text-muted">
              {dontList.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-heading">Ingin berhenti menjadi kontak darurat?</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Sampaikan pada orang yang mendaftarkanmu, supaya dia bisa mengganti kontaknya di aplikasi.
          Kalau itu tidak memungkinkan, kirim email berisi nomor ponselmu ke{" "}
          <a href={`mailto:${TEAM_EMAIL}`} className="font-semibold text-ink underline underline-offset-4">
            {TEAM_EMAIL}
          </a>
          .
        </p>
      </section>
    </>
  );
}
