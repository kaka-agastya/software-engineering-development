import type { Metadata } from "next";
import Link from "next/link";
import { ChatPreview } from "@/components/ChatPreview";
import {
  AnalysisTags,
  ContactCard,
  EmergencyCountdown,
  MoodPicker,
  SchedulePreview,
  SearchPreview,
  TrendChart,
} from "@/components/FeatureVisuals";
import { PageIntro } from "../_components/PageIntro";

export const metadata: Metadata = {
  title: "Fitur",
  description: "Teman bicara yang empatik, pembacaan emosi, check-in berkala, dan bantuan darurat di LIVIA.",
};

type Feature = {
  id: string;
  title: string;
  body: string;
  points: string[];
  visual: React.ReactNode;
  emphasis?: boolean;
};

const features: Feature[] = [
  {
    id: "percakapan",
    title: "Teman bicara yang menenangkan",
    body: "Tuliskan yang sedang kamu rasakan. Balasan LIVIA suportif, tidak menghakimi, dan berpusat pada dukungan untukmu.",
    points: [
      "Jawaban datang dalam hitungan detik",
      "Ada saran ringkas, misalnya latihan napas, ketika kamu sedih, cemas, atau lelah",
      "Tidak mengeluarkan diagnosis klinis",
    ],
    visual: (
      <div className="rounded-2xl border border-line bg-white/70 p-5">
        <ChatPreview animate={false} />
      </div>
    ),
  },
  {
    id: "analisis",
    title: "Membaca emosimu saat itu juga",
    body: "Tiap pesan diperiksa untuk menangkap emosi dan ungkapan yang patut dikhawatirkan. Hasilnya menjadi catatan emosi pribadimu.",
    points: [
      "Kata atau ungkapan berisiko dikenali seketika",
      "Pola emosi dibaca dari waktu ke waktu untuk melihat tanda krisis",
      "Seluruh catatan tersimpan terenkripsi",
    ],
    visual: <AnalysisTags />,
  },
  {
    id: "darurat",
    title: "Tombol darurat dan deteksi otomatis",
    body: "Tombol merah di layar utama bisa kamu tekan setiap kali perlu pertolongan. Prosedur darurat juga berjalan sendiri bila LIVIA menangkap risiko tinggi di percakapan atau check-in.",
    points: [
      "Ada hitung mundur 10 detik untuk memilih Batalkan atau Lanjutkan",
      "SMS memuat tautan lokasimu, dengan akurasi sampai 50 meter",
      "Selama satu menit LIVIA menunggu untuk memastikan ada kontak yang menanggapi",
      "Semua tahap masuk ke log insiden terenkripsi",
    ],
    visual: <EmergencyCountdown />,
    emphasis: true,
  },
  {
    id: "kontak",
    title: "Kontak darurat yang kamu tentukan",
    body: "Pilih minimal satu orang yang gampang dihubungi, bisa keluarga atau sahabat. Lewat SMS, mereka diberi tahu bahwa nomornya sudah didaftarkan.",
    points: [
      "Kontak bisa ditambah, diubah, atau dihapus kapan saja",
      "Setiap perubahan data diberitahukan ke kontak tersebut",
      "Kontakmu tidak perlu memasang aplikasi",
    ],
    visual: <ContactCard />,
  },
  {
    id: "check-in",
    title: "Sapaan check-in berkala",
    body: "Sesuai jadwal, LIVIA bertanya bagaimana kabarmu. Kamu tinggal memilih suasana hati, menandai hal yang sedang berpengaruh, dan menambah catatan kalau mau.",
    points: [
      "Jadwal diusulkan otomatis mengikuti kebiasaanmu",
      "Jadwal bisa kamu atur, ubah, atau matikan sendiri",
      "Pengingat menyusul bila check-in belum terjawab dalam 30 menit",
    ],
    visual: (
      <div className="grid gap-3">
        <MoodPicker selected={3} />
        <SchedulePreview />
      </div>
    ),
  },
  {
    id: "catatan",
    title: "Catatan dan grafik emosi",
    body: "Pantau perubahan perasaanmu lewat grafik, dan tambahkan catatan sendiri kapan pun dengan memilih ikon suasana hati.",
    points: [
      "Tujuh hari terakhir tampil secara bawaan",
      "Rentang tanggal bisa kamu tentukan",
      "Catatan manual punya lima pilihan suasana hati",
    ],
    visual: <TrendChart />,
  },
  {
    id: "riwayat",
    title: "Riwayat percakapan",
    body: "Cari percakapan lama dengan kata kunci, misalnya saat ingin menemukan lagi saran yang dulu terasa membantu.",
    points: [
      "Pencarian memakai kata kunci",
      "Percakapan tersimpan terenkripsi",
      "Semua data bisa dihapus kapan saja dengan menghapus akun",
    ],
    visual: <SearchPreview />,
  },
];

export default function FiturPage() {
  return (
    <>
      <PageIntro
        title="Mendengar, mengingat, dan selalu berjaga."
        lead="Setiap fitur LIVIA mengejar hal yang sama: kamu tidak dibiarkan sendirian, pada hari biasa maupun pada saat terberat."
      />

      <nav aria-label="Daftar fitur" className="bg-main-50">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-5 py-6 text-small">
          {features.map((f) => (
            <li key={f.id}>
              <a href={`#${f.id}`} className="font-medium text-ink underline underline-offset-4 hover:no-underline">
                {f.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {features.map((f) => (
        <section key={f.id} id={f.id} className={`scroll-mt-20 ${f.emphasis ? "bg-alert-soft" : ""}`}>
          <div
            className={`mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:py-20 ${
              f.emphasis ? "" : "border-b border-line"
            }`}
          >
            <div className="min-w-0">
              <h2 className={`text-heading md:text-title ${f.emphasis ? "text-alert-ink" : ""}`}>{f.title}</h2>
              <p className="mt-4 max-w-xl text-ink-soft">{f.body}</p>
              <ul className="mt-6 max-w-xl list-disc space-y-2.5 pl-5 text-ink-soft">
                {f.points.map((p) => (
                  <li key={p} className={f.emphasis ? "marker:text-alert" : "marker:text-main-500"}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full min-w-0 max-w-sm md:ml-auto">{f.visual}</div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-lead text-ink-soft">
          Mau tahu langkah memakainya?{" "}
          <Link href="/cara-kerja" className="font-semibold text-ink underline underline-offset-4">
            Baca cara kerja LIVIA
          </Link>
        </p>
      </section>
    </>
  );
}
