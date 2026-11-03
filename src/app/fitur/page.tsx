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
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Fitur",
  description: "Percakapan empatik, analisis emosi, check-in berkala, dan bantuan darurat di LIVIA.",
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
    title: "Percakapan yang menenangkan",
    body: "Ceritakan apa yang kamu rasakan. LIVIA menjawab dengan bahasa yang suportif, tidak menghakimi, dan fokus pada dukunganmu.",
    points: [
      "Balasan muncul dalam hitungan detik",
      "Saran singkat seperti latihan napas saat kamu sedang sedih, cemas, atau lelah",
      "Tidak memberikan diagnosis klinis",
    ],
    visual: (
      <div className="rounded-2xl border border-line bg-white/70 p-5">
        <ChatPreview animate={false} />
      </div>
    ),
  },
  {
    id: "analisis",
    title: "Mengenali emosimu secara langsung",
    body: "Setiap pesan dibaca untuk mengenali emosi dan ungkapan yang mengkhawatirkan. Hasilnya disimpan sebagai catatan emosi pribadimu.",
    points: [
      "Mengenali kata atau ungkapan berisiko saat itu juga",
      "Membaca pola emosi dari waktu ke waktu untuk melihat tanda krisis",
      "Semua catatan disimpan terenkripsi",
    ],
    visual: <AnalysisTags />,
  },
  {
    id: "darurat",
    title: "Tombol darurat dan deteksi otomatis",
    body: "Tekan tombol merah di layar utama kapan pun kamu butuh pertolongan. LIVIA juga akan memulai prosedur darurat sendiri jika mendeteksi risiko tinggi dalam percakapan atau check-in.",
    points: [
      "Hitung mundur 10 detik dengan pilihan Batalkan atau Lanjutkan",
      "SMS berisi tautan lokasimu dengan akurasi hingga 50 meter",
      "LIVIA menunggu satu menit untuk memastikan ada kontak yang merespons",
      "Setiap tahap tercatat dalam log insiden terenkripsi",
    ],
    visual: <EmergencyCountdown />,
    emphasis: true,
  },
  {
    id: "kontak",
    title: "Kontak darurat pilihanmu",
    body: "Daftarkan setidaknya satu orang yang mudah dihubungi, seperti keluarga atau sahabat. Mereka akan menerima SMS pemberitahuan bahwa nomornya terdaftar.",
    points: [
      "Tambah, ubah, atau hapus kontak kapan saja",
      "Kontak diberi tahu setiap kali datanya diperbarui",
      "Kontak tidak perlu memasang aplikasi",
    ],
    visual: <ContactCard />,
  },
  {
    id: "check-in",
    title: "Check-in berkala",
    body: "LIVIA menyapa sesuai jadwal untuk menanyakan kabarmu. Pilih suasana hati, tandai hal yang sedang memengaruhimu, dan tulis catatan bila ingin.",
    points: [
      "Usulan jadwal otomatis berdasarkan kebiasaanmu",
      "Atur, ubah, atau nonaktifkan jadwal sendiri",
      "Pengingat dikirim jika check-in belum dijawab dalam 30 menit",
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
    title: "Catatan dan tren emosi",
    body: "Lihat perjalanan perasaanmu dalam grafik dan tambahkan catatan sendiri kapan saja dengan memilih ikon suasana hati.",
    points: [
      "Tampilan bawaan tujuh hari terakhir",
      "Pilih rentang tanggal sendiri",
      "Catatan manual dengan lima pilihan suasana hati",
    ],
    visual: <TrendChart />,
  },
  {
    id: "riwayat",
    title: "Riwayat percakapan",
    body: "Temukan lagi percakapan lama dengan kata kunci, misalnya untuk mengingat saran yang pernah membantumu.",
    points: [
      "Pencarian berdasarkan kata kunci",
      "Percakapan disimpan terenkripsi",
      "Hapus seluruh data kapan pun lewat penghapusan akun",
    ],
    visual: <SearchPreview />,
  },
];

export default function FiturPage() {
  return (
    <>
      <PageIntro
        title="Pendamping yang mendengar, mengingat, dan siaga."
        lead="Semua fitur LIVIA dirancang untuk satu tujuan: memastikan kamu tidak sendirian, baik di hari biasa maupun di saat paling berat."
      />

      <nav aria-label="Daftar fitur" className="mx-auto max-w-6xl px-5">
        <ul className="flex flex-wrap gap-2">
          {features.map((f) => (
            <li key={f.id}>
              <a
                href={`#${f.id}`}
                className="block rounded-full border border-line px-4 py-2 text-small hover:bg-paper-deep"
              >
                {f.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto mt-16 max-w-6xl space-y-6 px-5">
        {features.map((f, i) => (
          <section
            key={f.id}
            id={f.id}
            className={`scroll-mt-28 grid items-center gap-10 rounded-3xl p-7 md:grid-cols-2 md:p-12 ${
              f.emphasis ? "bg-alert-soft" : i % 2 === 0 ? "bg-paper-deep" : ""
            }`}
          >
            <div className={`min-w-0 ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <h2
                className={`text-heading md:text-title ${
                  f.emphasis ? "text-alert-ink" : ""
                }`}
              >
                {f.title}
              </h2>
              <p className="mt-4 text-ink-soft">{f.body}</p>
              <ul className="mt-6 space-y-2.5">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-3 text-ink-soft">
                    <span
                      aria-hidden
                      className={`mt-2 size-1.5 shrink-0 rounded-full ${f.emphasis ? "bg-alert" : "bg-ink"}`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mx-auto w-full min-w-0 max-w-sm">{f.visual}</div>
          </section>
        ))}
      </div>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <p className="text-lead text-ink-soft">
          Ingin tahu langkah-langkah memakainya?{" "}
          <Link href="/cara-kerja" className="font-semibold text-ink underline underline-offset-4">
            Lihat cara kerja LIVIA
          </Link>
        </p>
      </section>
    </>
  );
}
