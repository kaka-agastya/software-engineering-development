import "server-only";
import { z } from "zod";

/**
 * Baca body JSON lalu validasi dengan zod. Dipakai di semua Route Handler POST/PATCH.
 *
 *   const parsed = await parseBody(request, schema);
 *   if (parsed instanceof Response) return parsed; // 400
 *   parsed.data ...
 */
export async function parseBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<{ data: z.output<T> } | Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body harus berupa JSON." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ fieldErrors: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }
  return { data: parsed.data };
}

export const unauthorized = () =>
  Response.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 });
