import Link from "next/link";
import { EmergencyCountdown } from "@/components/FeatureVisuals";
import { APP_DOWNLOAD_URL } from "@/lib/site";

const figures = [
  { value: "±495.000", label: "penduduk Indonesia hidup dengan gangguan mental berat" },
  { value: "826", label: "kasus bunuh diri yang tercatat selama 2022" },
  { value: "1 : 300.000", label: "rasio psikolog terhadap jumlah penduduk" },
  { value: "89%", label: "penduduk kini punya smartphone" },
];

const highlights = [
  {
    title: "Siap mendengar kapan pun",
    body: "Pagi, tengah malam, atau di sela kerja, ceritakan saja. Balasannya hangat dan kamu tidak akan dihakimi.",
    href: "/fitur#percakapan",
  },
  {
    title: "Mengenali naik turun perasaanmu",
    body: "Dari ceritamu, LIVIA belajar membaca pola emosi, termasuk tanda-tanda ketika keadaanmu sedang menurun.",
    href: "/fitur#analisis",
  },
  {
    title: "Menanyakan kabarmu",
    body: "Lewat check-in berkala, LIVIA menyapa pada waktu yang kamu tentukan.",
    href: "/fitur#check-in",
  },
  {
    title: "Mengabari orang yang kamu percaya",
    body: "Dalam keadaan darurat, lokasimu dikirim ke kontak darurat yang sudah kamu pilih.",
    href: "/fitur#darurat",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero: malam, tempat percakapan dimulai */}
      <section className="relative overflow-hidden bg-night">
        <span
          aria-hidden
          className="absolute -right-10 top-4 size-28 rounded-full bg-caution-500 lg:right-[6%] lg:top-10 lg:size-80"
        />
        <div className="relative mx-auto grid max-w-6xl items-end gap-14 px-5 pb-20 pt-36 lg:grid-cols-[1.2fr_0.8fr] lg:pb-28 lg:pt-24">
          <div>
            <h1 className="text-display text-paper md:text-display-lg">
              Kamu masih di sini hari ini, dan itu sudah hebat.
            </h1>
            <p className="mt-7 max-w-xl text-lead text-paper/85">
              LIVIA adalah teman bercerita berbasis AI di ponsel Android. Ceritamu didengar tanpa
              dihakimi, tanda saat kamu sedang berat dikenali, dan orang terdekatmu dikabari ketika
              kamu perlu ditolong.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={APP_DOWNLOAD_URL}
                className="rounded-full bg-caution-500 px-6 py-3.5 text-button text-night hover:bg-caution-100"
              >
                Unduh untuk Android
              </a>
              <Link
                href="/cara-kerja"
                className="rounded-full border border-paper/50 px-6 py-3.5 text-button text-paper hover:bg-paper/10"
              >
                Pelajari cara pakainya
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-small text-paper/80">
              Gratis dipakai. LIVIA (Living Voice for Inner Awareness) tidak menggantikan psikolog
              atau psikiater.
            </p>
          </div>

          {/* Baris percakapan mengikuti storyboard Frame 4 */}
          <figure aria-label="Contoh percakapan di aplikasi LIVIA" className="flex flex-col gap-3">
            <figcaption className="self-end rounded-full bg-night px-3 py-1 text-small tabular-nums text-paper">
              02.14
            </figcaption>
            <p className="bubble ml-auto max-w-[85%] rounded-3xl rounded-br-md bg-main-500 px-5 py-4 text-lead text-paper">
              Aku capek. Gak ada yang ngerti aku.
            </p>
            <p
              className="bubble max-w-[92%] rounded-3xl rounded-bl-md bg-paper px-5 py-4 text-ink"
              style={{ animationDelay: "0.9s" }}
            >
              Aku dengar kamu sedang merasa sangat capek dan sendirian. Terima kasih sudah mau cerita
              ke aku.
            </p>
            <p
              className="bubble max-w-[70%] rounded-3xl rounded-bl-md bg-paper px-5 py-4 text-ink"
              style={{ animationDelay: "1.7s" }}
            >
              Mau aku temani sebentar?
            </p>
          </figure>
        </div>
      </section>

      {/* Alasan */}
      <section className="bg-main-700">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <h2 className="text-heading text-paper md:text-title">
              Terlalu banyak orang memikulnya seorang diri.
            </h2>
            <p className="max-w-lg text-paper/85">
              Jumlah tenaga profesional masih jauh dari cukup, dan stigma membuat banyak orang enggan
              meminta tolong. Padahal ponsel selalu ada di genggaman. Di situlah LIVIA menjadi
              pendamping pertama, agar malam yang paling berat tidak perlu dilalui tanpa siapa-siapa.
            </p>
          </div>
          <dl className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {figures.map((f) => (
              <div key={f.value}>
                <dt className="text-display font-bold tabular-nums text-caution-500 md:text-display-lg">
                  {f.value}
                </dt>
                <dd className="mt-2 max-w-sm text-paper/85">{f.label}</dd>
              </div>
            ))}
          </dl>
          {/* TODO: ganti dengan rujukan resmi (Kemenkes, Polri, HIMPSI, APJII) */}
          <p className="mt-10 text-caption text-paper/75">
            Sumber: dihimpun dari dokumen kebutuhan LIVIA, 2026.
          </p>
        </div>
      </section>

      {/* Fitur ringkas */}
      <section className="bg-main-500">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <h2 className="text-heading text-paper md:text-title">Yang bisa LIVIA lakukan untukmu</h2>
          <ul className="mt-10 divide-y divide-paper/30 border-y border-paper/30">
            {highlights.map((h) => (
              <li key={h.title}>
                <Link
                  href={h.href}
                  className="grid gap-2 py-7 hover:bg-paper/10 md:grid-cols-[1fr_1.2fr] md:gap-10 md:px-3"
                >
                  <span className="text-heading text-paper">{h.title}</span>
                  <span className="text-white/90">{h.body}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/fitur" className="mt-7 inline-block font-semibold text-paper underline underline-offset-4">
            Lihat seluruh fitur
          </Link>
        </div>
      </section>

      {/* Darurat */}
      <section className="bg-main-100">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-24">
          <div>
            <h2 className="text-heading text-night md:text-title">
              Saat genting pun, keputusan tetap di tanganmu.
            </h2>
            <p className="mt-5 text-night">
              Begitu LIVIA membaca risiko tinggi atau kamu menekan tombol darurat, ada 10 detik untuk
              membatalkan. Kalau tidak dibatalkan, lokasimu terkirim lewat SMS ke kontak darurat, lalu
              LIVIA memastikan paling tidak satu orang menanggapi.
            </p>
            <Link
              href="/cara-kerja#alur-darurat"
              className="mt-7 inline-block rounded-full bg-night px-6 py-3 text-button text-paper hover:bg-main-700"
            >
              Baca alur daruratnya
            </Link>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <EmergencyCountdown />
          </div>
        </div>
      </section>

      {/* Disclaimer + CTA: pagi, lingkaran yang sama kini terbit */}
      <section id="unduh" className="relative overflow-hidden bg-paper">
        <span
          aria-hidden
          className="absolute -bottom-40 right-[-4rem] size-80 rounded-full bg-caution-500 md:-bottom-64 md:right-[8%] md:size-[32rem]"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-48 pt-24 md:pb-32 md:pt-32">
          <h2 className="max-w-2xl text-display md:text-display-lg">
            Kamu tidak perlu menanggungnya sendiri.
          </h2>
          <p className="mt-6 max-w-xl text-lead">
            LIVIA hanya memberi dukungan emosional awal, bukan diagnosis klinis. Untuk penanganan
            jangka panjang, psikolog atau psikiater tetap tempat yang tepat.
          </p>
          <a
            href={APP_DOWNLOAD_URL}
            className="mt-9 inline-block rounded-full bg-ink px-7 py-4 text-button text-paper hover:bg-night"
          >
            Unduh LIVIA untuk Android
          </a>
        </div>
      </section>
    </>
  );
}
