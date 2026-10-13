import type { SeminarRow } from "@/src/data/mockSeminar";

export const SEMINAR_MONTHS = [
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export type SeminarMonth = (typeof SEMINAR_MONTHS)[number];
export type MonthFilter = "Semua" | SeminarMonth;

const MONTH_ALIASES: Record<string, SeminarMonth> = {
  juli: "Juli",
  july: "Juli",
  "7": "Juli",
  agustus: "Agustus",
  august: "Agustus",
  agu: "Agustus",
  "8": "Agustus",
  september: "September",
  sep: "September",
  "9": "September",
  oktober: "Oktober",
  october: "Oktober",
  okt: "Oktober",
  "10": "Oktober",
  november: "November",
  nov: "November",
  "11": "November",
  desember: "Desember",
  december: "Desember",
  des: "Desember",
  "12": "Desember",
};

const CHECKED_VALUES = new Set([
  "true",
  "yes",
  "ya",
  "y",
  "1",
  "checked",
  "centang",
  "tercentang",
  "✓",
  "✔",
  "☑",
  "v",
  "done",
  "selesai",
  "aktif",
  "ok",
  "lengkap",
]);

export function roundPercent(value: number): number {
  return Math.round(value * 100) / 100;
}

export function parseChecklist(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return false;
  return CHECKED_VALUES.has(raw);
}

/** Parses `100.00%`, `66,67%`, or a 0–1 ratio into a 0–100 number. */
export function parsePercent(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 0 && value <= 1) return roundPercent(value * 100);
    return roundPercent(value);
  }

  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const hasPercent = raw.includes("%");
  const normalized = raw.replace("%", "").replace(/\s/g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  if (hasPercent || n > 1) return roundPercent(n);
  if (n > 0 && n <= 1) return roundPercent(n * 100);
  return roundPercent(n);
}

export function deriveTotal(
  wet: boolean,
  wtt: boolean,
  podcast: boolean
): number {
  const done = Number(wet) + Number(wtt) + Number(podcast);
  return roundPercent((done / 3) * 100);
}

export function canonicalMonth(value: string): string {
  const key = value.trim().toLowerCase();
  return MONTH_ALIASES[key] ?? value.trim();
}

export function normalizePekan(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^(?:pekan|week|minggu)\s*([1-4])$/i);
  if (match) return `Pekan ${match[1]}`;
  const bare = trimmed.match(/^([1-4])$/);
  if (bare) return `Pekan ${bare[1]}`;
  return trimmed;
}

export function weekIndex(pekan: string): number {
  const match = pekan.match(/(\d+)/);
  return match ? Number(match[1]) : 99;
}

export function monthIndex(bulan: string): number {
  const idx = SEMINAR_MONTHS.indexOf(bulan as SeminarMonth);
  return idx === -1 ? 99 : idx;
}

export function formatPct(value: number): string {
  const digits = Number.isInteger(value) ? 0 : 2;
  return `${value.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: 2,
  })}%`;
}

export type ProgressTone = "complete" | "partial" | "low";

export function progressTone(total: number): ProgressTone {
  if (total >= 99.5) return "complete";
  if (total >= 66) return "partial";
  return "low";
}

export interface ProgramStatus {
  aktif: number;
  total: number;
  persen: number;
}

export interface SeminarStats {
  rataRata: number;
  pekanSelesai: number;
  totalPekan: number;
  wet: ProgramStatus;
  wtt: ProgramStatus;
  podcast: ProgramStatus;
}

function programStatus(
  rows: SeminarRow[],
  key: "wet" | "wtt" | "podcast"
): ProgramStatus {
  const aktif = rows.filter((row) => row[key]).length;
  const total = rows.length;
  return {
    aktif,
    total,
    persen: total ? roundPercent((aktif / total) * 100) : 0,
  };
}

export function computeSeminarStats(rows: SeminarRow[]): SeminarStats {
  const totalPekan = rows.length;
  const rataRata = totalPekan
    ? roundPercent(rows.reduce((sum, row) => sum + row.total, 0) / totalPekan)
    : 0;

  return {
    rataRata,
    pekanSelesai: rows.filter((row) => row.total >= 99.5).length,
    totalPekan,
    wet: programStatus(rows, "wet"),
    wtt: programStatus(rows, "wtt"),
    podcast: programStatus(rows, "podcast"),
  };
}

export function filterByMonth(
  rows: SeminarRow[],
  month: MonthFilter
): SeminarRow[] {
  const filtered = month === "Semua" ? rows : rows.filter((row) => row.bulan === month);
  return [...filtered].sort((a, b) => {
    const byMonth = monthIndex(a.bulan) - monthIndex(b.bulan);
    if (byMonth !== 0) return byMonth;
    return weekIndex(a.pekan) - weekIndex(b.pekan);
  });
}

export interface SeminarTrendPoint {
  bulan: string;
  label: string;
  rataRata: number;
  jumlahPekan: number;
}

const SHORT_MONTH: Record<string, string> = {
  Juli: "Jul",
  Agustus: "Agu",
  September: "Sep",
  Oktober: "Okt",
  November: "Nov",
  Desember: "Des",
};

export function buildMonthlyTrend(rows: SeminarRow[]): SeminarTrendPoint[] {
  return SEMINAR_MONTHS.map((bulan) => {
    const group = rows.filter((row) => row.bulan === bulan);
    const rataRata = group.length
      ? roundPercent(
          group.reduce((sum, row) => sum + row.total, 0) / group.length
        )
      : 0;
    return {
      bulan,
      label: SHORT_MONTH[bulan] ?? bulan,
      rataRata,
      jumlahPekan: group.length,
    };
  });
}

export interface SeminarMonthGroup {
  bulan: string;
  rows: SeminarRow[];
}

export function groupByMonth(rows: SeminarRow[]): SeminarMonthGroup[] {
  const order = [
    ...SEMINAR_MONTHS,
    ...rows
      .map((row) => row.bulan)
      .filter(
        (bulan, index, all) =>
          !SEMINAR_MONTHS.includes(bulan as SeminarMonth) &&
          all.indexOf(bulan) === index
      ),
  ];

  return order
    .map((bulan) => ({
      bulan,
      rows: rows
        .filter((row) => row.bulan === bulan)
        .sort((a, b) => weekIndex(a.pekan) - weekIndex(b.pekan)),
    }))
    .filter((group) => group.rows.length > 0);
}
