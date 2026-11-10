import type { Metadata } from "next";
import { CheckInForm } from "./check-in-form";

export const metadata: Metadata = {
  title: "Check-In Harian",
  description: "Kenali dan catat perasaan serta kondisimu hari ini bersama LIVIA.",
};

export default function CheckInPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <CheckInForm />
    </section>
  );
}
