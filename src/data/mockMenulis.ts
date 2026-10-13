/**
 * Struktur objek selaras dengan tab Google Sheets `Menulis_Log`
 * (atau `Sertifikasi_Log`). Dua tabel agregat per kelas berdampingan:
 *
 * Rekap Menulis (A–D):
 *   A kelas | B pencapaian_menulis | C target_menulis | D kekurangan_halaman
 * Kolom E dikosongkan.
 * Rekap Sertifikasi (F–I):
 *   F kelas_sertifikat | G pencapaian_sertifikat | H target_sertifikat | I kekurangan_sertifikat
 */

export interface RekapMenulis {
  kelas: string;
  pencapaianMenulis: number;
  targetMenulis: number;
  kekuranganHalaman: number;
}

export interface RekapSertifikasi {
  kelas: string;
  pencapaianSertifikat: number;
  targetSertifikat: number;
  kekuranganSertifikat: number;
}

export interface MenulisPayload {
  menulis: RekapMenulis[];
  sertifikasi: RekapSertifikasi[];
  connected: boolean;
  sheet: string | null;
  source: "sheets" | "mock";
  message?: string;
}

export const MOCK_REKAP_MENULIS: RekapMenulis[] = [
  { kelas: "7A", pencapaianMenulis: 86, targetMenulis: 200, kekuranganHalaman: 114 },
  { kelas: "7B", pencapaianMenulis: 104, targetMenulis: 200, kekuranganHalaman: 96 },
  { kelas: "7C", pencapaianMenulis: 71, targetMenulis: 200, kekuranganHalaman: 129 },
  { kelas: "7D", pencapaianMenulis: 121, targetMenulis: 200, kekuranganHalaman: 79 },
  { kelas: "8A", pencapaianMenulis: 138, targetMenulis: 200, kekuranganHalaman: 62 },
  { kelas: "8B", pencapaianMenulis: 97, targetMenulis: 200, kekuranganHalaman: 103 },
  { kelas: "8C", pencapaianMenulis: 152, targetMenulis: 200, kekuranganHalaman: 48 },
  { kelas: "8D", pencapaianMenulis: 109, targetMenulis: 200, kekuranganHalaman: 91 },
  { kelas: "9A", pencapaianMenulis: 163, targetMenulis: 200, kekuranganHalaman: 37 },
  { kelas: "9B", pencapaianMenulis: 144, targetMenulis: 200, kekuranganHalaman: 56 },
  { kelas: "9C", pencapaianMenulis: 118, targetMenulis: 200, kekuranganHalaman: 82 },
  { kelas: "9D", pencapaianMenulis: 91, targetMenulis: 200, kekuranganHalaman: 109 },
];

export const MOCK_REKAP_SERTIFIKASI: RekapSertifikasi[] = [
  { kelas: "7A", pencapaianSertifikat: 6, targetSertifikat: 21, kekuranganSertifikat: 15 },
  { kelas: "7B", pencapaianSertifikat: 9, targetSertifikat: 21, kekuranganSertifikat: 12 },
  { kelas: "7C", pencapaianSertifikat: 4, targetSertifikat: 21, kekuranganSertifikat: 17 },
  { kelas: "7D", pencapaianSertifikat: 11, targetSertifikat: 21, kekuranganSertifikat: 10 },
  { kelas: "8A", pencapaianSertifikat: 8, targetSertifikat: 21, kekuranganSertifikat: 13 },
  { kelas: "8B", pencapaianSertifikat: 11, targetSertifikat: 21, kekuranganSertifikat: 10 },
  { kelas: "8C", pencapaianSertifikat: 10, targetSertifikat: 21, kekuranganSertifikat: 11 },
  { kelas: "8D", pencapaianSertifikat: 9, targetSertifikat: 21, kekuranganSertifikat: 12 },
  { kelas: "9A", pencapaianSertifikat: 12, targetSertifikat: 21, kekuranganSertifikat: 9 },
  { kelas: "9B", pencapaianSertifikat: 10, targetSertifikat: 21, kekuranganSertifikat: 11 },
  { kelas: "9C", pencapaianSertifikat: 8, targetSertifikat: 21, kekuranganSertifikat: 13 },
  { kelas: "9D", pencapaianSertifikat: 5, targetSertifikat: 21, kekuranganSertifikat: 16 },
];

export const MOCK_MENULIS_PAYLOAD: MenulisPayload = {
  menulis: MOCK_REKAP_MENULIS,
  sertifikasi: MOCK_REKAP_SERTIFIKASI,
  connected: false,
  sheet: null,
  source: "mock",
};
