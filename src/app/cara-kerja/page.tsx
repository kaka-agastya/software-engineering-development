import type { Metadata } from "next";
import { Faq, type FaqItem } from "@/components/Faq";
import { PageIntro } from "../_components/PageIntro";

export const metadata: Metadata = {
  title: "Cara kerja",
  description: "Cara mulai memakai LIVIA dan urutan kejadian ketika prosedur darurat berjalan.",
};

const onboarding = [
  {
    title: "Pasang dan buka aplikasinya",
    body: "Unduh LIVIA ke ponsel Android, lalu ketuk Daftar pada halaman selamat datang.",
  },
  {
    title: "Lengkapi data diri",
    body: "Isi nama lengkap, nama panggilan, kata sandi, dan nomor ponsel beserta kode negaranya (misalnya +62 812…).",
  },
  {
    title: "Verifikasi nomormu",
    body: "Ketik kode OTP dari SMS. Kalau kodenya salah atau sudah kedaluwarsa, kamu bisa meminta kode baru.",
  },
  {
    title: "Pilih kontak darurat",
    body: "Daftarkan paling tidak satu orang kepercayaanmu. Akun baru aktif sepenuhnya setelah ini, sebab orang inilah yang dihubungi saat kamu perlu ditolong.",
  },
  {
    title: "Mulai cerita",
    body: "Layar percakapan langsung terbuka. Tuliskan yang kamu rasakan, panjang atau pendek sama-sama boleh.",
  },
];

const emergencyFlow = [
  {
    title: "Prosedur dimulai",
    body: "Pemicunya bisa tombol darurat yang kamu tekan, atau risiko tinggi yang terbaca LIVIA dari pesan dan jawaban check-in.",
  },
  {
    title: "Hitung mundur 10 detik",
    body: "Jendela konfirmasi terbuka. Pilih Batalkan bila kamu aman, atau Lanjutkan bila perlu bantuan. Tanpa pilihan apa pun, prosedur tetap berjalan otomatis.",
  },
  {
    title: "SMS dan lokasi dikirim",
    body: "Seluruh kontak daruratmu mendapat SMS berisi tautan lokasi, dengan akurasi sampai 50 meter. Kamu juga diberi tahu bahwa pesannya sudah terkirim.",
  },
  {
    title: "Satu menit menunggu tanggapan",
    body: "LIVIA menanti konfirmasi dari kontak daruratmu.",
  },
  {
    title: "Insiden ditutup",
    body: "Setelah paling tidak satu kontak mengonfirmasi, insiden dinyatakan selesai. Semua tahapnya tersimpan di log terenkripsi.",
  },
];

const faq: FaqItem[] = [
  {
    q: "Apakah ceritaku akan dihakimi?",
    a: "Tidak. Balasan LIVIA dirancang agar selalu suportif dan tidak menghakimi, jadi kamu bisa cerita apa adanya.",
  },
  {
    q: "Bisakah peringatan darurat dibatalkan?",
    a: "Bisa. Tekan Batalkan dalam 10 detik, sebelum notifikasi terkirim ke kontak daruratmu.",
  },
  {
    q: "Kenapa kontak darurat wajib diisi?",
    a: "Ketika keadaan sedang paling berat, orang terdekat sering kali bisa menolong lebih cepat. Kalau kontaknya kosong, LIVIA tidak tahu harus menghubungi siapa.",
  },
  {
    q: "Bagaimana kalau check-in terlewat?",
    a: "Pengingat dikirim setelah 30 menit. Bila sampai akhir hari belum dijawab, check-in itu ditandai terlewat. Dua kali terlewat berturut-turut bisa membuat LIVIA lebih peka pada tanda risiko.",
  },
  {
    q: "Apakah LIVIA bisa menggantikan psikolog?",
    a: "Tidak. LIVIA hanya pendamping awal dan tidak mendiagnosis. Kalau rasa berat itu tidak kunjung reda, temui psikolog atau psikiater.",
  },
];

function Steps({ items, tone = "ink" }: { items: { title: string; body: string }[]; tone?: "ink" | "alert" }) {
  return (
    <ol className="space-y-9">
      {items.map((s, i) => (
        <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-3 md:grid-cols-[4.5rem_1fr]">
          <span
            aria-hidden
            className={`text-display leading-none md:text-display-lg md:leading-none ${
              tone === "alert" ? "text-alert" : "text-main-500"
            }`}
          >
            {i + 1}
          </span>
          <div>
            <h3 className="text-card-title">{s.title}</h3>
            <p className="mt-2 max-w-xl text-ink-soft">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function CaraKerjaPage() {
  return (
    <>
      <PageIntro
        title="Lima langkah, lalu kamu bisa mulai cerita."
        lead="Mendaftar cuma makan waktu beberapa menit. Sesudahnya, LIVIA bisa kamu ajak bicara kapan saja."
      />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Steps items={onboarding} />
      </section>

      <section id="alur-darurat" className="scroll-mt-24 bg-alert-soft">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-heading text-alert-ink md:text-title">Urutan kejadian saat darurat</h2>
            <p className="mt-5 max-w-sm text-ink-soft">
              Prosedurnya sama saja, entah kamu yang menekan tombol darurat atau LIVIA yang
              mendeteksinya sendiri.
            </p>
          </div>
          <Steps items={emergencyFlow} tone="alert" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-heading md:text-title">Yang paling sering ditanyakan</h2>
        <div className="mt-8">
          <Faq items={faq} />
        </div>
      </section>
    </>
  );
}
