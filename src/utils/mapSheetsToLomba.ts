import type {
  JenisLomba,
  LombaItem,
  PelaksanaanLomba,
  StatusProgres,
  TingkatLomba,
} from "@/src/data/mockLomba";

/**
 * Indeks kolom Google Sheets `Lomba_Filter` / `Lomba_Log` (A = 0 … Q = 16).
 *
 * Lomba_Filter (canonical):
 * A id_lomba | B id_siswa | C nama_siswa | D tingkat | E kelas_spesifik |
 * F jenis | G nama_lomba | H penyelenggara | I tingkat_lomba | J status_progres |
 * K jenis_penghargaan | L jenjang_sekolah | M pelaksanaan | N peringkat |
 * O tanggal_kegiatan | P pekan | Q bulan
 *
 * Lomba_Log (tanpa nama_siswa di C — C=tingkat, D=kelas, E=jenis, lalu bergeser):
 * terdeteksi otomatis jika kolom E (index 4) berisi "Individu"/"Tim".
 */

const HEADER_MARKERS = new Set([
  "id_lomba",
  "id lomba",
  "idlomba",
  "no",
  "no.",
]);

const JENIS_VALUES = new Set(["individu", "tim"]);
const TINGKAT_LOMBA_VALUES = new Set([
  "internasional",
  "nasional",
  "provinsi",
  "kabupaten",
]);
const STATUS_VALUES = new Set(["pendaftaran", "pelaksanaan", "selesai"]);
const PELAKSANAAN_VALUES = new Set(["online", "offline"]);

function cell(row: unknown[], index: number, fallback = ""): string {
  const value = row[index];
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function isHeaderRow(row: unknown[]): boolean {
  const id = cell(row, 0).toLowerCase();
  if (!id) return true;
  if (HEADER_MARKERS.has(id)) return true;
  // Baris judul / label yang tidak diawali LMB- / angka id
  if (id.includes("id_lomba") || id.includes("id lomba")) return true;
  return false;
}

function asJenis(value: string): JenisLomba {
  const v = value.toLowerCase();
  if (v === "tim") return "Tim";
  return "Individu";
}

function asTingkatLomba(value: string): TingkatLomba {
  const normalized = value.trim();
  const key = normalized.toLowerCase();
  if (TINGKAT_LOMBA_VALUES.has(key)) {
    return (normalized.charAt(0).toUpperCase() +
      normalized.slice(1).toLowerCase()) as TingkatLomba;
  }
  // Preserve known casing variants
  if (normalized === "Internasional") return "Internasional";
  if (normalized === "Nasional") return "Nasional";
  if (normalized === "Provinsi") return "Provinsi";
  if (normalized === "Kabupaten") return "Kabupaten";
  return "Kabupaten";
}

function asStatus(value: string): StatusProgres {
  const key = value.trim().toLowerCase();
  if (key === "pendaftaran") return "Pendaftaran";
  if (key === "pelaksanaan") return "Pelaksanaan";
  if (key === "selesai") return "Selesai";
  return "Pendaftaran";
}

function asPelaksanaan(value: string): PelaksanaanLomba {
  return value.trim().toLowerCase() === "online" ? "Online" : "Offline";
}

function looksLikeJenis(value: string): boolean {
  return JENIS_VALUES.has(value.trim().toLowerCase());
}

function looksLikeStatus(value: string): boolean {
  return STATUS_VALUES.has(value.trim().toLowerCase());
}

function looksLikePelaksanaan(value: string): boolean {
  return PELAKSANAAN_VALUES.has(value.trim().toLowerCase());
}

/**
 * Deteksi layout Lomba_Log (C = tingkat, tanpa nama_siswa)
 * vs Lomba_Filter (C = nama_siswa).
 */
function isLogLayout(row: unknown[]): boolean {
  const e = cell(row, 4); // Filter: kelas_spesifik | Log: jenis
  const f = cell(row, 5); // Filter: jenis | Log: nama_lomba
  if (looksLikeJenis(e) && !looksLikeJenis(f)) return true;
  // Secondary: J (index 9) status on Filter vs shifted on Log
  const jFilter = cell(row, 9);
  const iLog = cell(row, 8);
  if (!looksLikeStatus(jFilter) && looksLikeStatus(iLog) && looksLikeJenis(e)) {
    return true;
  }
  return false;
}

function mapFilterRow(row: unknown[]): LombaItem {
  return {
    id_lomba: cell(row, 0),
    id_siswa: cell(row, 1),
    nama_siswa: cell(row, 2),
    tingkat: cell(row, 3),
    kelas_spesifik: cell(row, 4),
    jenis: asJenis(cell(row, 5, "Individu")),
    nama_lomba: cell(row, 6),
    penyelenggara: cell(row, 7),
    tingkat_lomba: asTingkatLomba(cell(row, 8, "Kabupaten")),
    status_progres: asStatus(cell(row, 9, "Pendaftaran")),
    jenis_penghargaan: cell(row, 10, "-"),
    jenjang_sekolah: cell(row, 11),
    pelaksanaan: asPelaksanaan(cell(row, 12, "Offline")),
    peringkat: cell(row, 13, "-") || "-",
    tanggal_kegiatan: cell(row, 14),
    pekan: cell(row, 15),
    bulan: cell(row, 16),
  };
}

function mapLogRow(row: unknown[]): LombaItem {
  // Lomba_Log: C tingkat, D kelas_spesifik, E jenis, F nama_lomba, … (tanpa nama_siswa)
  return {
    id_lomba: cell(row, 0),
    id_siswa: cell(row, 1),
    nama_siswa: "",
    tingkat: cell(row, 2),
    kelas_spesifik: cell(row, 3),
    jenis: asJenis(cell(row, 4, "Individu")),
    nama_lomba: cell(row, 5),
    penyelenggara: cell(row, 6),
    tingkat_lomba: asTingkatLomba(cell(row, 7, "Kabupaten")),
    status_progres: asStatus(cell(row, 8, "Pendaftaran")),
    jenis_penghargaan: cell(row, 9, "-"),
    jenjang_sekolah: cell(row, 10),
    pelaksanaan: asPelaksanaan(cell(row, 11, "Offline")),
    peringkat: cell(row, 12, "-") || "-",
    tanggal_kegiatan: cell(row, 13),
    pekan: cell(row, 14),
    bulan: cell(row, 15),
  };
}

/**
 * Ubah array mentah Google Sheets (`string[][]`) menjadi `LombaItem[]`.
 * Mengabaikan baris header dan baris tanpa `id_lomba`.
 */
export function mapSheetsRowsToLombaItems(rows: unknown[][]): LombaItem[] {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const items: LombaItem[] = [];

  for (const row of rows) {
    if (!Array.isArray(row) || row.length === 0) continue;
    if (isHeaderRow(row)) continue;

    const idLomba = cell(row, 0);
    if (!idLomba) continue;

    const item = isLogLayout(row) ? mapLogRow(row) : mapFilterRow(row);

    // Skip baris yang jelas bukan data lomba
    if (!item.nama_lomba && !item.id_siswa && !looksLikePelaksanaan(item.pelaksanaan)) {
      if (!item.tingkat && !item.kelas_spesifik) continue;
    }

    items.push(item);
  }

  return items;
}
