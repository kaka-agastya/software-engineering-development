import type { Metadata } from "next";
import { ChatRoom } from "./chat-room";

export const metadata: Metadata = {
  title: "Percakapan - LIVIA",
  description:
    "Ruang aman untuk bercerita dan mendapatkan saran penanganan emosional.",
};

export default function ChatPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#fdfbf7] py-6 sm:py-10 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-items-center">
          {/* Kolom Kiri: Penjelasan Produk (Desktop) */}
          <div className="w-full max-w-xl hidden lg:flex flex-col justify-center space-y-6 lg:col-span-6 text-left">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8d0c2] bg-[#f5efe4] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#103742]">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Ruang Teman Cerita
            </span>

            <h1 className="text-3xl font-bold tracking-tight text-[#103742] sm:text-4xl lg:text-5xl leading-tight">
              Ceritakan harimu tanpa rasa khawatir.
            </h1>

            <p className="text-base text-[#5a6b7c] leading-relaxed">
              LIVIA hadir untuk mendengarkan tanpa menghakimi, memahami saat
              kamu merasa lelah, serta memberikan langkah sederhana untuk
              meredakan beban pikiranmu secara perlahan.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 rounded-2xl border border-[#e8dfcf] bg-white/70 p-3.5 shadow-sm">
                <span className="text-lg">🌿</span>
                <div>
                  <h2 className="text-sm font-semibold text-[#103742]">
                    Dukungan Empati Nyata
                  </h2>
                  <p className="text-xs text-[#5a6b7c] mt-0.5">
                    Respon yang mengutamakan ketenangan dan validasi terhadap
                    emosimu saat ini.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-[#e8dfcf] bg-white/70 p-3.5 shadow-sm">
                <span className="text-lg">💡</span>
                <div>
                  <h2 className="text-sm font-semibold text-[#103742]">
                    Saran Penanganan Praktis
                  </h2>
                  <p className="text-xs text-[#5a6b7c] mt-0.5">
                    Latihan pernapasan, relaksasi otot, hingga teknik grounding
                    yang langsung bisa dipraktikkan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan / Tampilan Utama di Layar HP */}
          <div className="w-full flex flex-col items-center justify-center lg:col-span-6">
            {/* Header Ringkas Khusus Tampilan Layar HP */}
            <div className="mb-4 text-center lg:hidden">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d8d0c2] bg-[#f5efe4] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#103742]">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ruang Teman Cerita
              </span>
              <h1 className="mt-2 text-xl font-bold text-[#103742]">
                Bagaimana perasaanmu saat ini?
              </h1>
              <p className="mt-1 text-xs text-[#5a6b7c] max-w-xs mx-auto">
                Ceritakan pelan-pelan, kamu tidak sendirian menghadapinya.
              </p>
            </div>

            <ChatRoom />
          </div>
        </div>
      </div>
    </main>
  );
}
