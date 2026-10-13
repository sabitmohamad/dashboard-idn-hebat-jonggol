import type {
  LogMengajar,
  RekapSiswaMengajar,
} from "@/src/data/mockMengajar";

export interface MengajarStats {
  totalSesi: number;
  totalSiswa: number;
  totalSekolah: number;
  totalPeserta: number;
}

export interface MateriSlice {
  name: string;
  value: number;
  color: string;
}

const MATERI_COLORS = [
  "#3B82F6",
  "#06B6D4",
  "#6366F1",
  "#0EA5E9",
  "#22D3EE",
  "#818CF8",
];

/** Splits the free-text `namaSiswa` cell into individual names. */
export function splitNamaSiswa(value: string): string[] {
  return value
    .split(/\s*(?:,|;|\n|&|\s+dan\s+)\s*/i)
    .map((n) => n.trim())
    .filter(Boolean);
}

export function computeMengajarStats(
  rekap: RekapSiswaMengajar[],
  log: LogMengajar[]
): MengajarStats {
  const activeFromRekap = rekap.filter((r) => r.totalMengajar > 0).length;
  const namesFromLog = new Set(
    log.flatMap((l) => splitNamaSiswa(l.namaSiswa).map((n) => n.toLowerCase()))
  );
  const schools = new Set(
    log.map((l) => l.namaSekolah.trim().toLowerCase()).filter(Boolean)
  );

  return {
    totalSesi: log.length,
    totalSiswa: activeFromRekap || namesFromLog.size,
    totalSekolah: schools.size,
    totalPeserta: log.reduce((sum, l) => sum + l.jumlahPeserta, 0),
  };
}

export function buildMengajarLeaderboard(
  rekap: RekapSiswaMengajar[]
): RekapSiswaMengajar[] {
  return [...rekap]
    .filter((r) => r.totalMengajar > 0)
    .sort((a, b) => {
      if (b.totalMengajar !== a.totalMengajar) {
        return b.totalMengajar - a.totalMengajar;
      }
      return a.nama.localeCompare(b.nama, "id");
    });
}

export function buildTopMateri(log: LogMengajar[], limit = 6): MateriSlice[] {
  const counts = new Map<string, number>();
  for (const item of log) {
    const materi = item.materi.trim();
    if (!materi) continue;
    counts.set(materi, (counts.get(materi) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .slice(0, limit)
    .map(([name, value], i) => ({
      name,
      value,
      color: MATERI_COLORS[i % MATERI_COLORS.length],
    }));
}

/** Newest first, using the sheet's running `no` when it is numeric. */
export function sortLogTerbaru(log: LogMengajar[]): LogMengajar[] {
  return log
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const na = Number(a.item.no);
      const nb = Number(b.item.no);
      if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) {
        return nb - na;
      }
      return b.index - a.index;
    })
    .map(({ item }) => item);
}
