import Link from "next/link";
import { ChatPreview } from "@/components/ChatPreview";
import { EmergencyCountdown } from "@/components/FeatureVisuals";
import { PhoneFrame } from "@/components/PhoneFrame";
import { APP_DOWNLOAD_URL } from "@/lib/site";

const figures = [
  {
    value: "±495.000",
    label: "orang hidup dengan gangguan mental berat di Indonesia",
  },
  { value: "826", label: "kasus bunuh diri tercatat sepanjang 2022" },
  {
    value: "1 : 300.000",
    label: "perbandingan jumlah psikolog dengan penduduk",
  },
];

const highlights = [
  {
    title: "Teman cerita kapan saja",
    body: "Ceritakan apa pun, jam berapa pun. LIVIA menjawab dengan hangat dan tanpa menghakimi.",
    href: "/fitur#percakapan",
  },
  {
    title: "Memahami perasaanmu",
    body: "Setiap cerita membantu LIVIA mengenali pola emosimu, termasuk tanda saat kamu sedang tidak baik-baik saja.",
    href: "/fitur#analisis",
  },
  {
    title: "Menyapa lewat check-in",
    body: "LIVIA menanyakan kabarmu secara berkala, sesuai jadwal yang kamu pilih.",
    href: "/fitur#check-in",
  },
  {
    title: "Menghubungi orang terdekatmu",
    body: "Saat kondisi darurat, LIVIA mengirim lokasimu ke kontak darurat yang kamu percaya.",
    href: "/fitur#darurat",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 md:grid-cols-[1.15fr_0.85fr] md:pt-24">
        <div>
          <p className="text-form-label text-ink-soft">
            Living Voice for Inner Awareness
          </p>
          <h1 className="mt-5 text-display md:text-display-lg">
            Hari ini kamu hebat karena memilih untuk bertahan.
          </h1>
          <p className="mt-7 max-w-xl text-lead text-ink-soft">
            LIVIA adalah teman cerita berbasis AI. Ia mendengarkan tanpa
            menghakimi, mengenali saat kamu sedang tidak baik-baik saja, dan
            menghubungi orang terdekatmu ketika kamu butuh bantuan.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={APP_DOWNLOAD_URL}
              className="rounded-xl bg-ink px-6 py-3.5 text-button text-paper hover:bg-main-500"
            >
              Mulai Bercerita
            </a>
            <Link
              href="/cara-kerja"
              className="rounded-xl border border-ink/25 px-6 py-3.5 text-button hover:bg-paper-deep"
            >
              Lihat cara kerjanya
            </Link>
          </div>
          <p className="mt-5 text-small text-muted">
            Gratis. LIVIA bukan pengganti psikolog atau psikiater.
          </p>
        </div>

        <PhoneFrame label="Contoh percakapan di aplikasi LIVIA">
          <ChatPreview />
        </PhoneFrame>
      </section>

      {/* Alasan */}
      <section className="border-y border-line bg-paper-deep">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-heading md:text-title">
              Banyak orang menanggungnya sendirian.
            </h2>
            <p className="mt-5 max-w-lg text-ink-soft">
              Tenaga profesional masih sangat terbatas dan stigma membuat banyak
              orang ragu mencari bantuan. Di sisi lain, hampir semua orang
              membawa ponsel setiap hari. LIVIA hadir di sana sebagai pendamping
              awal, supaya tidak ada yang harus melewati malam terberatnya tanpa
              seorang pun.
            </p>
          </div>
          <div>
            <dl className="divide-y divide-line border-y border-line">
              {figures.map((f) => (
                <div key={f.value} className="flex items-baseline gap-5 py-4">
                  <dt className="w-36 shrink-0 text-heading tabular-nums text-ink">
                    {f.value}
                  </dt>
                  <dd className="text-ink-soft">{f.label}</dd>
                </div>
              ))}
            </dl>
            {/* TODO: ganti dengan rujukan resmi (Kemenkes, Polri, HIMPSI, APJII) */}
            <p className="mt-3 text-caption text-muted">
              Sumber: data yang dihimpun dalam dokumen kebutuhan LIVIA, 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Fitur ringkas */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-heading md:text-title">Apa yang dilakukan LIVIA</h2>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {highlights.map((h) => (
            <li key={h.title}>
              <Link
                href={h.href}
                className="grid gap-2 py-6 hover:bg-paper-deep md:grid-cols-[1fr_1.4fr] md:gap-10 md:px-3"
              >
                <span className="text-card-title text-ink">{h.title}</span>
                <span className=" text-ink-soft">{h.body}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/fitur"
          className="mt-6 inline-block font-semibold underline underline-offset-4"
        >
          Lihat semua fitur
        </Link>
      </section>

      {/* Darurat */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid items-center gap-10 rounded-3xl bg-ink p-8 text-paper md:grid-cols-2 md:p-14">
          <div>
            <h2 className="text-heading text-paper md:text-title">
              Saat keadaan genting, kamu tetap memegang kendali.
            </h2>
            <p className="mt-5 text-paper/80">
              Jika LIVIA mendeteksi risiko tinggi atau kamu menekan tombol
              darurat, kamu punya 10 detik untuk membatalkan. Jika tidak
              dibatalkan, lokasimu dikirim ke kontak darurat lewat SMS, dan
              LIVIA memastikan setidaknya satu dari mereka merespons.
            </p>
            <Link
              href="/cara-kerja#alur-darurat"
              className="mt-7 inline-block rounded-xl bg-paper px-5 py-3 text-button text-ink"
            >
              Pelajari alur darurat
            </Link>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <EmergencyCountdown />
          </div>
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section id="unduh" className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="text-heading md:text-title">
          Kamu tidak harus menghadapinya sendirian.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-ink-soft">
          LIVIA memberikan dukungan emosional awal dan tidak memberikan
          diagnosis klinis. Untuk penanganan jangka panjang, tetap temui
          psikolog atau psikiater.
        </p>
        <a
          href={APP_DOWNLOAD_URL}
          className="mt-8 inline-block rounded-xl bg-ink px-7 py-4 text-button text-paper hover:bg-main-500"
        >
          Mulai Sekarang
        </a>
      </section>
    </>
  );
}
