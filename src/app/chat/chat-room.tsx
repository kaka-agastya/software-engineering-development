"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useChat } from "@/hooks/use-chat";

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

export function ChatRoom() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const resMe = await fetch("/api/me");
        if (resMe.ok) {
          const dataMe = await resMe.json();
          if (dataMe?.user?.id) {
            setCurrentUser({
              id: dataMe.user.id,
              name: dataMe.user.nickname || dataMe.user.full_name,
            });
            return;
          }
        }
      } catch {
        // Fallback
      }

      try {
        const resUsers = await fetch("/api/user-account");
        if (resUsers.ok) {
          const dataUsers = await resUsers.json();
          const list = dataUsers?.data || [];
          if (list.length > 0) {
            setCurrentUser({
              id: list[0].id,
              name: list[0].nickname || list[0].full_name,
            });
          }
        }
      } catch {
        // Fallback
      }
    }
    void loadUser();
  }, []);

  const { messages, loading, error, sending, sendMessage } = useChat(
    currentUser?.id,
  );
  const [text, setText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Prosedur Darurat (Countdown 10 Detik sesuai CDR)
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [emergencySent, setEmergencySent] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, emergencyActive]);

  useEffect(() => {
    if (!emergencyActive || emergencySent) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const finishTimer = setTimeout(() => {
        setEmergencySent(true);
      }, 0);
      return () => clearTimeout(finishTimer);
    }
  }, [emergencyActive, countdown, emergencySent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    if (!currentUser?.id) {
      setFormError("Menyambungkan ke akun...");
      return;
    }

    setFormError(null);
    const contentToSend = text;
    setText("");

    const isRisky = HIGH_RISK_KEYWORDS.some((kw) =>
      contentToSend.toLowerCase().includes(kw),
    );
    if (isRisky) {
      setEmergencyActive(true);
      setCountdown(10);
      setEmergencySent(false);
    }

    const res = await sendMessage(contentToSend, currentUser.id);
    if (!res.success) {
      setFormError(res.error || "Gagal mengirim pesan.");
      setText(contentToSend);
    }
  }

  function handleManualEmergency() {
    setEmergencyActive(true);
    setCountdown(10);
    setEmergencySent(false);
  }

  function handleCancelEmergency() {
    setEmergencyActive(false);
    setCountdown(10);
    setEmergencySent(false);
  }

  return (
    <div className="w-full max-w-95 sm:max-w-100 mx-auto px-1 sm:px-0">
      <PhoneFrame label="Ruang Curhat LIVIA">
        <div className="flex h-127.5 w-full flex-col justify-between px-3 py-3 text-ink">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-paper">
                LV
              </div>
              <div className="leading-tight text-left">
                <p className="text-xs font-bold text-ink">LIVIA AI</p>
                <p className="text-[10px] text-ink-soft truncate max-w-35">
                  {currentUser
                    ? `Pengguna: ${currentUser.name}`
                    : "Menyambungkan..."}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Aktif
            </span>
          </div>

          {/* Jendela Konfirmasi Darurat (Storyboard CDR) */}
          {emergencyActive && (
            <div className="my-2 rounded-xl border border-red-300 bg-red-50 p-2.5 text-left shadow-sm">
              {!emergencySent ? (
                <>
                  <div className="flex items-start gap-1.5 text-red-800">
                    <span className="text-xs">⚠️</span>
                    <div>
                      <h4 className="text-[11px] font-bold leading-none">
                        Peringatan!
                      </h4>
                      <p className="mt-1 text-[9px] leading-tight text-red-700">
                        Kondisi darurat terdeteksi. Livia akan mengirimkan
                        notifikasi ke kontak darurat.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelEmergency}
                      className="flex-1 rounded-md border border-red-300 bg-white py-1 text-[10px] font-semibold text-red-700 hover:bg-red-50"
                    >
                      Batalkan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmergencySent(true)}
                      className="flex-1 rounded-md bg-[#d32f2f] py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-red-700"
                    >
                      Konfirmasi {countdown}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-red-900 py-1">
                  <p className="text-[11px] font-bold">Notifikasi Terkirim!</p>
                  <p className="text-[9px] text-red-700 mt-0.5">
                    Informasi keadaan darurat dan lokasi Anda berhasil dikirim
                    ke kontak darurat.
                  </p>
                  <button
                    type="button"
                    onClick={handleCancelEmergency}
                    className="mt-1.5 rounded bg-ink px-2.5 py-0.5 text-[9px] text-paper"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Area Riwayat Pesan */}
          <div className="flex-1 space-y-2.5 overflow-y-auto py-2 text-xs scrollbar-none [&::-webkit-scrollbar]:hidden">
            {loading && (
              <div className="flex h-32 items-center justify-center text-[11px] text-ink-soft">
                Memuat percakapan...
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-center text-[10px] text-red-600">
                {error}
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="flex h-36 flex-col items-center justify-center text-center text-ink-soft">
                <p className="font-medium text-ink">Mulai Cerita</p>
                <p className="mt-0.5 text-[10px]">
                  Tuliskan apa yang sedang kamu rasakan.
                </p>
              </div>
            )}

            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[11px] leading-relaxed shadow-sm ${
                      isUser
                        ? "rounded-br-sm bg-ink text-paper"
                        : "rounded-bl-sm border border-line bg-paper text-ink"
                    }`}
                  >
                    <p>{m.content}</p>
                  </div>

                  {m.coping_suggestions && m.coping_suggestions.length > 0 && (
                    <div className="mt-1.5 max-w-[90%] space-y-1">
                      {m.coping_suggestions.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-xl border border-[#ebdcb9] bg-[#fbf4e8] p-2.5 text-[10px] text-[#6d4f21] text-left"
                        >
                          <p className="font-bold text-[#543b14]">{s.title}</p>
                          <p className="mt-0.5 leading-snug text-[#685336]">
                            {s.suggestion_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Bar Bawah */}
          <form onSubmit={handleSubmit} className="w-full pt-2">
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                onClick={handleManualEmergency}
                title="Aktifkan Tombol Darurat"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#d32f2f] text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition"
              >
                !
              </button>

              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis pesan kamu disini..."
                disabled={sending || !currentUser}
                className="h-8 min-w-0 flex-1 rounded-full border border-line bg-paper px-3 text-[11px] text-ink outline-none placeholder:text-ink-soft/70 focus:border-ink"
              />

              <button
                type="submit"
                disabled={sending || !text.trim() || !currentUser}
                className="flex h-8 shrink-0 items-center justify-center rounded-full bg-[#103742] px-3.5 text-[11px] font-semibold text-white transition-opacity disabled:opacity-40"
              >
                {sending ? "..." : "Kirim"}
              </button>
            </div>
            {formError && (
              <p className="mt-1 text-center text-[9px] text-red-500">
                {formError}
              </p>
            )}
          </form>
        </div>
      </PhoneFrame>
    </div>
  );
}
