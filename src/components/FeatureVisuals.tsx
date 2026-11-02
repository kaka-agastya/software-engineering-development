/* Potongan UI kecil yang meniru layar aplikasi di storyboard. Murni dekoratif. */

export function EmergencyCountdown() {
  return (
    <div className="rounded-2xl border border-alert/40 bg-alert-soft p-5 text-alert-ink">
      <p className="text-card-title">Peringatan!</p>
      <p className="mt-1 text-small">
        Kondisi darurat terdeteksi. Livia akan mengirimkan notifikasi ke kontak darurat.
      </p>
      <div className="mt-4 flex gap-2">
        <span className="flex-1 rounded-lg border border-alert/50 bg-white py-2 text-center text-button">
          Batalkan
        </span>
        <span className="flex-1 rounded-lg bg-alert py-2 text-center text-button text-white">
          Lanjutkan <span className="tabular-nums">10</span>
        </span>
      </div>
    </div>
  );
}

export function AnalysisTags() {
  const tags = [
    { label: "Emosi terdeteksi", value: "Lelah, kesepian" },
    { label: "Tingkat risiko", value: "Rendah" },
    { label: "Disimpan", value: "19.04, terenkripsi" },
  ];
  return (
    <dl className="grid gap-2">
      {tags.map((t) => (
        <div
          key={t.label}
          className="flex items-center justify-between rounded-lg border border-line bg-white/70 px-4 py-3 text-small"
        >
          <dt className="text-muted">{t.label}</dt>
          <dd className="font-semibold">{t.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactCard() {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <p className="text-small text-muted">Kontak darurat</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-calm font-semibold text-calm-ink">
          CW
        </span>
        <div>
          <p className="font-semibold">Clara Wheeler</p>
          <p className="text-small text-ink-soft">Teman dekat, +62 898 7654 3210</p>
        </div>
      </div>
      <p className="mt-4 rounded-lg bg-calm px-3 py-2 text-small text-calm-ink">
        SMS pemberitahuan sudah terkirim
      </p>
    </div>
  );
}

export const moods = [
  { emoji: "😄", label: "Sangat senang" },
  { emoji: "🙂", label: "Senang" },
  { emoji: "😐", label: "Netral" },
  { emoji: "🙁", label: "Sedih" },
  { emoji: "😢", label: "Sangat sedih" },
];

export function MoodPicker({ selected = 1 }: { selected?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <p className="text-card-title">Bagaimana perasaanmu hari ini?</p>
      <ul className="mt-4 grid grid-cols-5 gap-1 text-center">
        {moods.map((m, i) => (
          <li key={m.label}>
            <span
              className={`mx-auto grid size-11 place-items-center rounded-full text-xl ${
                i === selected ? "bg-alert-soft ring-2 ring-alert/40" : "bg-paper-deep"
              }`}
              aria-hidden
            >
              {m.emoji}
            </span>
            <span className="mt-1.5 block text-caption text-ink-soft">{m.label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Pekerjaan", "Hubungan", "Keuangan", "Tidur"].map((f, i) => (
          <span
            key={f}
            className={`rounded-full px-3 py-1 text-badge ${i === 0 || i === 3 ? "bg-ink text-paper" : "border border-line"}`}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrendChart() {
  // Nilai 1 (sangat sedih) sampai 5 (sangat senang), 7–13 Oktober
  const values = [3, 2, 3, 4, 3, 3, 4];
  const w = 280;
  const h = 120;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * (w - 20) + 10},${h - 10 - ((v - 1) / 4) * (h - 20)}`)
    .join(" ");
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <p className="text-card-title">Tren emosi</p>
      <p className="text-small text-muted">7–13 Oktober 2026</p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-3 w-full"
        role="img"
        aria-label="Grafik tren emosi tujuh hari, cenderung naik dari sedih ke senang"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="10"
            x2={w - 10}
            y1={10 + (i * (h - 20)) / 4}
            y2={10 + (i * (h - 20)) / 4}
            stroke="var(--color-line)"
          />
        ))}
        <polyline points={pts} fill="none" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
        {pts.split(" ").map((p) => {
          const [cx, cy] = p.split(",");
          return <circle key={p} cx={cx} cy={cy} r="3.5" fill="var(--color-ink)" />;
        })}
      </svg>
    </div>
  );
}

export function SearchPreview() {
  const results = [
    { time: "19.04", text: "Aku merasa cemas soal ujian besok…" },
    { time: "Kemarin", text: "Rasa gelisah dan cemas ini membuat…" },
  ];
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <div className="flex gap-2">
        <span className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-small">cemas</span>
        <span className="rounded-lg bg-ink px-3 py-2 text-small text-paper">Cari</span>
      </div>
      <ul className="mt-4 space-y-2">
        {results.map((r) => (
          <li key={r.time} className="rounded-lg border border-line px-3 py-2.5 text-small">
            <span className="font-semibold">{r.time}</span>
            <span className="block truncate text-ink-soft">{r.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SchedulePreview() {
  const items = [
    { label: "Setiap hari, 09.00", type: "Otomatis", active: true },
    { label: "Senin dan Kamis, 10.00", type: "Manual", active: true },
    { label: "Setiap hari, 20.00", type: "Manual", active: false },
  ];
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <p className="text-card-title">Jadwal check-in</p>
      <ul className="mt-3 space-y-2">
        {items.map((s) => (
          <li
            key={s.label}
            className={`flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-small ${
              s.active ? "" : "opacity-55"
            }`}
          >
            <span>
              {s.label}
              <span className={`block text-caption ${s.active ? "text-calm-ink" : "text-muted"}`}>
                {s.active ? "Aktif" : "Nonaktif"}
              </span>
            </span>
            <span className="rounded-full bg-main-50 px-2.5 py-0.5 text-badge text-main-700">{s.type}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-lg bg-caution-100 px-3 py-2 text-badge text-main-700">
        Check-in 09.00 belum dijawab. Pengingat dikirim dalam 30 menit.
      </p>
    </div>
  );
}
