import type {
  RekapMenulis,
  RekapSertifikasi,
} from "@/src/data/mockMenulis";

/**
 * Indeks kolom tab `Menulis_Log` / `Sertifikasi_Log` (A = 0 … I = 8).
 * Kedua tabel berbagi baris yang sama. Kolom E (indeks 4) diabaikan.
 *
 * Menulis:      A kelas | B pencapaian_menulis | C target_menulis | D kekurangan_halaman
 * Sertifikasi:  F kelas_sertifikat | G pencapaian_sertifikat | H target_sertifikat | I kekurangan_sertifikat
 */

const MENULIS_HEADERS = new Set([
  "kelas",
  "class",
  "kelas menulis",
  "rekap menulis",
  "nama kelas",
]);

const SERTIFIKASI_HEADERS = new Set([
  "kelas",
  "class",
  "kelas sertifikat",
  "kelas_sertifikat",
  "rekap sertifikasi",
  "rekap sertifikat",
]);

function cell(row: unknown[], index: number): string {
  const value = row[index];
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function toNumber(value: string): number {
  if (!value) return 0;
  const n = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function kekurangan(raw: string, pencapaian: number, target: number): number {
  if (!raw) return Math.max(0, target - pencapaian);
  return toNumber(raw);
}

function mapMenulis(row: unknown[]): RekapMenulis | null {
  const kelas = cell(row, 0);
  if (!kelas || MENULIS_HEADERS.has(kelas.toLowerCase())) return null;
  const pencapaianRaw = cell(row, 1);
  const targetRaw = cell(row, 2);
  const kurangRaw = cell(row, 3);
  if (!pencapaianRaw && !targetRaw && !kurangRaw) return null;

  const pencapaianMenulis = toNumber(pencapaianRaw);
  const targetMenulis = toNumber(targetRaw);
  return {
    kelas,
    pencapaianMenulis,
    targetMenulis,
    kekuranganHalaman: kekurangan(kurangRaw, pencapaianMenulis, targetMenulis),
  };
}

function mapSertifikasi(row: unknown[]): RekapSertifikasi | null {
  const kelas = cell(row, 5);
  if (!kelas || SERTIFIKASI_HEADERS.has(kelas.toLowerCase())) return null;
  const pencapaianRaw = cell(row, 6);
  const targetRaw = cell(row, 7);
  const kurangRaw = cell(row, 8);
  if (!pencapaianRaw && !targetRaw && !kurangRaw) return null;

  const pencapaianSertifikat = toNumber(pencapaianRaw);
  const targetSertifikat = toNumber(targetRaw);
  return {
    kelas,
    pencapaianSertifikat,
    targetSertifikat,
    kekuranganSertifikat: kekurangan(
      kurangRaw,
      pencapaianSertifikat,
      targetSertifikat
    ),
  };
}

export function mapSheetsRowsToMenulis(rows: unknown[][]): {
  menulis: RekapMenulis[];
  sertifikasi: RekapSertifikasi[];
} {
  const menulis: RekapMenulis[] = [];
  const sertifikasi: RekapSertifikasi[] = [];

  for (const row of rows) {
    const rekapMenulis = mapMenulis(row);
    if (rekapMenulis) menulis.push(rekapMenulis);
    const rekapSertifikasi = mapSertifikasi(row);
    if (rekapSertifikasi) sertifikasi.push(rekapSertifikasi);
  }

  return { menulis, sertifikasi };
}
