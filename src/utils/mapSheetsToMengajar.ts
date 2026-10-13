import type {
  LogMengajar,
  RekapSiswaMengajar,
} from "@/src/data/mockMengajar";

/**
 * Indeks kolom tab `Mengajar_Log` (A = 0 … L = 11). Kedua tabel berbagi
 * baris yang sama, sehingga satu baris bisa berisi rekap, log, atau keduanya.
 *
 * Rekap: A id | B kelas | C nama | D totalMengajar
 * Log:   E no | F namaSiswa | G namaSekolah | H bulan | I pekan |
 *        J materi | K tanggal | L jumlahPeserta
 */

const REKAP_HEADERS = new Set(["id", "id siswa", "id_siswa"]);
const LOG_HEADERS = new Set(["no", "no.", "nomor"]);

function cell(row: unknown[], index: number): string {
  const value = row[index];
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function toNumber(value: string): number {
  const n = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function mapRekap(row: unknown[]): RekapSiswaMengajar | null {
  const id = cell(row, 0);
  const nama = cell(row, 2);
  if (!id || !nama || REKAP_HEADERS.has(id.toLowerCase())) return null;
  return {
    id,
    kelas: cell(row, 1),
    nama,
    totalMengajar: toNumber(cell(row, 3)),
  };
}

function mapLog(row: unknown[]): LogMengajar | null {
  const no = cell(row, 4);
  const namaSekolah = cell(row, 6);
  const materi = cell(row, 9);
  if (LOG_HEADERS.has(no.toLowerCase())) return null;
  if (!namaSekolah && !materi) return null;
  return {
    no,
    namaSiswa: cell(row, 5),
    namaSekolah,
    bulan: cell(row, 7),
    pekan: cell(row, 8),
    materi,
    tanggal: cell(row, 10),
    jumlahPeserta: toNumber(cell(row, 11)),
  };
}

export function mapSheetsRowsToMengajar(rows: unknown[][]): {
  rekap: RekapSiswaMengajar[];
  log: LogMengajar[];
} {
  const rekap: RekapSiswaMengajar[] = [];
  const log: LogMengajar[] = [];

  for (const row of rows) {
    const r = mapRekap(row);
    if (r) rekap.push(r);
    const l = mapLog(row);
    if (l) log.push(l);
  }

  return { rekap, log };
}
