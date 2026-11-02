export function PageIntro({ title, lead }: { title: string; lead: string }) {
  return (
    <section className="relative overflow-hidden bg-night">
      <span
        aria-hidden
        className="absolute -right-10 top-4 size-28 rounded-full bg-caution-500 lg:right-12 lg:top-10 lg:size-40"
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-36 lg:pt-28">
        <h1 className="max-w-3xl text-display text-paper md:text-display-lg">{title}</h1>
        <p className="mt-6 max-w-2xl text-lead text-paper/85">{lead}</p>
      </div>
    </section>
  );
}
