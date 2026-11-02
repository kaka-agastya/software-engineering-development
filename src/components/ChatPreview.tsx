type Props = { animate?: boolean };

/** Cuplikan percakapan sesuai storyboard Frame 4 (respons + saran penanganan) */
export function ChatPreview({ animate = true }: Props) {
  const cls = animate ? "bubble" : "";
  return (
    <div className="flex flex-col gap-2.5 text-small">
      <p
        className={`${cls} ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-paper`}
        style={{ animationDelay: "0.2s" }}
      >
        Aku capek. Gak ada yang ngerti aku.
      </p>
      <div
        className={`${cls} max-w-[88%] rounded-2xl rounded-bl-md bg-paper-deep px-3.5 py-2.5`}
        style={{ animationDelay: "1.1s" }}
      >
        <p>
          Aku dengar kamu sedang merasa sangat capek dan sendirian. Terima kasih sudah mau cerita
          ke aku.
        </p>
        <div className="mt-2.5 rounded-xl border border-line bg-paper px-3 py-2.5">
          <p className="font-semibold">Coba latihan napas sederhana</p>
          <p className="mt-1 text-ink-soft">
            Tarik napas 4 hitungan, tahan 4 hitungan, lalu embuskan perlahan 6 hitungan. Ulangi 3
            kali.
          </p>
        </div>
      </div>
      <p
        className={`${cls} max-w-[80%] rounded-2xl rounded-bl-md bg-paper-deep px-3.5 py-2.5`}
        style={{ animationDelay: "1.9s" }}
      >
        Mau aku temani sebentar?
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-white/60 p-2">
        <span
          className="grid size-8 shrink-0 place-items-center rounded-lg bg-alert text-caption font-bold text-white"
          aria-label="Tombol darurat"
        >
          !
        </span>
        <span className="flex-1 truncate text-muted">Tulis pesan kamu di sini…</span>
        <span className="rounded-lg bg-ink px-3 py-1.5 text-caption text-paper">Kirim</span>
      </div>
    </div>
  );
}
