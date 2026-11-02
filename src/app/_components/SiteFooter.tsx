import Link from "next/link";
import { crisisContacts, navItems } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-night text-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-heading text-paper">Perlu pertolongan sekarang?</h2>
          <p className="mt-2 max-w-md text-small text-paper/80">
            LIVIA tidak bisa menggantikan layanan darurat. Kalau kamu atau orang di sekitarmu dalam
            bahaya, telepon nomor di bawah ini.
          </p>
          <ul className="mt-6 space-y-4">
            {crisisContacts.map((c) => (
              <li key={c.number}>
                <a
                  href={`tel:${c.tel}`}
                  className="text-title font-bold tabular-nums text-caution-500 underline-offset-4 hover:underline"
                >
                  {c.number}
                </a>
                <p className="text-small text-paper/80">
                  {c.name}. {c.note}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Navigasi footer">
          <ul className="space-y-2 text-small">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/85 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-paper/20">
        <p className="mx-auto max-w-6xl px-5 py-6 text-caption text-paper/70">
          Dibuat oleh Kelompok 4, Departemen Sistem Informasi, Institut Teknologi Sepuluh Nopember,
          2026. Psikolog, psikiater, dan layanan medis profesional tetap tidak tergantikan oleh
          LIVIA.
        </p>
      </div>
    </footer>
  );
}
