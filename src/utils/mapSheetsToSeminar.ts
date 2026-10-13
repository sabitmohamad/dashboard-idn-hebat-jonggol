import type { SeminarRow } from "@/src/data/mockSeminar";
import {
  canonicalMonth,
  deriveTotal,
  normalizePekan,
  parseChecklist,
  parsePercent,
} from "@/lib/seminar";

/**
 * Indeks kolom tab `Seminar_Report` (A = 0 … F = 5).
 * A bulan | B kelas_jurusan / pekan | C wet | D wtt | E podcast | F total
 */

const HEADER_BULAN = new Set(["bulan", "month", "periode", "no", "no."]);
const HEADER_PEKAN = new Set([
  "pekan",
  "kelas",
  "kelas_jurusan",
  "kelas / jurusan",
  "kelas jurusan",
  "minggu",
  "week",
]);

function cell(row: unknown[], index: number): unknown {
  return row[index];
}

function text(row: unknown[], index: number): string {
  const value = cell(row, index);
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function mapRow(row: unknown[], carryBulan: string): SeminarRow | null {
  const bulanRaw = text(row, 0);
  const pekanRaw = text(row, 1);

  if (
    HEADER_BULAN.has(bulanRaw.toLowerCase()) ||
    HEADER_PEKAN.has(pekanRaw.toLowerCase())
  ) {
    return null;
  }

  // Merged month cells only store the label on the first week of the group.
  const bulan = canonicalMonth(bulanRaw) || carryBulan;
  if (!bulan && !pekanRaw) return null;

  const wet = parseChecklist(cell(row, 2));
  const wtt = parseChecklist(cell(row, 3));
  const podcast = parseChecklist(cell(row, 4));
  const parsedTotal = parsePercent(cell(row, 5));

  return {
    bulan,
    pekan: normalizePekan(pekanRaw),
    wet,
    wtt,
    podcast,
    total: parsedTotal ?? deriveTotal(wet, wtt, podcast),
  };
}

export function mapSheetsRowsToSeminar(rows: unknown[][]): SeminarRow[] {
  const mapped: SeminarRow[] = [];
  let carryBulan = "";

  for (const row of rows) {
    const item = mapRow(row, carryBulan);
    if (!item) continue;
    if (item.bulan) carryBulan = item.bulan;
    mapped.push(item);
  }

  return mapped;
}
