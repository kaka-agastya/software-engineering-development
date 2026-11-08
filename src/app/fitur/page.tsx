import type { Metadata } from "next";
import Link from "next/link";
import { ChatPreview } from "@/components/ChatPreview";
import {
  AnalysisTags,
  EmergencyCountdown,
  MoodPicker,
  SchedulePreview,
  SearchPreview,
  TrendChart,
} from "@/components/FeatureVisuals";
import { ContactManager, LoginForm, RegisterForm, SmsNotice } from "../_components/AccountVisuals";
import { PageIntro } from "../_components/PageIntro";

export const metadata: Metadata = {
  title: "Fitur",
  description:
    "Teman bicara yang empatik, pembacaan emosi, check-in berkala, bantuan darurat, kontak darurat, dan akun yang aman di LIVIA.",
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
    title: "Kelola kontak daruratmu",
    body: "Pilih minimal satu orang yang gampang dihubungi, bisa keluarga atau sahabat. Daftarnya ada di Halaman Profil dan bisa kamu ubah kapan pun.",
    points: [
      "Isi nama lengkap, nomor ponsel, dan hubunganmu dengan kontak tersebut",
      "Nomor dicek formatnya, harus lengkap dengan kode negara seperti +62",
      "Kontak bisa ditambah, diubah, atau dihapus, dan penghapusan selalu meminta konfirmasi",
      "Data kontak tersimpan terenkripsi",
    ],
    visual: <ContactManager />,
  },
  {
    id: "sms",
    title: "SMS pemberitahuan untuk kontak darurat",
    body: "Begitu kontak disimpan atau diperbarui, LIVIA otomatis mengirim SMS supaya orang itu tahu dirinya terdaftar sebagai kontak daruratmu.",
    points: [
      "Terkirim ke setiap kontak segera setelah datanya disimpan",
      "Kontakmu tidak perlu memasang aplikasi",
      "Status pengiriman dicatat untuk setiap kontak",
      "Kalau gagal, SMS dikirim ulang, dan kamu diberi tahu bila tetap tidak terkirim",
    ],
    visual: <SmsNotice />,
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
  {
    id: "daftar",
    title: "Daftar dengan nomor ponselmu",
    body: "Buat akun dengan nama lengkap, nama panggilan, nomor ponsel, dan kata sandi. Nomormu diverifikasi lewat kode OTP yang dikirim melalui SMS.",
    points: [
      "Nomor ponsel ditulis lengkap dengan kode negara, misalnya +62 812…",
      "Kode OTP yang salah atau kedaluwarsa bisa diminta ulang",
      "Satu nomor hanya bisa dipakai untuk satu akun",
      "Akun aktif penuh setelah kamu menyimpan minimal satu kontak darurat",
    ],
    visual: <RegisterForm />,
  },
  {
    id: "masuk",
    title: "Masuk ke akunmu",
    body: "Sudah punya akun? Cukup masukkan nomor ponsel dan kata sandi, lalu kamu langsung kembali ke Halaman Home.",
    points: [
      "Kredensial disimpan dalam bentuk terenkripsi",
      "Kalau nomor atau kata sandinya salah, kamu diberi tahu dan bisa mencoba lagi",
    ],
    visual: <LoginForm />,
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
