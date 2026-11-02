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
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" onClick={() => setOpen(false)} aria-label="LIVIA, ke beranda">
          <span className="rounded-md bg-ink px-2.5 py-1 text-badge font-bold text-paper">
            Livia.
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-small transition-colors ${
                    isActive(item.href)
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:bg-paper-deep"
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
          className="rounded-md border border-line px-3 py-2 text-small md:hidden"
          aria-expanded={open}
          aria-controls="menu-seluler"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Tutup" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="menu-seluler" aria-label="Navigasi seluler" className="border-t border-line md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-3 ${
                    isActive(item.href) ? "bg-ink text-paper" : "text-ink-soft"
                  }`}
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
