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

export interface LombaStatusEntry {
  id: string;
  namaLomba: string;
  penyelenggara: string;
  peserta: { name: string; peringkat: string }[];
  tingkatLomba: TingkatLomba;
  pelaksanaan: PelaksanaanLomba;
  jenis: LombaItem["jenis"];
  /** Peringkat terbaik di antara peserta; "-" atau teks bebas bila tidak juara. */
  peringkat: string;
  tanggal: string;
}

export type LombaStatusGroups = Record<StatusProgres, LombaStatusEntry[]>;

export const STATUS_ORDER: StatusProgres[] = [
  "Pendaftaran",
  "Pelaksanaan",
  "Selesai",
];

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

const MONTH_PREFIXES: [string, number][] = [
  ["jan", 1],
  ["feb", 2],
  ["mar", 3],
  ["apr", 4],
  ["mei", 5],
  ["may", 5],
  ["jun", 6],
  ["jul", 7],
  ["agu", 8],
  ["aug", 8],
  ["sep", 9],
  ["okt", 10],
  ["oct", 10],
  ["nov", 11],
  ["des", 12],
  ["dec", 12],
];

/** Mendukung "dd/mm/yyyy" maupun teks bebas seperti "12 Oktober 2026". */
function parseDateKey(tanggal: string): number {
  const slash = tanggal.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (slash) {
    return Number(slash[3]) * 10_000 + Number(slash[2]) * 100 + Number(slash[1]);
  }
  const text = tanggal.toLowerCase();
  const year = text.match(/\d{4}/)?.[0];
  const day = text.match(/\b(\d{1,2})\b/)?.[1];
  const month = MONTH_PREFIXES.find(([prefix]) =>
    new RegExp(`\\b${prefix}`).test(text)
  )?.[1];
  if (!year || !month) return 0;
  return Number(year) * 10_000 + month * 100 + Number(day ?? 1);
}

function isJuara(peringkat: string): boolean {
  return ["1", "2", "3"].includes(peringkat);
}

function bestPeringkat(a: string, b: string): string {
  const rank = (p: string) => (isJuara(p) ? Number(p) : 99);
  return rank(b) < rank(a) ? b : a;
}

function lombaKey(item: LombaItem): string {
  const name = item.nama_lomba.trim().toLowerCase().replace(/\s+/g, " ");
  return `${item.status_progres}::${name || item.id_lomba}`;
}

/**
 * Kelompokkan lomba per status progres. Baris dengan nama lomba yang sama
 * (mis. satu baris per siswa) digabung menjadi satu entri lomba.
 */
export function groupLombaByStatus(data: LombaItem[]): LombaStatusGroups {
  const groups: LombaStatusGroups = {
    Pendaftaran: [],
    Pelaksanaan: [],
    Selesai: [],
  };
  const index = new Map<string, LombaStatusEntry>();

  for (const item of data) {
    const key = lombaKey(item);
    const peserta = parseParticipants(item)
      .filter((p) => p.name && p.name !== "Siswa")
      .map((p) => ({ name: p.name, peringkat: item.peringkat || "-" }));
    const existing = index.get(key);

    if (existing) {
      for (const p of peserta) {
        if (!existing.peserta.some((e) => e.name === p.name)) {
          existing.peserta.push(p);
        }
      }
      existing.peringkat = bestPeringkat(existing.peringkat, item.peringkat);
      if (parseDateKey(item.tanggal_kegiatan) > parseDateKey(existing.tanggal)) {
        existing.tanggal = item.tanggal_kegiatan;
      }
      continue;
    }

    const entry: LombaStatusEntry = {
      id: key,
      namaLomba: item.nama_lomba || item.id_lomba,
      penyelenggara: item.penyelenggara,
      peserta,
      tingkatLomba: item.tingkat_lomba,
      pelaksanaan: item.pelaksanaan,
      jenis: item.jenis,
      peringkat: item.peringkat || "-",
      tanggal: item.tanggal_kegiatan,
    };
    index.set(key, entry);
    groups[item.status_progres].push(entry);
  }

  for (const status of STATUS_ORDER) {
    groups[status].sort((a, b) => parseDateKey(b.tanggal) - parseDateKey(a.tanggal));
  }

  return groups;
}

/** Lomba selesai dengan peringkat terbaik dan tanggal terbaru per siswa. */
export function bestAchievementFor(
  data: LombaItem[],
  studentId: string
): LombaItem | null {
  let best: LombaItem | null = null;
  for (const item of data) {
    if (!parseParticipants(item).some((p) => p.id === studentId)) continue;
    const points = placementPoints(item.peringkat, item.tingkat_lomba);
    if (points === 0) continue;
    if (!best) {
      best = item;
      continue;
    }
    const bestPoints = placementPoints(best.peringkat, best.tingkat_lomba);
    if (
      points > bestPoints ||
      (points === bestPoints &&
        parseDateKey(item.tanggal_kegiatan) > parseDateKey(best.tanggal_kegiatan))
    ) {
      best = item;
    }
  }
  return best;
}

export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) =>
    a.localeCompare(b, "id", { numeric: true })
  );
}
