import {
  TABUNGAN_MONTHS,
  TABUNGAN_MONTH_LABELS,
  type TabunganMonth,
  type TabunganSiswa,
} from "@/src/data/tabungan";

export const KELAS_OPTIONS = [
  "Semua",
  "9A",
  "9B",
  "9C",
  "9D",
] as const;

export type KelasFilter = (typeof KELAS_OPTIONS)[number];

/** 1700000 → "Rp 1.700.000" */
export function formatRupiah(value: number): string {
  const abs = Math.abs(Math.round(value)).toLocaleString("id-ID");
  return value < 0 ? `-Rp ${abs}` : `Rp ${abs}`;
}

/** 1700000 → "1,7 jt" (label sumbu grafik) */
export function formatRupiahCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`;
  }
  return `${sign}${abs}`;
}

export function filterTabungan(
  rows: TabunganSiswa[],
  kelas: KelasFilter,
  query: string
): TabunganSiswa[] {
  const q = query.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (kelas === "Semua"
        ? KELAS_OPTIONS.includes(row.kelas as KelasFilter)
        : row.kelas === kelas) &&
      (!q || row.nama.toLowerCase().includes(q))
  );
}

export interface TabunganStats {
  total: number;
  rataRata: number;
  jumlahSiswa: number;
  tertinggi: TabunganSiswa | null;
}

export function computeTabunganStats(rows: TabunganSiswa[]): TabunganStats {
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const tertinggi = rows.reduce<TabunganSiswa | null>(
    (best, row) => (!best || row.total > best.total ? row : best),
    null
  );
  return {
    total,
    rataRata: rows.length ? total / rows.length : 0,
    jumlahSiswa: rows.length,
    tertinggi,
  };
}

/**
 * Bulan yang ditampilkan: Juli s.d. bulan terakhir yang sudah berisi setoran
 * (minimal 3 bulan supaya tabel/grafik tidak terlalu sempit).
 */
export function activeMonths(rows: TabunganSiswa[]): TabunganMonth[] {
  let last = -1;
  TABUNGAN_MONTHS.forEach((m, i) => {
    if (rows.some((row) => row[m] !== 0)) last = i;
  });
  return TABUNGAN_MONTHS.slice(0, Math.max(last + 1, 3));
}

export interface TabunganTrendPoint {
  bulan: string;
  perBulan: number;
  akumulasi: number;
}

export function buildMonthlyTrend(
  rows: TabunganSiswa[],
  months: readonly TabunganMonth[] = TABUNGAN_MONTHS
): TabunganTrendPoint[] {
  let akumulasi = 0;
  return months.map((m) => {
    const perBulan = rows.reduce((sum, row) => sum + row[m], 0);
    akumulasi += perBulan;
    return { bulan: TABUNGAN_MONTH_LABELS[m], perBulan, akumulasi };
  });
}
