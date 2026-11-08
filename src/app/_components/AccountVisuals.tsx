/* Tiruan layar akun & kontak darurat sesuai storyboard 4.1 dan 4.2 di CDR. Murni dekoratif. */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-form-label">{label}</p>
      <p className="mt-1 rounded-lg border border-line bg-paper px-3 py-2 text-small text-ink-soft">{value}</p>
    </div>
  );
}

export function RegisterForm() {
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-line bg-white/70 p-5">
        <p className="text-card-title">Pendaftaran Akun</p>
        <div className="mt-4 grid gap-3">
          <Field label="Nama Lengkap" value="Rani Pratiwi" />
          <Field label="Nama Panggilan" value="Rani" />
          <Field label="Nomor Telepon" value="+62 812 3456 7890" />
          <Field label="Password" value="••••••••" />
        </div>
        <p className="mt-4 rounded-lg bg-ink py-2 text-center text-button text-paper">Berikutnya</p>
        <p className="mt-3 text-center text-caption text-muted">Sudah memiliki akun? Masuk</p>
      </div>
      <div className="rounded-2xl border border-line bg-white/70 p-5">
        <p className="text-card-title">Konfirmasi Pendaftaran</p>
        <p className="mt-1 text-small text-ink-soft">Kode OTP dikirim lewat SMS ke +62 812 3456 7890</p>
        <div className="mt-4 flex gap-2" aria-label="Kode OTP, tiga dari enam digit sudah diisi">
          {["4", "8", "2", "", "", ""].map((d, i) => (
            <span
              key={i}
              className="grid h-11 flex-1 place-items-center rounded-lg border border-line bg-paper text-heading tabular-nums"
            >
              {d}
            </span>
          ))}
        </div>
        <p className="mt-3 text-small font-semibold text-ink underline underline-offset-2">Kirim Ulang OTP</p>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <p className="text-card-title">Masuk</p>
      <div className="mt-4 grid gap-3">
        <Field label="Nomor Telepon" value="+62 812 3456 7890" />
        <Field label="Password" value="••••••••" />
      </div>
      <p className="mt-3 rounded-lg bg-alert-soft px-3 py-2 text-small text-alert-ink">
        Nomor ponsel atau kata sandi salah.
      </p>
      <p className="mt-4 rounded-lg bg-ink py-2 text-center text-button text-paper">Masuk</p>
      <p className="mt-3 text-center text-caption text-muted">Belum memiliki akun? Daftar</p>
    </div>
  );
}

export function ContactManager() {
  const contacts = [
    { initials: "CW", name: "Clara Wheeler", relation: "Teman dekat" },
    { initials: "BS", name: "Budi Santoso", relation: "Kakak" },
  ];
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-line bg-white/70 p-5">
        <p className="rounded-lg bg-caution-50 px-3 py-2 text-small text-main-700">
          <span className="font-semibold">Penting!</span> Kami akan melakukan verifikasi pada kontak darurat
          yang kamu daftarkan.
        </p>
        <p className="mt-4 text-card-title">Kontak Darurat</p>
        <ul className="mt-3 space-y-2">
          {contacts.map((c) => (
            <li key={c.name} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-calm text-small font-semibold text-calm-ink">
                {c.initials}
              </span>
              <span className="min-w-0 flex-1 text-small">
                <span className="block font-semibold">{c.name}</span>
                <span className="text-ink-soft">{c.relation}</span>
              </span>
              <span className="text-caption text-muted">Ubah</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-lg border border-ink/25 py-2 text-center text-button">Tambahkan</p>
      </div>
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <p className="font-semibold">Hapus Kontak Darurat?</p>
        <p className="mt-1 text-small text-ink-soft">Budi Santoso akan dihapus dari daftar kontak daruratmu.</p>
        <div className="mt-4 flex gap-2">
          <span className="flex-1 rounded-lg border border-line py-2 text-center text-button">Batal</span>
          <span className="flex-1 rounded-lg bg-alert py-2 text-center text-button text-white">Hapus Kontak</span>
        </div>
      </div>
    </div>
  );
}

export function SmsNotice() {
  const status = [
    { name: "Clara Wheeler", state: "Terkirim", ok: true },
    { name: "Budi Santoso", state: "Gagal, sedang dikirim ulang", ok: false },
  ];
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl bg-night p-5 text-paper">
        <p className="flex justify-between text-caption text-paper/75">
          <span>SMS Pemberitahuan</span>
          <span>sekarang</span>
        </p>
        <p className="mt-2 font-semibold">Pendaftaran Kontak Darurat</p>
        <p className="mt-1 text-small text-paper/85">
          Livia: Rani telah mendaftarkan nomor Anda sebagai kontak daruratnya. Anda akan menerima
          pemberitahuan terkait kondisi darurat Rani.
        </p>
      </div>
      <div className="rounded-2xl border border-line bg-white/70 p-5">
        <p className="text-small text-muted">Status pengiriman</p>
        <ul className="mt-3 space-y-2">
          {status.map((s) => (
            <li key={s.name} className="flex items-center justify-between gap-3 text-small">
              <span className="font-semibold">{s.name}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-badge ${
                  s.ok ? "bg-main-50 text-main-700" : "bg-caution-100 text-main-700"
                }`}
              >
                {s.state}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
