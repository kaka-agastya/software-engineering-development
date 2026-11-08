"use client";

import { useEffect, useState } from "react";
import { type ApiResult, sendJson } from "@/lib/send-json";
import type { EmergencyContact, EmergencyContactInput, SmsStatus } from "@/lib/validations/emergency-contact";

export type SaveResult = ApiResult<{ sms_status: SmsStatus }>;

/**
 * Mengambil & mengubah kontak darurat milik pengguna yang login.
 *
 *   const { contacts, loading, error, create, update, remove } = useEmergencyContacts();
 */
export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  // Naikkan angka ini untuk mengambil ulang data
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    sendJson<{ data: EmergencyContact[] }>("/api/emergency-contact", "GET").then((res) => {
      if (ignore) return;
      if (res.ok) {
        setContacts(res.data);
        setError(null);
      } else if (res.status === 401) {
        setUnauthorized(true);
      } else {
        setError(res.error ?? "Gagal mengambil kontak darurat.");
      }
      setLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  async function create(values: EmergencyContactInput): Promise<SaveResult> {
    const res = await sendJson<{ sms_status: SmsStatus }>("/api/emergency-contact", "POST", values);
    if (res.ok) reload();
    return res;
  }

  async function update(id: string, values: EmergencyContactInput): Promise<SaveResult> {
    const res = await sendJson<{ sms_status: SmsStatus }>(`/api/emergency-contact/${id}`, "PATCH", values);
    if (res.ok) reload();
    return res;
  }

  async function remove(id: string) {
    const res = await sendJson(`/api/emergency-contact/${id}`, "DELETE");
    if (res.ok) reload();
    return res;
  }

  return { contacts, loading, error, unauthorized, create, update, remove };
}
