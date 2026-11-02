"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-night text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="LIVIA, ke beranda"
          className="text-heading text-caution-500"
        >
          Livia
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`border-b-2 py-1 text-small transition-colors ${
                    isActive(item.href)
                      ? "border-caution-500 text-paper"
                      : "border-transparent text-paper/80 hover:text-paper"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="rounded-full border border-paper/40 px-4 py-2 text-small md:hidden"
          aria-expanded={open}
          aria-controls="menu-seluler"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Tutup" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="menu-seluler" aria-label="Navigasi seluler" className="border-t border-paper/20 md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block py-3 ${isActive(item.href) ? "font-semibold text-caution-500" : "text-paper/85"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
