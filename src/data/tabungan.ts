/**
 * Struktur objek selaras dengan tab Google Sheets `Data_Tabungan`
 * (atau `Tabungan_Log` / `Tabungan`):
 *
 *   A no | B nama | C kelas | D juli … O juni (nominal Rupiah, cth "Rp1.700.000")
 *
 * Tidak ada data contoh: jika Sheets tidak terbaca, `data` dikosongkan.
 */

export const TABUNGAN_MONTHS = [
  "juli",
  "agustus",
  "september",
  "oktober",
  "november",
  "desember",
  "januari",
  "februari",
  "maret",
  "april",
  "mei",
  "juni",
] as const;

export type TabunganMonth = (typeof TABUNGAN_MONTHS)[number];

export const TABUNGAN_MONTH_LABELS: Record<TabunganMonth, string> = {
  juli: "Juli",
  agustus: "Agustus",
  september: "September",
  oktober: "Oktober",
  november: "November",
  desember: "Desember",
  januari: "Januari",
  februari: "Februari",
  maret: "Maret",
  april: "April",
  mei: "Mei",
  juni: "Juni",
};

export type TabunganSiswa = {
  no: number;
  nama: string;
  kelas: string;
  total: number;
} & Record<TabunganMonth, number>;

export interface TabunganPayload {
  data: TabunganSiswa[];
  connected: boolean;
  sheet: string | null;
  source: "sheets" | "none";
  message?: string;
}

export function withTotal(
  row: Omit<TabunganSiswa, "total">
): TabunganSiswa {
  const total = TABUNGAN_MONTHS.reduce((sum, m) => sum + row[m], 0);
  return { ...row, total };
}

export const EMPTY_TABUNGAN_PAYLOAD: TabunganPayload = {
  data: [],
  connected: false,
  sheet: null,
  source: "none",
};
