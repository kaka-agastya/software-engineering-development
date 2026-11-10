import { connection } from "next/server";
import { parseBody, unauthorized } from "@/lib/api";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { checkInSchema } from "@/lib/validations/check-in";

/**
 * Mengambil daftar riwayat check-in milik pengguna yang sedang login.
 * Data difilter hanya yang berstatus "Dijawab" dan diurutkan berdasarkan waktu respons terbaru.
 *
 * @param request Request dengan opsional query parameter `limit` (default: 50, maks: 100).
 * @returns JSON Response berisi array riwayat check-in atau pesan error.
 */
export async function GET(request: Request) {
  await connection();

  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const url = new URL(request.url);
  const limitParam = parseInt(url.searchParams.get("limit") ?? "50", 10);
  const limit = Math.min(Math.max(Number.isNaN(limitParam) ? 50 : limitParam, 1), 100);

  const { data, error } = await db()
    .from("check_in")
    .select("id, user_id, schedule_id, scheduled_for, status, mood, influencing_factor, note, response_time")
    .eq("user_id", userId)
    .eq("status", "Dijawab")
    .order("response_time", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data: data ?? [] });
}

/**
 * Menyimpan data check-in harian pengguna dan mencatat log emosi terkait.
 * Jika pencatatan pada emotion_log gagal, data check_in yang baru dibuat akan dihapus kembali (rollback).
 *
 * @param request Request dengan body JSON sesuai skema checkInSchema.
 * @returns JSON Response status 201 dengan ID check-in, atau respons error (400, 401, 500).
 */
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const parsed = await parseBody(request, checkInSchema);
  if (parsed instanceof Response) return parsed;

  const now = new Date().toISOString();
  const noteContent = parsed.data.note?.trim() ? parsed.data.note.trim() : null;

  const { data: checkIn, error: checkInError } = await db()
    .from("check_in")
    .insert({
      user_id: userId,
      schedule_id: null,
      scheduled_for: now,
      status: "Dijawab",
      mood: parsed.data.mood,
      influencing_factor: parsed.data.influencing_factor,
      note: noteContent,
      response_time: now,
    })
    .select("id")
    .single();

  if (checkInError) {
    return Response.json({ error: checkInError.message }, { status: 500 });
  }

  const { error: emotionError } = await db()
    .from("emotion_log")
    .insert({
      user_id: userId,
      type: "Check-in",
      mood: parsed.data.mood,
      note: noteContent,
      risk_score: 0,
      timestamp: now,
    });

  if (emotionError) {
    await db().from("check_in").delete().eq("id", checkIn.id);
    return Response.json({ error: emotionError.message }, { status: 500 });
  }

  return Response.json({ data: { id: checkIn.id } }, { status: 201 });
}
