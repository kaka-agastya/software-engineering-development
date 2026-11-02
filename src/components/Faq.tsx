export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-card-title text-ink">
            {item.q}
            <span
              aria-hidden
              className="mt-1 text-card-title leading-none text-muted transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
