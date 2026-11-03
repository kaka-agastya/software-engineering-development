import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { TEAM_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Untuk kontak darurat",
  description:
    "Panduan bagi orang yang didaftarkan sebagai kontak darurat di LIVIA: arti SMS yang diterima dan apa yang perlu dilakukan.",
};

const emergencySteps = [
  {
    title: "Hubungi orang tersebut sekarang",
    body: "Telepon langsung. Jika tidak diangkat, coba lagi dan kirim pesan singkat bahwa kamu sedang menuju atau mencari bantuan.",
  },
  {
    title: "Buka tautan lokasi",
    body: "Tautan di SMS menunjukkan lokasi terakhirnya. Datangi jika memungkinkan, atau minta orang yang lebih dekat untuk datang.",
  },
  {
    title: "Konfirmasi bahwa kamu merespons",
    body: "Ikuti petunjuk konfirmasi di SMS agar LIVIA tahu bantuan sedang berjalan. LIVIA menunggu konfirmasi selama satu menit.",
  },
  {
    title: "Hubungi 112 jika ada bahaya langsung",
    body: "Jika ia tidak bisa dihubungi dan kamu khawatir nyawanya terancam, hubungi layanan darurat 112 dan sebutkan lokasinya.",
  },
];

const doList = [
  "Tanyakan langsung apakah ia sedang berpikir untuk menyakiti diri. Bertanya tidak akan memicu tindakan itu.",
  "Dengarkan lebih banyak daripada bicara.",
  "Temani, atau pastikan ada orang lain yang menemani.",
  "Jauhkan benda yang bisa membahayakan bila memungkinkan.",
  "Bantu ia terhubung ke psikolog, psikiater, atau layanan kesehatan.",
];

const dontList = [
  "Menghakimi, menceramahi, atau menyepelekan perasaannya.",
  "Berjanji merahasiakan bila keselamatannya terancam.",
  "Meninggalkannya sendirian saat kondisi masih genting.",
];

export default function KontakDaruratPage() {
  return (
    <>
      <PageIntro
        title="Seseorang memercayaimu sebagai kontak darurat."
        lead="Halaman ini untuk kamu yang menerima SMS dari LIVIA. Kamu tidak perlu memasang aplikasi apa pun. Cukup pahami arti pesannya dan apa yang bisa kamu lakukan."
      />

      <section className="mx-auto max-w-6xl px-5">
        <h2 className="text-heading md:text-title">Dua jenis SMS yang mungkin kamu terima</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-paper-deep p-7">
            <h3 className="text-card-title">Pemberitahuan pendaftaran</h3>
            <p className="mt-2 text-ink-soft">
              Dikirim saat nomormu didaftarkan atau datamu diperbarui. Tidak ada tindakan yang
              diperlukan.
            </p>
            <blockquote className="mt-5 rounded-2xl rounded-tl-md bg-white px-4 py-3 text-small shadow-sm">
              Livia: Rani telah mendaftarkan nomor Anda sebagai kontak daruratnya. Anda akan menerima
              pemberitahuan terkait kondisi darurat Rani.
            </blockquote>
          </article>

          <article className="rounded-3xl bg-alert-soft p-7">
            <h3 className="text-card-title text-alert-ink">Notifikasi darurat</h3>
            <p className="mt-2 text-ink-soft">
              Dikirim saat orang yang mendaftarkanmu menekan tombol darurat atau LIVIA mendeteksi
              risiko tinggi. Segera bertindak.
            </p>
            <blockquote className="mt-5 rounded-2xl rounded-tl-md bg-white px-4 py-3 text-small shadow-sm">
              Livia: Rani mungkin sedang membutuhkan bantuan. Lokasi terakhirnya:
              livia.app/l/8f2k. Mohon segera hubungi Rani dan konfirmasi lewat tautan tersebut.
            </blockquote>
          </article>
        </div>
      </section>

      <section id="saat-darurat" className="mx-auto mt-24 max-w-6xl scroll-mt-24 px-5">
        <h2 className="text-heading md:text-title">Jika kamu menerima notifikasi darurat</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-2">
          {emergencySteps.map((s, i) => (
            <li key={s.title} className="flex gap-5 border-t-2 border-alert pt-5">
              <span className="text-title tabular-nums text-alert">{i + 1}</span>
              <div>
                <h3 className="text-card-title">{s.title}</h3>
                <p className="mt-1.5 text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-heading md:text-title">Cara mendampingi dengan aman</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-calm p-7">
            <h3 className="text-card-title text-calm-ink">Yang membantu</h3>
            <ul className="mt-4 space-y-3">
              {doList.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-calm-ink" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line p-7">
            <h3 className="text-card-title">Yang sebaiknya dihindari</h3>
            <ul className="mt-4 space-y-3">
              {dontList.map((d) => (
                <li key={d} className="flex gap-3 text-ink-soft">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-3xl px-5">
        <h2 className="text-heading">Tidak ingin lagi menjadi kontak darurat?</h2>
        <p className="mt-4 text-ink-soft">
          Bicarakan dengan orang yang mendaftarkanmu agar ia bisa mengganti kontaknya di aplikasi.
          Jika tidak memungkinkan, kirim email ke{" "}
          <a href={`mailto:${TEAM_EMAIL}`} className="font-semibold text-ink underline underline-offset-4">
            {TEAM_EMAIL}
          </a>{" "}
          dengan menyertakan nomor ponselmu.
        </p>
      </section>
    </>
  );
}
