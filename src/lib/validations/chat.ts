import { z } from "zod";

/** Skema validasi saat mengirim pesan baru (Insert Form) */
export const insertMessageSchema = z.object({
  user_id: z.string().uuid("ID Pengguna tidak valid"),
  conversation_id: z.string().uuid().optional(),
  content: z
    .string()
    .trim()
    .min(1, "Pesan tidak boleh kosong")
    .max(1000, "Pesan maksimal 1000 karakter"),
});

export type InsertMessageInput = z.infer<typeof insertMessageSchema>;

export type CopingSuggestionItem = {
  id: string;
  title: string;
  suggestion_text: string;
};

export type ChatMessageItem = {
  id: string;
  conversation_id: string;
  sender: "user" | "ai";
  content: string;
  created_at: string;
  coping_suggestions?: CopingSuggestionItem[];
};
