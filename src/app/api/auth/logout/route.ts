import { endSession } from "@/lib/session";

/** POST /api/auth/logout */
export async function POST() {
  await endSession();
  return Response.json({ success: true });
}
