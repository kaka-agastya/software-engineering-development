import { parseBody, unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { notifyEmergencyContact } from "@/lib/sms";
import { emergencyContactSchema } from "@/lib/validations/emergency-contact";

const notFound = () => Response.json({ error: "Kontak tidak ditemukan." }, { status: 404 });

/**
 * PATCH /api/emergency-contact/:id
 * Mengubah kontak milik pengguna yang login, lalu mengirim SMS pemberitahuan pembaruan (FR-05).
 *
 * Respons: 200 { sms_status } | 400 { fieldErrors } | 401 | 404
 */
export async function PATCH(request: Request, ctx: RouteContext<"/api/emergency-contact/[id]">) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();
  const { id } = await ctx.params;

  const parsed = await parseBody(request, emergencyContactSchema);
  if (parsed instanceof Response) return parsed;

  const { data, error } = await db()
    .from("emergency_contact")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", userId) // hanya kontak milik sendiri
    .select("id, phone_number");
  if (error) return error.code === "22P02" ? notFound() : Response.json({ error: error.message }, { status: 500 });
  if (data.length === 0) return notFound();

  const { data: user } = await db().from("user_account").select("full_name").eq("id", userId).single();
  const sms_status = await notifyEmergencyContact({
    userId,
    userFullName: user?.full_name ?? "pengguna LIVIA",
    contact: data[0],
    type: "pembaruan",
  });
  return Response.json({ sms_status });
}

/**
 * DELETE /api/emergency-contact/:id
 * Menghapus kontak milik pengguna yang login.
 * Kontak terakhir tidak bisa dihapus karena akun wajib punya minimal satu (FR-01).
 *
 * Respons: 200 { success: true } | 401 | 404 | 409 { error }
 */
export async function DELETE(_request: Request, ctx: RouteContext<"/api/emergency-contact/[id]">) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();
  const { id } = await ctx.params;

  const { count, error: countError } = await db()
    .from("emergency_contact")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (countError) return Response.json({ error: countError.message }, { status: 500 });
  if ((count ?? 0) <= 1) {
    return Response.json(
      { error: "Minimal satu kontak darurat harus tersimpan. Tambahkan kontak lain dulu sebelum menghapus." },
      { status: 409 },
    );
  }

  const { data, error } = await db()
    .from("emergency_contact")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");
  if (error) return error.code === "22P02" ? notFound() : Response.json({ error: error.message }, { status: 500 });
  if (data.length === 0) return notFound();

  return Response.json({ success: true });
}
