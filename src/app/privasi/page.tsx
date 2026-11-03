import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { TEAM_EMAIL, crisisContacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privasi & bantuan",
  description:
    "Data apa yang disimpan LIVIA, bagaimana dilindungi, hakmu atas data, dan layanan bantuan krisis.",
};

const dataRows = [
  {
    what: "Profil akun",
    detail: "Nama, nama panggilan, nomor ponsel, kata sandi",
    why: "Masuk ke akun dan verifikasi nomor",
  },
  {
    what: "Kontak darurat",
    detail: "Nama, nomor ponsel, hubungan",
    why: "Menghubungi orang terdekatmu saat darurat",
  },
  {
    what: "Percakapan",
    detail: "Pesanmu dan balasan LIVIA",
    why: "Melanjutkan percakapan dan fitur pencarian",
  },
  {
    what: "Catatan emosi",
    detail: "Suasana hati, skor risiko, waktu",
    why: "Grafik tren dan deteksi tanda krisis",
  },
  {
    what: "Check-in",
    detail: "Jadwal, jawaban, waktu respons",
    why: "Menyapa sesuai jadwal pilihanmu",
  },
  {
    what: "Log insiden",
    detail: "Tahapan prosedur darurat dan lokasi",
    why: "Memastikan bantuan berjalan dan bisa ditelusuri",
  },
];

const deleteSteps = [
  "Buka Halaman Profil.",
  "Pilih Hapus Akun.",
  "Baca peringatannya, lalu pilih Ya, hapus akun.",
];

export default function PrivasiPage() {
  return (
    <>
      <PageIntro
        title="Ceritamu milikmu."
        lead="Kami tahu yang kamu bagikan di LIVIA sangat pribadi. Berikut penjelasan jujur tentang data yang disimpan, bagaimana kami melindunginya, dan kendali yang kamu punya."
      />

      <section className="mx-auto max-w-6xl px-5">
        <h2 className="text-heading md:text-title">Data yang disimpan</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Seluruh data di bawah ini disimpan dalam bentuk terenkripsi.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-paper-deep text-small text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Data
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Isinya
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Untuk apa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {dataRows.map((r) => (
                <tr key={r.what}>
                  <th scope="row" className="px-5 py-4 font-semibold">
                    {r.what}
                  </th>
                  <td className="px-5 py-4 text-ink-soft">{r.detail}</td>
                  <td className="px-5 py-4 text-ink-soft">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        <div className="rounded-3xl bg-paper-deep p-8">
          <h2 className="text-heading">Kapan datamu dibagikan</h2>
          <p className="mt-4 text-ink-soft">
            Hanya dalam satu keadaan: saat prosedur darurat berjalan. Kontak
            daruratmu menerima pemberitahuan dan tautan lokasimu. Isi percakapan
            dan catatan emosimu tidak pernah dikirimkan kepada mereka.
          </p>
        </div>
        <div className="rounded-3xl border border-caution-700 bg-caution-50 p-8">
          <h2 className="text-heading">Batasan LIVIA</h2>
          <p className="mt-4 text-ink-soft">
            LIVIA adalah pendamping berbasis AI. Ia tidak memberikan diagnosis
            klinis dan tidak menggantikan psikolog, psikiater, maupun layanan
            medis. AI juga bisa keliru membaca situasi, jadi tombol darurat
            selalu tersedia untuk kamu tekan sendiri.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <h2 className="text-heading md:text-title">
          Menghapus akun dan seluruh data
        </h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Kamu bisa menghapus akun kapan saja. Profil, kontak darurat,
          percakapan, catatan emosi, jadwal check-in, dan riwayat darurat akan
          dihapus permanen dan tidak bisa dipulihkan.
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {deleteSteps.map((s, i) => (
            <li
              key={s}
              className="flex gap-4 rounded-2xl border border-line p-5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-form-label font-bold text-paper">
                {i + 1}
              </span>
              <span className="">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="bantuan" className="mt-24 scroll-mt-24 bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-heading text-paper md:text-title">
            Bantuan di luar LIVIA
          </h2>
          <p className="mt-4 max-w-2xl text-paper/80">
            Jika kamu atau orang di sekitarmu sedang dalam bahaya, jangan
            menunggu. Hubungi layanan berikut.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {crisisContacts.map((c) => (
              <li key={c.number} className="rounded-3xl bg-paper/10 p-7">
                <p className="text-paper/75">{c.name}</p>
                <a
                  href={`tel:${c.tel}`}
                  className="mt-2 block text-display underline-offset-4 hover:underline"
                >
                  {c.number}
                </a>
                <p className="mt-3 text-small text-paper/75">{c.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-small text-paper/60">
            Kamu juga bisa datang ke puskesmas, rumah sakit, atau unit gawat
            darurat terdekat.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-5">
        <h2 className="text-heading">Pertanyaan tentang privasi</h2>
        <p className="mt-4 text-ink-soft">
          Hubungi tim pengembang LIVIA di{" "}
          <a
            href={`mailto:${TEAM_EMAIL}`}
            className="font-semibold text-ink underline underline-offset-4"
          >
            {TEAM_EMAIL}
          </a>
          . Email ini bukan layanan darurat dan mungkin tidak dibalas
          secepatnya.
        </p>
      </section>
    </>
  );
}
