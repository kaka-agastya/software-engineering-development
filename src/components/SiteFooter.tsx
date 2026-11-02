import Link from "next/link";
import { crisisContacts, navItems } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-card-title text-paper">Butuh bantuan sekarang?</h2>
          <p className="mt-2 max-w-md text-small text-paper/75">
            LIVIA bukan layanan darurat. Jika kamu atau orang di dekatmu dalam bahaya,
            hubungi layanan berikut.
          </p>
          <ul className="mt-6 space-y-4">
            {crisisContacts.map((c) => (
              <li key={c.number}>
                <a
                  href={`tel:${c.tel}`}
                  className="text-heading underline-offset-4 hover:underline"
                >
                  {c.number}
                </a>
                <p className="text-small text-paper/75">
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
                <Link href={item.href} className="text-paper/80 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-paper/15">
        <p className="mx-auto max-w-6xl px-5 py-6 text-caption text-paper/60">
          LIVIA dikembangkan oleh Kelompok 4, Departemen Sistem Informasi, Institut Teknologi
          Sepuluh Nopember, 2026. LIVIA tidak menggantikan psikolog, psikiater, atau layanan
          medis profesional.
        </p>
      </div>
    </footer>
  );
}
