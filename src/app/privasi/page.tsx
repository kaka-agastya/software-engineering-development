import type { Metadata } from "next";
import { TEAM_EMAIL, crisisContacts } from "@/lib/site";
import { PageIntro } from "../_components/PageIntro";

export const metadata: Metadata = {
  title: "Privasi & bantuan",
  description: "Data yang disimpan LIVIA, cara melindunginya, hakmu atas data itu, dan layanan bantuan krisis.",
};

const dataRows = [
  { what: "Profil akun", detail: "Nama, nama panggilan, nomor ponsel, kata sandi", why: "Masuk ke akun dan memverifikasi nomor" },
  { what: "Kontak darurat", detail: "Nama, nomor ponsel, hubungan", why: "Mengabari orang terdekatmu saat darurat" },
  { what: "Percakapan", detail: "Pesanmu dan balasan LIVIA", why: "Menyambung percakapan dan mendukung pencarian" },
  { what: "Catatan emosi", detail: "Suasana hati, skor risiko, waktu", why: "Grafik tren dan pendeteksian tanda krisis" },
  { what: "Check-in", detail: "Jadwal, jawaban, waktu respons", why: "Menyapamu pada jadwal yang kamu pilih" },
  { what: "Log insiden", detail: "Tahapan prosedur darurat dan lokasi", why: "Memastikan bantuan berjalan dan dapat ditelusuri" },
];

const deleteSteps = [
  "Masuk ke Halaman Profil di aplikasi.",
  "Ketuk Hapus Akun.",
  "Baca peringatan yang muncul, lalu ketuk Ya, hapus akun.",
];

export default function PrivasiPage() {
  return (
    <>
      <PageIntro
        title="Ceritamu tetap milikmu."
        lead="Yang kamu bagikan di LIVIA sangat pribadi, dan kami menyadari itu. Di bawah ini kami jelaskan apa adanya: data apa yang disimpan, cara melindunginya, dan kendali apa yang ada di tanganmu."
      />

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <h2 className="text-heading md:text-title">Data yang kami simpan</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">Semua data berikut tersimpan dalam keadaan terenkripsi.</p>
        <div className="mt-8 overflow-x-auto border-y border-line">
          <table className="w-full min-w-[640px] text-left">
            <thead className="text-small text-muted">
              <tr>
                <th scope="col" className="py-3 pr-5 font-semibold">Data</th>
                <th scope="col" className="py-3 pr-5 font-semibold">Isinya</th>
                <th scope="col" className="py-3 font-semibold">Dipakai untuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line border-t border-line">
              {dataRows.map((r) => (
                <tr key={r.what}>
                  <th scope="row" className="py-4 pr-5 font-semibold text-ink">{r.what}</th>
                  <td className="py-4 pr-5 text-ink-soft">{r.detail}</td>
                  <td className="py-4 text-ink-soft">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pt-20 md:grid-cols-2">
        <div>
          <h2 className="text-heading">Kapan datamu dibagikan</h2>
          <p className="mt-4 text-ink-soft">
            Satu-satunya keadaan adalah ketika prosedur darurat berjalan. Kontak daruratmu menerima
            pemberitahuan beserta tautan lokasimu. Isi percakapan dan catatan emosimu tidak pernah
            sampai ke mereka.
          </p>
        </div>
        <div className="border-l-4 border-caution-700 pl-6">
          <h2 className="text-heading">Batas kemampuan LIVIA</h2>
          <p className="mt-4 text-ink-soft">
            LIVIA adalah pendamping berbasis AI. Ia tidak mendiagnosis, dan tidak menggantikan
            psikolog, psikiater, atau layanan medis. AI juga bisa salah membaca keadaan, karena itu
            tombol darurat selalu ada untuk kamu tekan sendiri.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-heading md:text-title">Menghapus akun dan semua datanya</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Akunmu bisa dihapus kapan saja. Profil, kontak darurat, percakapan, catatan emosi, jadwal
          check-in, dan riwayat darurat akan terhapus permanen, dan tidak bisa dikembalikan.
        </p>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {deleteSteps.map((s, i) => (
            <li key={s} className="flex gap-4">
              <span aria-hidden className="w-7 shrink-0 text-display leading-none text-main-500">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="bantuan" className="scroll-mt-20 bg-main-700">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-heading text-paper md:text-title">Bantuan selain LIVIA</h2>
          <p className="mt-4 max-w-2xl text-paper/85">
            Kalau kamu atau orang di sekitarmu dalam bahaya, jangan menunda. Telepon layanan di bawah
            ini.
          </p>
          <ul className="mt-10 grid gap-10 md:grid-cols-2">
            {crisisContacts.map((c) => (
              <li key={c.number}>
                <p className="text-paper/85">{c.name}</p>
                <a
                  href={`tel:${c.tel}`}
                  className="mt-2 block text-display font-bold tabular-nums text-caution-500 underline-offset-4 hover:underline md:text-display-lg"
                >
                  {c.number}
                </a>
                <p className="mt-3 text-small text-paper/85">{c.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-small text-paper/80">
            Puskesmas, rumah sakit, atau unit gawat darurat terdekat juga bisa langsung kamu datangi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-heading">Ada pertanyaan soal privasi?</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Tulis ke tim pengembang LIVIA di{" "}
          <a href={`mailto:${TEAM_EMAIL}`} className="font-semibold text-ink underline underline-offset-4">
            {TEAM_EMAIL}
          </a>
          . Alamat ini bukan layanan darurat, jadi balasannya mungkin tidak langsung datang.
        </p>
      </section>
    </>
  );
}
