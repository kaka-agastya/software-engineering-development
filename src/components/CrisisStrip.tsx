import Link from "next/link";

export function CrisisStrip() {
  return (
    <div className="bg-alert-soft text-alert-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-small">
        <p>
          Sedang dalam bahaya atau berpikir untuk menyakiti diri?{" "}
          <a href="tel:112" className="font-semibold underline underline-offset-2">
            Hubungi 112 sekarang
          </a>
          .
        </p>
        <Link href="/privasi#bantuan" className="underline underline-offset-2">
          Layanan bantuan lain
        </Link>
      </div>
    </div>
  );
}
