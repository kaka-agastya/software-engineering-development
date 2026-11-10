import { z } from "zod";

export const MOODS = [
  { value: "sangat_sedih", label: "Sangat Buruk", emoji: "😭" },
  { value: "sedih", label: "Buruk", emoji: "🙁" },
  { value: "netral", label: "Biasa", emoji: "😐" },
  { value: "senang", label: "Baik", emoji: "🙂" },
  { value: "sangat_senang", label: "Sangat Baik", emoji: "😀" },
] as const;

export type MoodValue = (typeof MOODS)[number]["value"];

export const FACTORS = [
  "Pekerjaan",
  "Hubungan",
  "Keuangan",
  "Kesehatan",
  "Keluarga",
  "Tidur",
  "Lainnya",
] as const;

export type FactorValue = (typeof FACTORS)[number];

/**
 * Mendapatkan informasi label dan emoji berdasarkan nilai mood yang tersimpan di database.
 *
 * @param mood Nilai mood dari database (contoh: 'senang', 'sedih').
 * @returns Objek yang memuat value, label, dan emoji representatif.
 */
export function getMoodInfo(mood: string | null) {
  return (
    MOODS.find((m) => m.value === mood) ?? {
      value: mood ?? "",
      label: mood ?? "-",
      emoji: "📝",
    }
  );
}

const moodValues = MOODS.map((m) => m.value) as [MoodValue, ...MoodValue[]];

export const checkInSchema = z.object({
  mood: z.enum(moodValues, { message: "Pilih mood kamu." }),
  influencing_factor: z.array(z.string()).default([]),
  note: z
    .string()
    .trim()
    .max(500, "Maksimal 500 karakter.")
    .optional()
    .or(z.literal("")),
});

export type CheckInInput = z.input<typeof checkInSchema>;

export type CheckInItem = {
  id: string;
  user_id: string;
  schedule_id: string | null;
  scheduled_for: string;
  status: "Menunggu" | "Dijawab" | "Terlewat";
  mood: MoodValue | null;
  influencing_factor: string[];
  note: string | null;
  response_time: string | null;
};
