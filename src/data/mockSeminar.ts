/**
 * Struktur objek selaras dengan tab Google Sheets `Seminar_Report`.
 * A bulan · B kelas_jurusan / pekan · C wet · D wtt · E podcast · F total
 */

export interface SeminarRow {
  bulan: string;
  pekan: string;
  wet: boolean;
  wtt: boolean;
  podcast: boolean;
  /** Persentase ketercapaian 0–100. */
  total: number;
}

export interface SeminarPayload {
  data: SeminarRow[];
  connected: boolean;
  sheet: string | null;
  source: "sheets" | "mock";
  message?: string;
}

function row(
  bulan: string,
  pekan: string,
  wet: boolean,
  wtt: boolean,
  podcast: boolean
): SeminarRow {
  const done = Number(wet) + Number(wtt) + Number(podcast);
  return {
    bulan,
    pekan,
    wet,
    wtt,
    podcast,
    total: Math.round((done / 3) * 10000) / 100,
  };
}

export const MOCK_SEMINAR_ROWS: SeminarRow[] = [
  row("Juli", "Pekan 1", true, true, true),
  row("Juli", "Pekan 2", true, true, true),
  row("Juli", "Pekan 3", true, true, true),
  row("Juli", "Pekan 4", true, true, true),

  row("Agustus", "Pekan 1", true, true, true),
  row("Agustus", "Pekan 2", true, true, true),
  row("Agustus", "Pekan 3", true, true, true),
  row("Agustus", "Pekan 4", true, true, false),

  row("September", "Pekan 1", true, true, true),
  row("September", "Pekan 2", true, true, false),
  row("September", "Pekan 3", false, true, true),
  row("September", "Pekan 4", true, false, false),

  row("Oktober", "Pekan 1", true, true, true),
  row("Oktober", "Pekan 2", true, true, true),
  row("Oktober", "Pekan 3", true, false, true),
  row("Oktober", "Pekan 4", true, false, false),

  row("November", "Pekan 1", true, true, false),
  row("November", "Pekan 2", true, true, true),
  row("November", "Pekan 3", false, true, false),
  row("November", "Pekan 4", true, true, false),

  row("Desember", "Pekan 1", true, true, true),
  row("Desember", "Pekan 2", true, true, false),
  row("Desember", "Pekan 3", false, false, false),
  row("Desember", "Pekan 4", true, false, false),
];

export const MOCK_SEMINAR_PAYLOAD: SeminarPayload = {
  data: MOCK_SEMINAR_ROWS,
  connected: false,
  sheet: null,
  source: "mock",
};
