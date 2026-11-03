import type { Metadata } from "next";
import { Faq, type FaqItem } from "@/components/Faq";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Cara kerja",
  description:
    "Langkah memulai LIVIA dan apa yang terjadi saat prosedur darurat berjalan.",
};

const onboarding = [
  {
    title: "Registrasi",
    body: "Masuk ke menu login, lalu pilih Daftar di halaman selamat datang.",
  },
  {
    title: "Isi data diri",
    body: "Masukkan nama lengkap, nama panggilan, nomor ponsel dengan kode negara (contoh: +62 812…), dan kata sandi.",
  },
  {
    title: "Verifikasi nomor ponsel",
    body: "Masukkan kode OTP yang dikirim lewat SMS. Jika kode salah atau kedaluwarsa, minta kode baru.",
  },
  {
    title: "Tambahkan kontak darurat",
    body: "Daftarkan minimal satu orang yang kamu percaya. Akunmu baru aktif penuh setelah langkah ini, karena kontak inilah yang akan dihubungi saat kamu butuh bantuan.",
  },
  {
    title: "Mulai bercerita",
    body: "Kamu langsung masuk ke layar percakapan. Tulis apa yang sedang kamu rasakan, sepanjang atau sesingkat apa pun.",
  },
];

const emergencyFlow = [
  {
    title: "Pemicu",
    body: "Kamu menekan tombol darurat, atau LIVIA mendeteksi risiko tinggi dari pesan maupun jawaban check-in.",
  },
  {
    title: "Hitung mundur 10 detik",
    body: "Muncul jendela konfirmasi. Pilih Batalkan jika kamu aman, atau Lanjutkan jika butuh bantuan. Jika tidak memilih, prosedur berlanjut otomatis.",
  },
  {
    title: "SMS dan lokasi terkirim",
    body: "Semua kontak daruratmu menerima SMS berisi tautan lokasi dengan akurasi hingga 50 meter. Kamu mendapat pemberitahuan bahwa pesan sudah terkirim.",
  },
  {
    title: "Menunggu respons selama satu menit",
    body: "LIVIA menunggu konfirmasi dari kontak daruratmu.",
  },
  {
    title: "Insiden selesai",
    body: "Begitu setidaknya satu kontak mengonfirmasi, insiden ditandai selesai. Setiap tahap tercatat dalam log terenkripsi.",
  },
];

const faq: FaqItem[] = [
  {
    q: "Apakah LIVIA akan menghakimi ceritaku?",
    a: "Tidak. LIVIA dirancang untuk selalu menjawab dengan bahasa yang suportif dan tidak menghakimi. Kamu bebas bercerita apa adanya.",
  },
  {
    q: "Apakah aku bisa membatalkan peringatan darurat?",
    a: "Bisa. Kamu punya waktu 10 detik untuk menekan Batalkan sebelum notifikasi dikirim ke kontak daruratmu.",
  },
  {
    q: "Mengapa aku wajib menambahkan kontak darurat?",
    a: "Karena saat kondisi paling berat, bantuan dari orang terdekat bisa datang jauh lebih cepat. Tanpa kontak darurat, LIVIA tidak punya siapa pun untuk dihubungi.",
  },
  {
    q: "Apa yang terjadi kalau aku melewatkan check-in?",
    a: "LIVIA mengirim pengingat setelah 30 menit. Check-in yang belum dijawab sampai akhir hari ditandai terlewat. Jika kamu melewatkan dua check-in berturut-turut, LIVIA bisa menjadi lebih peka terhadap tanda risiko.",
  },
  {
    q: "Apakah LIVIA bisa menggantikan psikolog?",
    a: "Tidak. LIVIA adalah pendamping awal dan tidak memberikan diagnosis. Jika perasaan beratmu berlangsung lama, temui psikolog atau psikiater.",
  },
];

function Steps({
  items,
  tone = "ink",
}: {
  items: { title: string; body: string }[];
  tone?: "ink" | "alert";
}) {
  return (
    <ol className="relative space-y-8 border-l-2 border-line pl-8">
      {items.map((s, i) => (
        <li key={s.title} className="relative">
          <span
            aria-hidden
            className={`absolute -left-[3.05rem] grid size-9 place-items-center rounded-full text-form-label font-bold ${
              tone === "alert" ? "bg-alert text-white" : "bg-ink text-paper"
            }`}
          >
            {i + 1}
          </span>
          <h3 className="text-card-title">{s.title}</h3>
          <p className="mt-2 max-w-xl text-ink-soft">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export default function CaraKerjaPage() {
  return (
    <>
      <PageIntro
        title="Mulai dalam lima langkah."
        lead="Pendaftaran hanya butuh beberapa menit. Setelah itu, LIVIA siap menemanimu kapan saja."
      />

      <section className="mx-auto max-w-6xl px-5 pl-9">
        <Steps items={onboarding} />
      </section>

      <section id="alur-darurat" className="mt-24 scroll-mt-24 bg-alert-soft">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-heading md:text-title text-alert-ink">
              Apa yang terjadi saat darurat
            </h2>
            <p className="mt-5 max-w-sm text-ink-soft">
              Prosedur yang sama berlaku baik saat kamu menekan tombol darurat
              sendiri maupun saat LIVIA mendeteksinya secara otomatis.
            </p>
          </div>
          <div className="pl-4">
            <Steps items={emergencyFlow} tone="alert" />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-heading md:text-title">
          Pertanyaan yang sering muncul
        </h2>
        <div className="mt-8">
          <Faq items={faq} />
        </div>
      </section>
    </>
  );
}
