export function PhoneFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <figure
      aria-label={label}
      className="mx-auto w-full max-w-[310px] rounded-[2.4rem] border-[10px] border-ink bg-paper p-4 shadow-[0_40px_70px_-35px_rgba(23,42,58,0.55)]"
    >
      <div className="flex items-center justify-between pb-4">
        <span className="grid size-7 place-items-center rounded-full bg-paper-deep text-badge text-ink-soft">
          RN
        </span>
        <span className="h-1.5 w-14 rounded-full bg-line" aria-hidden />
      </div>
      {children}
    </figure>
  );
}
