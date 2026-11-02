export function PageIntro({ title, lead }: { title: string; lead: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 md:pt-24">
      <h1 className="max-w-3xl text-display md:text-display-lg">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-ink-soft">{lead}</p>
    </section>
  );
}
