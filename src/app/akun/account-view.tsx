"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormField, fieldAria } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type SaveResult, useEmergencyContacts } from "@/hooks/use-emergency-contacts";
import { sendJson } from "@/lib/send-json";
import type { CurrentUser, FieldErrors } from "@/lib/validations/auth";
import {
  type EmergencyContact,
  type EmergencyContactInput,
  relationshipOptions,
  type SmsStatus,
} from "@/lib/validations/emergency-contact";

const smsLabel: Record<SmsStatus, { text: string; className: string }> = {
  sent: { text: "SMS terkirim", className: "bg-main-50 text-main-700" },
  pending: { text: "SMS menunggu", className: "bg-caution-100 text-main-700" },
  failed: { text: "SMS gagal", className: "bg-alert-soft text-alert-ink" },
};

/** Pesan setelah simpan, sesuai alternate flow "SMS gagal dikirim". */
function smsMessage(status: SmsStatus, phone: string) {
  return status === "sent"
    ? `Kontak tersimpan. SMS pemberitahuan terkirim ke ${phone}.`
    : `Kontak tersimpan, tetapi SMS pemberitahuan ke ${phone} tidak dapat dikirim.`;
}

export function AccountView() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userReloadKey, setUserReloadKey] = useState(0);
  const { contacts, loading, error, unauthorized, create, update, remove } = useEmergencyContacts();

  // Dialog tambah/ubah: null = tertutup, "new" = tambah, objek = ubah kontak itu
  const [editing, setEditing] = useState<EmergencyContact | "new" | null>(null);
  const [deleting, setDeleting] = useState<EmergencyContact | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    sendJson<{ data: CurrentUser }>("/api/me", "GET").then((res) => {
      if (res.ok) setUser(res.data);
      else router.replace("/masuk");
    });
  }, [router, userReloadKey]);

  useEffect(() => {
    if (unauthorized) router.replace("/masuk");
  }, [unauthorized, router]);

  async function logout() {
    await sendJson("/api/auth/logout", "POST");
    router.push("/masuk");
  }

  async function save(values: EmergencyContactInput): Promise<SaveResult> {
    const res = editing && editing !== "new" ? await update(editing.id, values) : await create(values);
    if (res.ok) {
      setNotice(smsMessage(res.sms_status, String(values.phone_number)));
      setEditing(null);
      setUserReloadKey((k) => k + 1); // status akun bisa berubah jadi aktif
    }
    return res;
  }

  if (!user || loading) return <p className="text-muted">Memuat akun...</p>;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display">Halo, {user.nickname}</h1>
          <p className="mt-2 text-ink-soft">
            {user.full_name}, {user.phone_number}
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Keluar
        </Button>
      </div>

      {user.account_status === "pending" && (
        <p className="mt-8 rounded-2xl border border-caution-700 bg-caution-50 p-5 text-ink">
          <span className="font-semibold">Akunmu belum aktif penuh.</span> Tambahkan minimal satu kontak
          darurat, yaitu orang yang akan dihubungi saat kamu butuh bantuan.
        </p>
      )}

      <section className="mt-10 rounded-3xl bg-paper-deep p-7 md:p-9" aria-labelledby="judul-kontak">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="judul-kontak" className="text-heading">
            Kontak Darurat
          </h2>
          <Button onClick={() => setEditing("new")}>Tambah kontak</Button>
        </div>
        <p className="mt-2 text-small text-ink-soft">
          Setiap kontak yang ditambahkan atau diubah akan menerima SMS pemberitahuan.
        </p>

        {notice && (
          <p role="status" className="mt-5 rounded-lg bg-white px-4 py-3 text-small text-ink">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-alert-soft px-4 py-3 text-small text-alert-ink">
            {error}
          </p>
        )}

        {contacts.length === 0 ? (
          <p className="mt-6 text-ink-soft">Belum ada kontak darurat.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {contacts.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{c.full_name}</p>
                  <p className="text-small text-ink-soft">
                    {c.relationship}, {c.phone_number}
                  </p>
                </div>
                {c.last_sms_status && (
                  <span className={`rounded-full px-2.5 py-0.5 text-badge ${smsLabel[c.last_sms_status].className}`}>
                    {smsLabel[c.last_sms_status].text}
                  </span>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(c)}>
                    Ubah
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleting(c)}>
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Tambah Kontak Darurat" : "Ubah Kontak Darurat"}</DialogTitle>
            <DialogDescription>Kontak akan menerima SMS pemberitahuan setelah disimpan.</DialogDescription>
          </DialogHeader>
          {/* key membuat form di-reset setiap kali membuka kontak berbeda */}
          {editing && (
            <ContactForm
              key={editing === "new" ? "new" : editing.id}
              contact={editing === "new" ? null : editing}
              onSubmit={save}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kontak Darurat?</DialogTitle>
            <DialogDescription>
              {deleting?.full_name} akan dihapus dari daftar kontak daruratmu.
            </DialogDescription>
          </DialogHeader>
          {deleting && (
            <DeleteConfirm
              key={deleting.id}
              onCancel={() => setDeleting(null)}
              onConfirm={async () => {
                const res = await remove(deleting.id);
                if (res.ok) {
                  setNotice(`${deleting.full_name} dihapus dari kontak darurat.`);
                  setDeleting(null);
                }
                return res.ok ? null : (res.error ?? "Gagal menghapus kontak.");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ContactForm({
  contact,
  onSubmit,
}: {
  contact: EmergencyContact | null;
  onSubmit: (values: EmergencyContactInput) => Promise<SaveResult>;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget)) as unknown as EmergencyContactInput;
    setSaving(true);
    const res = await onSubmit(values);
    setSaving(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setMessage(res.error ?? null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField id="contact_full_name" label="Nama Lengkap" error={errors.full_name?.[0]}>
        <Input
          id="contact_full_name"
          name="full_name"
          defaultValue={contact?.full_name}
          {...fieldAria("contact_full_name", errors.full_name?.[0])}
        />
      </FormField>
      <FormField
        id="contact_phone_number"
        label="Nomor Telepon"
        hint="Dengan kode negara, contoh: +6281234567890"
        error={errors.phone_number?.[0]}
      >
        <Input
          id="contact_phone_number"
          name="phone_number"
          type="tel"
          defaultValue={contact?.phone_number}
          {...fieldAria("contact_phone_number", errors.phone_number?.[0], true)}
        />
      </FormField>
      <FormField id="contact_relationship" label="Hubungan" error={errors.relationship?.[0]}>
        <select
          id="contact_relationship"
          name="relationship"
          defaultValue={contact?.relationship ?? ""}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          {...fieldAria("contact_relationship", errors.relationship?.[0])}
        >
          <option value="" disabled>
            Pilih hubungan
          </option>
          {/* Nilai lama yang tidak ada di daftar tetap ditampilkan */}
          {[...new Set([...relationshipOptions, ...(contact ? [contact.relationship] : [])])].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </FormField>

      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function DeleteConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => Promise<string | null>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button
          className="bg-alert text-white hover:bg-alert/90"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(await onConfirm());
            setBusy(false);
          }}
        >
          {busy ? "Menghapus..." : "Hapus Kontak"}
        </Button>
      </DialogFooter>
    </>
  );
}
