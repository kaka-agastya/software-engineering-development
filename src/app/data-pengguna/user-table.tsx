"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type UpdateResult, useUserAccounts } from "@/hooks/use-user-accounts";
import type { UserAccount, UserAccountUpdate } from "@/lib/validations/user-account";

/** Tabel UserAccount + dialog edit. */
export function UserTable() {
  const { users, loading, error, update } = useUserAccounts();
  // Baris yang sedang diedit (null = dialog tertutup)
  const [editing, setEditing] = useState<UserAccount | null>(null);

  if (loading) return <p className="mt-8 text-muted">Memuat data...</p>;
  if (error) {
    return (
      <p role="alert" className="mt-8 rounded-xl bg-alert-soft p-4 text-alert">
        Gagal mengambil data: {error}
      </p>
    );
  }
  if (users.length === 0) {
    return <p className="mt-8 text-muted">Belum ada data. Jalankan supabase/schema.sql untuk mengisi data contoh.</p>;
  }

  return (
    <>
      <div className="mt-8 overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Nama Panggilan</TableHead>
              <TableHead>Nomor Telepon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ambang Risiko</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-ink">{user.full_name}</TableCell>
                <TableCell>{user.nickname}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>{user.account_status === "active" ? "Aktif" : "Menunggu kontak darurat"}</TableCell>
                <TableCell>{user.risk_threshold}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setEditing(user)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>Perubahan langsung disimpan ke database Supabase.</DialogDescription>
          </DialogHeader>
          {/* key membuat form di-reset setiap kali membuka baris berbeda */}
          {editing && (
            <EditForm
              key={editing.id}
              user={editing}
              onSubmit={(values) => update(editing.id, values)}
              onSaved={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditForm({
  user,
  onSubmit,
  onSaved,
}: {
  user: UserAccount;
  onSubmit: (values: UserAccountUpdate) => Promise<UpdateResult>;
  onSaved: () => void;
}) {
  const [result, setResult] = useState<UpdateResult | null>(null);
  const [saving, setSaving] = useState(false);
  const errors = result && !result.success ? (result.fieldErrors ?? {}) : {};

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    // Ambil semua isian form menjadi objek { full_name, nickname, ... }
    const values = Object.fromEntries(new FormData(event.currentTarget)) as unknown as UserAccountUpdate;
    const res = await onSubmit(values);
    setSaving(false);
    setResult(res);
    if (res.success) onSaved(); // tutup dialog bila berhasil
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField id="full_name" label="Nama Lengkap" error={errors.full_name?.[0]}>
        <Input id="full_name" name="full_name" defaultValue={user.full_name} aria-invalid={!!errors.full_name} />
      </FormField>

      <FormField id="nickname" label="Nama Panggilan" error={errors.nickname?.[0]}>
        <Input id="nickname" name="nickname" defaultValue={user.nickname} aria-invalid={!!errors.nickname} />
      </FormField>

      <FormField id="phone_number" label="Nomor Telepon" error={errors.phone_number?.[0]}>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          defaultValue={user.phone_number}
          aria-invalid={!!errors.phone_number}
        />
      </FormField>

      <FormField id="account_status" label="Status Akun" error={errors.account_status?.[0]}>
        <select
          id="account_status"
          name="account_status"
          defaultValue={user.account_status}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="active">Aktif</option>
          <option value="pending">Menunggu kontak darurat</option>
        </select>
      </FormField>

      <FormField id="risk_threshold" label="Ambang Risiko (0 - 1)" error={errors.risk_threshold?.[0]}>
        <Input
          id="risk_threshold"
          name="risk_threshold"
          type="number"
          step="0.05"
          defaultValue={user.risk_threshold}
          aria-invalid={!!errors.risk_threshold}
        />
      </FormField>

      {result && !result.success && result.error && (
        <p role="alert" className="text-sm text-destructive">
          {result.error}
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

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
