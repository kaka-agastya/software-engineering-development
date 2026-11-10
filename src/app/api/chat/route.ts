import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insertMessageSchema } from "@/lib/validations/chat";

// Daftar kata kunci risiko tinggi sesuai FR-09 dan Use Case CDR LIVIA
const HIGH_RISK_KEYWORDS = [
  "bunuh diri",
  "mati",
  "akhiri hidup",
  "jembatan",
  "lompat",
  "menyakiti diri",
  "ga mau hidup",
  "racun",
  "terbang",
  "ingin mati",
  "capek hidup",
];

export async function GET(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = db() as any;
  const { searchParams } = new URL(request.url);
  let userId = searchParams.get("userId");

  try {
    if (!userId) {
      const { data: firstUser } = await supabase
        .from("user_account")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (firstUser) userId = firstUser.id;
    }

    if (!userId) {
      return NextResponse.json({ conversation: null, messages: [] });
    }

    let { data: conv } = await supabase
      .from("conversation")
      .select("id, user_id, start_date")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!conv) {
      const { data: newConv, error: createConvErr } = await supabase
        .from("conversation")
        .insert({ user_id: userId })
        .select("id, user_id, start_date")
        .single();

      if (createConvErr) throw createConvErr;
      conv = newConv;
    }

    const { data: messages, error: msgErr } = await supabase
      .from("chat_message")
      .select(
        `
        id,
        conversation_id,
        sender,
        content,
        created_at,
        coping_suggestion (
          id,
          title,
          suggestion_text
        )
      `,
      )
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true });

    if (msgErr) throw msgErr;

    type RawMessage = {
      id: string;
      conversation_id: string;
      sender: "user" | "ai";
      content: string;
      created_at: string;
      coping_suggestion?: {
        id: string;
        title: string;
        suggestion_text: string;
      }[];
    };

    const formattedMessages = ((messages as RawMessage[]) || []).map((m) => ({
      id: m.id,
      conversation_id: m.conversation_id,
      sender: m.sender,
      content: m.content,
      created_at: m.created_at,
      coping_suggestions: m.coping_suggestion || [],
    }));

    return NextResponse.json({
      conversation: conv,
      messages: formattedMessages,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil percakapan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = db() as any;

  try {
    const json = await request.json();
    const parsed = insertMessageSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { user_id, content } = parsed.data;
    let conversationId = parsed.data.conversation_id;

    if (!conversationId) {
      const { data: newConv, error: convErr } = await supabase
        .from("conversation")
        .insert({ user_id })
        .select("id")
        .single();

      if (convErr) throw convErr;
      conversationId = newConv.id;
    }

    // 1. Simpan pesan pengguna ke tabel chat_message
    const { error: userMsgErr } = await supabase.from("chat_message").insert({
      conversation_id: conversationId,
      sender: "user",
      content,
    });

    if (userMsgErr) throw userMsgErr;

    // 2. Analisis Indikasi Risiko Darurat (FR-09 & Alternate Flow 1 Use Case 5)
    const lowerContent = content.toLowerCase();
    const isHighRisk = HIGH_RISK_KEYWORDS.some((kw) =>
      lowerContent.includes(kw),
    );

    let aiReplyText = "";
    let suggestionData = null;

    if (isHighRisk) {
      // Sesuai CDR Frame 6: Tidak memberikan coping suggestion, melainkan fokus pada keselamatan
      aiReplyText =
        "Aku mendengar kamu sedang memikirkan hal yang sangat serius. Aku sangat peduli sama keselamatanmu. Bolehkan aku tahu, kamu sedang berada di mana sekarang?";

      // Catat ke emotion_log sebagai skor risiko tinggi
      try {
        await supabase.from("emotion_log").insert({
          user_id,
          mood: "Sangat Sedih",
          risk_score: 0.95,
          type: "Automatic",
        });
      } catch {
        // Abaikan jika struktur tabel emotion_log memiliki kolom berbeda
      }
    } else {
      // Respons normal dengan coping suggestion
      aiReplyText =
        "Aku dengar kamu sedang merasa sangat capek dan sendirian. Terima kasih sudah mau cerita ke aku. Mau aku temani sebentar?";
      suggestionData = {
        title: "Coba latihan napas sederhana",
        text: "Tarik napas 4 hitungan, tahan 4 hitungan, lalu hembuskan perlahan 6 hitungan. Ulangi 3 kali.",
      };
    }

    // 3. Simpan pesan respons AI
    const { data: aiMsg, error: aiMsgErr } = await supabase
      .from("chat_message")
      .insert({
        conversation_id: conversationId,
        sender: "ai",
        content: aiReplyText,
      })
      .select("id")
      .single();

    if (!aiMsgErr && aiMsg && suggestionData) {
      // 4. Simpan coping_suggestion bila risiko normal
      await supabase.from("coping_suggestion").insert({
        chat_message_id: aiMsg.id,
        title: suggestionData.title,
        suggestion_text: suggestionData.text,
      });
    }

    return NextResponse.json({
      success: true,
      conversationId,
      isHighRisk, // Mengirim sinyal ke client untuk memanggil Jendela Konfirmasi Darurat
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal memproses pesan";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
