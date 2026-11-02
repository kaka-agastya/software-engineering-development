import Link from "next/link";

export function CrisisStrip() {
  return (
    <div className="bg-alert text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-small">
        <p>
          Kamu dalam bahaya, atau terpikir untuk menyakiti diri?{" "}
          <a href="tel:112" className="font-semibold underline underline-offset-2">
            Telepon 112 sekarang
          </a>
          .
        </p>
        <Link href="/privasi#bantuan" className="underline underline-offset-2">
          Lihat layanan bantuan lainnya
        </Link>
      </div>
    </div>
  );
}
