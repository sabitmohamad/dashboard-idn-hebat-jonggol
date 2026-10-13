import {
  TABUNGAN_MONTHS,
  withTotal,
  type TabunganMonth,
  type TabunganSiswa,
} from "@/src/data/tabungan";

/**
 * Indeks kolom tab `Tabungan_Log` / `Tabungan` (A = 0):
 *   A no | B nama | C kelas | D juli … O juni
 *
 * Jika ada baris header berisi "Nama", posisi kolom bulan dibaca dari header
 * (toleran terhadap singkatan "Agt", "Sept", "Okt", dst.); jika tidak, dipakai
 * posisi default D–O.
 */

const NO_INDEX = 0;
const NAMA_INDEX = 1;
const KELAS_INDEX = 2;
const FIRST_MONTH_INDEX = 3;

const MONTH_PREFIXES: Record<TabunganMonth, string[]> = {
  juli: ["jul"],
  agustus: ["agu", "agt", "aug"],
  september: ["sep"],
  oktober: ["okt", "oct"],
  november: ["nov"],
  desember: ["des", "dec"],
  januari: ["jan"],
  februari: ["feb"],
  maret: ["mar"],
  april: ["apr"],
  mei: ["mei", "may"],
  juni: ["jun"],
};

type MonthColumns = Record<TabunganMonth, number>;

const DEFAULT_MONTH_COLUMNS = Object.fromEntries(
  TABUNGAN_MONTHS.map((m, i) => [m, FIRST_MONTH_INDEX + i])
) as MonthColumns;

function cell(row: unknown[], index: number): string {
  const value = row[index];
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

/** "Rp1.700.000" / "Rp 1.700.000,00" / "-Rp50.000" / "1700000" → 1700000 */
export function parseRupiah(raw: unknown): number {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  const text = String(raw ?? "").trim();
  if (!text || text === "-") return 0;

  const negative = /^\(.*\)$/.test(text) || /^-/.test(text);
  const withoutDecimals = text.replace(/[.,]\d{1,2}$/, "");
  const digits = withoutDecimals.replace(/\D/g, "");
  if (!digits) return 0;

  const n = Number(digits);
  if (!Number.isFinite(n)) return 0;
  return negative ? -n : n;
}

function monthFromHeader(header: string): TabunganMonth | null {
  const key = header.toLowerCase().replace(/[^a-z]/g, "");
  if (!key) return null;
  for (const month of TABUNGAN_MONTHS) {
    if (MONTH_PREFIXES[month].some((p) => key.startsWith(p))) return month;
  }
  return null;
}

function isHeaderRow(row: unknown[]): boolean {
  return row.some((c) => String(c ?? "").trim().toLowerCase() === "nama");
}

function monthColumnsFromHeader(row: unknown[]): MonthColumns | null {
  const found: Partial<MonthColumns> = {};
  row.forEach((c, index) => {
    if (index < FIRST_MONTH_INDEX) return;
    const month = monthFromHeader(String(c ?? ""));
    if (month && found[month] === undefined) found[month] = index;
  });
  if (Object.keys(found).length === 0) return null;
  return { ...DEFAULT_MONTH_COLUMNS, ...found };
}

export function mapSheetsRowsToTabungan(rows: unknown[][]): TabunganSiswa[] {
  let columns = DEFAULT_MONTH_COLUMNS;
  const result: TabunganSiswa[] = [];

  for (const row of rows) {
    if (isHeaderRow(row)) {
      columns = monthColumnsFromHeader(row) ?? columns;
      continue;
    }

    const nama = cell(row, NAMA_INDEX);
    if (!nama) continue;
    if (/^total/i.test(nama) || /^total/i.test(cell(row, NO_INDEX))) continue;

    const noRaw = Number(cell(row, NO_INDEX));
    const months = Object.fromEntries(
      TABUNGAN_MONTHS.map((m) => [m, parseRupiah(row[columns[m]])])
    ) as MonthColumns;

    result.push(
      withTotal({
        no: Number.isFinite(noRaw) && noRaw > 0 ? noRaw : result.length + 1,
        nama,
        kelas: cell(row, KELAS_INDEX).toUpperCase().replace(/\s+/g, ""),
        ...months,
      })
    );
  }

  return result;
}
