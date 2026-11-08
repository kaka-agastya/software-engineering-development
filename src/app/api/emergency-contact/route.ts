import { parseBody, unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { notifyEmergencyContact } from "@/lib/sms";
import { emergencyContactSchema } from "@/lib/validations/emergency-contact";

/**
 * GET /api/emergency-contact
 * Daftar kontak darurat milik pengguna yang login, plus status SMS terakhir tiap kontak.
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const [contacts, notifications] = await Promise.all([
    db()
      .from("emergency_contact")
      .select("id, full_name, phone_number, relationship, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }),
    db()
      .from("notification")
      .select("emergency_contact_id, status")
      .eq("user_id", userId)
      .in("type", ["registrasi", "pembaruan"])
      .order("created_at", { ascending: false }),
  ]);
  if (contacts.error) return Response.json({ error: contacts.error.message }, { status: 500 });
  if (notifications.error) return Response.json({ error: notifications.error.message }, { status: 500 });

  // Urutan terbaru dulu, jadi yang pertama ketemu = status terakhir
  const lastStatus = new Map<string, string>();
  for (const n of notifications.data) {
    if (n.emergency_contact_id && !lastStatus.has(n.emergency_contact_id)) {
      lastStatus.set(n.emergency_contact_id, n.status);
    }
  }

  return Response.json({
    data: contacts.data.map((c) => ({ ...c, last_sms_status: lastStatus.get(c.id) ?? null })),
  });
}

/**
 * POST /api/emergency-contact
 * Menambah kontak darurat. Kontak pertama mengaktifkan akun (FR-01),
 * lalu SMS pemberitahuan registrasi dikirim (FR-03).
 *
 * Respons: 201 { sms_status } | 400 { fieldErrors } | 401 { error }
 */
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const parsed = await parseBody(request, emergencyContactSchema);
  if (parsed instanceof Response) return parsed;

  const { data: user, error: userError } = await db()
    .from("user_account")
    .select("full_name, account_status")
    .eq("id", userId)
    .maybeSingle();
  if (userError) return Response.json({ error: userError.message }, { status: 500 });
  if (!user) return unauthorized();

  const { data: contact, error } = await db()
    .from("emergency_contact")
    .insert({ ...parsed.data, user_id: userId })
    .select("id, phone_number")
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  if (user.account_status === "pending") {
    await db().from("user_account").update({ account_status: "active" }).eq("id", userId);
  }

  const sms_status = await notifyEmergencyContact({
    userId,
    userFullName: user.full_name,
    contact,
    type: "registrasi",
  });
  return Response.json({ sms_status }, { status: 201 });
}
