export const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/fitur", label: "Fitur" },
  { href: "/cara-kerja", label: "Cara kerja" },
  { href: "/kontak-darurat", label: "Untuk kontak darurat" },
  { href: "/privasi", label: "Privasi & bantuan" },
  { href: "/masuk", label: "Masuk" },
] as const;

/**
 * PENTING: verifikasi ulang semua nomor di bawah ini ke sumber resmi
 * sebelum website dipublikasikan. Nomor layanan dapat berubah.
 */
export const crisisContacts = [
  {
    name: "Layanan darurat nasional",
    number: "112",
    tel: "112",
    note: "Polisi, ambulans, dan pemadam kebakaran. Bebas pulsa, 24 jam.",
  },
  {
    name: "Layanan konseling jiwa Kemenkes (SEJIWA)",
    number: "119 ext 8",
    tel: "119",
    note: "Dukungan psikologis awal. Setelah tersambung, pilih ekstensi 8.",
  },
] as const;

export const APP_DOWNLOAD_URL = "#unduh"; // ganti dengan tautan Play Store
export const TEAM_EMAIL = "livia.kelompok4@example.com"; // ganti dengan email tim
