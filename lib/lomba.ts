import type {
  LombaItem,
  PelaksanaanLomba,
  StatusProgres,
  TingkatLomba,
} from "@/src/data/mockLomba";

export interface LombaFilters {
  tingkat: string;
  kelasSpesifik: string;
  tingkatLomba: string;
  statusProgres: string;
  jenjangSekolah: string;
  pelaksanaan: string;
  pekan: string;
  bulan: string;
}

export const DEFAULT_LOMBA_FILTERS: LombaFilters = {
  tingkat: "Semua",
  kelasSpesifik: "Semua",
  tingkatLomba: "Semua",
  statusProgres: "Semua",
  jenjangSekolah: "Semua",
  pelaksanaan: "Semua",
  pekan: "Semua",
  bulan: "Semua",
};

export const TINGKAT_OPTIONS = ["Semua", "7", "8", "9"] as const;
export const KELAS_OPTIONS = [
  "Semua",
  "7A",
  "7B",
  "7C",
  "8A",
  "8B",
  "8C",
  "9A",
  "9B",
  "9C",
] as const;
export const SKALA_OPTIONS = [
  "Semua",
  "Internasional",
  "Nasional",
  "Provinsi",
  "Kabupaten",
] as const;
export const STATUS_OPTIONS = [
  "Semua",
  "Pendaftaran",
  "Pelaksanaan",
  "Selesai",
] as const;
export const JENJANG_OPTIONS = [
  "Semua",
  "SMP Sederajat",
  "Umum",
  "SMA/SMK",
] as const;
export const PELAKSANAAN_OPTIONS = ["Semua", "Online", "Offline"] as const;

/** Poin adil: Juara 1/2/3 — anggota Tim mendapat poin penuh (bukan dibagi). */
const PLACEMENT_POINTS: Record<string, number> = {
  "1": 5,
  "2": 3,
  "3": 1,
};

const SKALA_WEIGHT: Record<TingkatLomba, number> = {
  Internasional: 1.5,
  Nasional: 1.25,
  Provinsi: 1.1,
  Kabupaten: 1,
};

export interface LombaParticipant {
  id: string;
  name: string;
  className: string;
}

export interface StudentAchievement {
  id: string;
  name: string;
  className: string;
  points: number;
  juara1: number;
  juara2: number;
  juara3: number;
  totalJuara: number;
  jenis: LombaItem["jenis"];
  pelaksanaan: PelaksanaanLomba;
}

export interface LombaStats {
  totalKejuaraan: number;
  lombaDalamProgres: number;
  skalaBesar: number;
  totalSiswa: number;
}

export interface ChartSlice {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  namaLomba: string;
  namaSiswa: string;
  tingkatLomba: TingkatLomba;
  status: StatusProgres;
  peringkat: string;
  tanggal: string;
  pelaksanaan: PelaksanaanLomba;
}

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseParticipants(item: LombaItem): LombaParticipant[] {
  const ids = splitCsv(item.id_siswa);
  const names = splitCsv(item.nama_siswa);
  const classes = splitCsv(item.kelas_spesifik.replace(/&/g, ","));

  const count = Math.max(ids.length, names.length, 1);
  return Array.from({ length: count }, (_, i) => ({
    id: ids[i] ?? ids[0] ?? `anon-${item.id_lomba}-${i}`,
    name: names[i] ?? names[0] ?? "Siswa",
    className: classes[i] ?? classes[0] ?? item.kelas_spesifik,
  }));
}

export function placementPoints(
  peringkat: string,
  tingkatLomba: TingkatLomba
): number {
  const base = PLACEMENT_POINTS[peringkat] ?? 0;
  if (base === 0) return 0;
  return Math.round(base * SKALA_WEIGHT[tingkatLomba] * 10) / 10;
}

export function filterLombaData(
  data: LombaItem[],
  filters: LombaFilters
): LombaItem[] {
  return data.filter((item) => {
    if (
      filters.tingkat !== "Semua" &&
      !item.tingkat.includes(filters.tingkat)
    ) {
      return false;
    }
    if (
      filters.kelasSpesifik !== "Semua" &&
      !item.kelas_spesifik.includes(filters.kelasSpesifik)
    ) {
      return false;
    }
    if (
      filters.tingkatLomba !== "Semua" &&
      item.tingkat_lomba !== filters.tingkatLomba
    ) {
      return false;
    }
    if (
      filters.statusProgres !== "Semua" &&
      item.status_progres !== filters.statusProgres
    ) {
      return false;
    }
    if (
      filters.jenjangSekolah !== "Semua" &&
      item.jenjang_sekolah !== filters.jenjangSekolah
    ) {
      return false;
    }
    if (
      filters.pelaksanaan !== "Semua" &&
      item.pelaksanaan !== filters.pelaksanaan
    ) {
      return false;
    }
    if (filters.pekan !== "Semua" && item.pekan !== filters.pekan) {
      return false;
    }
    if (filters.bulan !== "Semua" && item.bulan !== filters.bulan) {
      return false;
    }
    return true;
  });
}

export function computeLombaStats(data: LombaItem[]): LombaStats {
  const totalKejuaraan = data.filter((d) =>
    ["1", "2", "3"].includes(d.peringkat)
  ).length;

  const lombaDalamProgres = data.filter((d) =>
    d.status_progres === "Pendaftaran" || d.status_progres === "Pelaksanaan"
  ).length;

  const skalaBesar = data.filter(
    (d) =>
      d.tingkat_lomba === "Internasional" || d.tingkat_lomba === "Nasional"
  ).length;

  const siswaIds = new Set<string>();
  for (const item of data) {
    for (const p of parseParticipants(item)) {
      siswaIds.add(p.id);
    }
  }

  return {
    totalKejuaraan,
    lombaDalamProgres,
    skalaBesar,
    totalSiswa: siswaIds.size,
  };
}

export function buildLeaderboard(data: LombaItem[]): StudentAchievement[] {
  const map = new Map<string, StudentAchievement>();

  for (const item of data) {
    const points = placementPoints(item.peringkat, item.tingkat_lomba);
    const participants = parseParticipants(item);

    for (const p of participants) {
      const existing = map.get(p.id) ?? {
        id: p.id,
        name: p.name,
        className: p.className,
        points: 0,
        juara1: 0,
        juara2: 0,
        juara3: 0,
        totalJuara: 0,
        jenis: item.jenis,
        pelaksanaan: item.pelaksanaan,
      };

      existing.points += points;
      if (item.peringkat === "1") existing.juara1 += 1;
      if (item.peringkat === "2") existing.juara2 += 1;
      if (item.peringkat === "3") existing.juara3 += 1;
      existing.totalJuara = existing.juara1 + existing.juara2 + existing.juara3;

      // Prefer tags from the highest-value placement
      if (points > 0) {
        existing.jenis = item.jenis;
        existing.pelaksanaan = item.pelaksanaan;
        existing.className = p.className;
      }

      map.set(p.id, existing);
    }
  }

  return Array.from(map.values())
    .filter((s) => s.totalJuara > 0 || s.points > 0)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.juara1 !== a.juara1) return b.juara1 - a.juara1;
      if (b.juara2 !== a.juara2) return b.juara2 - a.juara2;
      return b.juara3 - a.juara3;
    });
}

export function getSpotlightStudent(
  leaderboard: StudentAchievement[]
): StudentAchievement | null {
  if (leaderboard.length === 0) return null;
  return [...leaderboard].sort((a, b) => {
    if (b.totalJuara !== a.totalJuara) return b.totalJuara - a.totalJuara;
    if (b.juara1 !== a.juara1) return b.juara1 - a.juara1;
    return b.points - a.points;
  })[0];
}

const SKALA_COLORS: Record<TingkatLomba, string> = {
  Internasional: "#DC2626",
  Nasional: "#EF4444",
  Provinsi: "#F59E0B",
  Kabupaten: "#FBBF24",
};

const JENJANG_COLORS: Record<string, string> = {
  "SMP Sederajat": "#38BDF8",
  Umum: "#A78BFA",
  "SMA/SMK": "#34D399",
};

export function buildSkalaChart(data: LombaItem[]): ChartSlice[] {
  const order: TingkatLomba[] = [
    "Internasional",
    "Nasional",
    "Provinsi",
    "Kabupaten",
  ];
  const counts = Object.fromEntries(order.map((k) => [k, 0])) as Record<
    TingkatLomba,
    number
  >;
  for (const item of data) {
    counts[item.tingkat_lomba] += 1;
  }
  return order
    .map((name) => ({
      name,
      value: counts[name],
      color: SKALA_COLORS[name],
    }))
    .filter((s) => s.value > 0);
}

export function buildJenjangChart(data: LombaItem[]): ChartSlice[] {
  const counts = new Map<string, number>();
  for (const item of data) {
    counts.set(item.jenjang_sekolah, (counts.get(item.jenjang_sekolah) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, value]) => ({
    name,
    value,
    color: JENJANG_COLORS[name] ?? "#94A3B8",
  }));
}

export function countPelaksanaan(data: LombaItem[]): {
  online: number;
  offline: number;
} {
  let online = 0;
  let offline = 0;
  for (const item of data) {
    if (item.pelaksanaan === "Online") online += 1;
    else offline += 1;
  }
  return { online, offline };
}

function parseDateKey(tanggal: string): number {
  const [dd, mm, yyyy] = tanggal.split("/").map(Number);
  if (!dd || !mm || !yyyy) return 0;
  return yyyy * 10_000 + mm * 100 + dd;
}

export function buildActivityLog(
  data: LombaItem[],
  limit = 6
): ActivityItem[] {
  return [...data]
    .sort((a, b) => parseDateKey(b.tanggal_kegiatan) - parseDateKey(a.tanggal_kegiatan))
    .slice(0, limit)
    .map((item) => ({
      id: item.id_lomba,
      namaLomba: item.nama_lomba,
      namaSiswa: item.nama_siswa,
      tingkatLomba: item.tingkat_lomba,
      status: item.status_progres,
      peringkat: item.peringkat,
      tanggal: item.tanggal_kegiatan,
      pelaksanaan: item.pelaksanaan,
    }));
}

export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) =>
    a.localeCompare(b, "id", { numeric: true })
  );
}
