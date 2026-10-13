import type { MenulisPayload } from "@/src/data/mockMenulis";

export type MenulisTab = "all" | "menulis" | "sertifikasi";
export type ProgressTone = "green" | "yellow" | "red";

export interface TopKelas {
  kelas: string;
  pencapaian: number;
}

export interface KelasProgress {
  kelas: string;
  pencapaianMenulis: number;
  targetMenulis: number;
  kekuranganHalaman: number;
  pencapaianSertifikat: number;
  targetSertifikat: number;
  kekuranganSertifikat: number;
  persenMenulis: number;
  persenSertifikat: number;
  hasMenulis: boolean;
  hasSertifikat: boolean;
}

export interface MenulisSchoolStats {
  totalPencapaianMenulis: number;
  totalTargetMenulis: number;
  persenMenulis: number;
  totalPencapaianSertifikat: number;
  totalTargetSertifikat: number;
  persenSertifikat: number;
  topMenulis: TopKelas | null;
  topSertifikat: TopKelas | null;
}

export interface MenulisChartPoint {
  kelas: string;
  pencapaian: number;
  target: number;
}

export function percent(pencapaian: number, target: number): number {
  if (target <= 0) return pencapaian > 0 ? 100 : 0;
  return (pencapaian / target) * 100;
}

/** Hijau di atas 75%, kuning 50–75%, merah di bawah 50%. */
export function progressTone(pct: number): ProgressTone {
  if (pct > 75) return "green";
  if (pct >= 50) return "yellow";
  return "red";
}

export function formatNum(value: number): string {
  return value.toLocaleString("id-ID");
}

export function formatPct(value: number): string {
  return `${value.toLocaleString("id-ID", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })}%`;
}

export function normalizeKelas(value: string): string {
  const match = value.toUpperCase().match(/(\d+)\s*([A-Z]+)/);
  if (match) return `${match[1]}${match[2]}`;
  return value.replace(/\s+/g, "").toUpperCase();
}

export function compareKelas(a: string, b: string): number {
  const parse = (value: string) => {
    const match = value.toUpperCase().match(/(\d+)\s*([A-Z]+)?/);
    return {
      grade: match ? Number(match[1]) : 999,
      section: match?.[2] ?? value.toUpperCase(),
    };
  };
  const left = parse(a);
  const right = parse(b);
  if (left.grade !== right.grade) return left.grade - right.grade;
  return left.section.localeCompare(right.section, "id");
}

function displayKelas(value: string): string {
  const key = normalizeKelas(value);
  return /^\d+[A-Z]+$/.test(key) ? key : value.trim();
}

function emptyRow(kelas: string): KelasProgress {
  return {
    kelas,
    pencapaianMenulis: 0,
    targetMenulis: 0,
    kekuranganHalaman: 0,
    pencapaianSertifikat: 0,
    targetSertifikat: 0,
    kekuranganSertifikat: 0,
    persenMenulis: 0,
    persenSertifikat: 0,
    hasMenulis: false,
    hasSertifikat: false,
  };
}

export function buildKelasRows(
  data: Pick<MenulisPayload, "menulis" | "sertifikasi">
): KelasProgress[] {
  const byKelas = new Map<string, KelasProgress>();

  const ensure = (kelas: string) => {
    const key = normalizeKelas(kelas);
    let row = byKelas.get(key);
    if (!row) {
      row = emptyRow(displayKelas(kelas));
      byKelas.set(key, row);
    }
    return row;
  };

  for (const item of data.menulis) {
    const row = ensure(item.kelas);
    row.pencapaianMenulis = item.pencapaianMenulis;
    row.targetMenulis = item.targetMenulis;
    row.kekuranganHalaman = item.kekuranganHalaman;
    row.hasMenulis = true;
  }

  for (const item of data.sertifikasi) {
    const row = ensure(item.kelas);
    row.pencapaianSertifikat = item.pencapaianSertifikat;
    row.targetSertifikat = item.targetSertifikat;
    row.kekuranganSertifikat = item.kekuranganSertifikat;
    row.hasSertifikat = true;
  }

  return [...byKelas.values()]
    .map((row) => ({
      ...row,
      persenMenulis: percent(row.pencapaianMenulis, row.targetMenulis),
      persenSertifikat: percent(row.pencapaianSertifikat, row.targetSertifikat),
    }))
    .sort((a, b) => compareKelas(a.kelas, b.kelas));
}

function pickTop(rows: { kelas: string; pencapaian: number }[]): TopKelas | null {
  if (rows.length === 0) return null;
  return [...rows].sort((a, b) => {
    if (b.pencapaian !== a.pencapaian) return b.pencapaian - a.pencapaian;
    return compareKelas(a.kelas, b.kelas);
  })[0];
}

export function computeMenulisStats(data: MenulisPayload): MenulisSchoolStats {
  const rows = buildKelasRows(data);
  const menulisRows = rows.filter((row) => row.hasMenulis);
  const sertifikatRows = rows.filter((row) => row.hasSertifikat);

  const totalPencapaianMenulis = menulisRows.reduce(
    (sum, row) => sum + row.pencapaianMenulis,
    0
  );
  const totalTargetMenulis = menulisRows.reduce(
    (sum, row) => sum + row.targetMenulis,
    0
  );
  const totalPencapaianSertifikat = sertifikatRows.reduce(
    (sum, row) => sum + row.pencapaianSertifikat,
    0
  );
  const totalTargetSertifikat = sertifikatRows.reduce(
    (sum, row) => sum + row.targetSertifikat,
    0
  );

  return {
    totalPencapaianMenulis,
    totalTargetMenulis,
    persenMenulis: percent(totalPencapaianMenulis, totalTargetMenulis),
    totalPencapaianSertifikat,
    totalTargetSertifikat,
    persenSertifikat: percent(totalPencapaianSertifikat, totalTargetSertifikat),
    topMenulis: pickTop(
      menulisRows.map((row) => ({
        kelas: row.kelas,
        pencapaian: row.pencapaianMenulis,
      }))
    ),
    topSertifikat: pickTop(
      sertifikatRows.map((row) => ({
        kelas: row.kelas,
        pencapaian: row.pencapaianSertifikat,
      }))
    ),
  };
}

export function filterKelas(rows: KelasProgress[], tab: MenulisTab): KelasProgress[] {
  if (tab === "menulis") return rows.filter((row) => row.hasMenulis);
  if (tab === "sertifikasi") return rows.filter((row) => row.hasSertifikat);
  return rows;
}

export function toChartPoints(
  rows: KelasProgress[],
  metric: Exclude<MenulisTab, "all">
): MenulisChartPoint[] {
  return rows.map((row) =>
    metric === "menulis"
      ? {
          kelas: row.kelas,
          pencapaian: row.pencapaianMenulis,
          target: row.targetMenulis,
        }
      : {
          kelas: row.kelas,
          pencapaian: row.pencapaianSertifikat,
          target: row.targetSertifikat,
        }
  );
}
