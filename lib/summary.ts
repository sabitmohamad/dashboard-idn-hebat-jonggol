import {
  bestAchievementFor,
  buildLeaderboard,
  computeLombaStats,
  getSpotlightStudent,
  groupLombaByStatus,
} from "@/lib/lomba";
import { buildMengajarLeaderboard, computeMengajarStats } from "@/lib/mengajar";
import { computeMenulisStats, formatNum, formatPct } from "@/lib/menulis";
import { computeSeminarStats, formatPct as formatSeminarPct } from "@/lib/seminar";
import type {
  SummaryDashboardData,
  SummaryStat,
  SummaryTopPerformer,
} from "@/lib/types";
import type { LombaItem } from "@/src/data/mockLomba";
import type { MengajarPayload } from "@/src/data/mockMengajar";
import type { MenulisPayload } from "@/src/data/mockMenulis";
import type { SeminarPayload } from "@/src/data/mockSeminar";
import type { TalkingPayload } from "@/src/data/mockTalking";

export interface SummarySources {
  mengajar: MengajarPayload;
  lomba: { data: LombaItem[]; connected: boolean };
  talking: TalkingPayload;
  menulis: MenulisPayload;
  seminar: SeminarPayload;
}

type Highlight = SummaryDashboardData["highlights"][number];

const WAITING = "Menunggu data spreadsheet…";
const MAX_TOP_PERFORMERS = 6;
const PER_PROGRAM_PERFORMERS = 3;

function pendingStat(
  stat: Omit<SummaryStat, "value" | "description">
): SummaryStat {
  return { ...stat, value: "—", description: WAITING };
}

function pendingHighlight(item: Omit<Highlight, "value" | "title">): Highlight {
  return { ...item, value: "—", title: WAITING };
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

function nameKey(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Talking/Mengajar cells pair students with newlines, `&`, commas, or "dan". */
function splitNames(value: string): string[] {
  return value
    .split(/\s*(?:\n|&|,|;|\s+dan\s+)\s*/i)
    .map((n) => n.trim())
    .filter(Boolean);
}

/** Strips a trailing class suffix such as "Zaid Kun Abdulaziz 8B". */
function stripClassSuffix(name: string): { name: string; kelas: string } {
  const match = name.match(/^(.*\S)\s+(\d[A-Z])$/i);
  if (!match) return { name, kelas: "" };
  return { name: match[1], kelas: match[2].toUpperCase() };
}

interface TalkingSpeaker {
  name: string;
  kelas: string;
  sessions: number;
  programs: Set<string>;
}

function buildTalkingSpeakers(talking: TalkingPayload): TalkingSpeaker[] {
  const map = new Map<string, TalkingSpeaker>();

  const add = (raw: string, kelas: string, program: string) => {
    for (const part of splitNames(raw)) {
      const parsed = stripClassSuffix(part);
      const key = nameKey(parsed.name);
      const entry = map.get(key) ?? {
        name: parsed.name,
        kelas: "",
        sessions: 0,
        programs: new Set<string>(),
      };
      entry.sessions += 1;
      entry.programs.add(program);
      if (!entry.kelas) entry.kelas = parsed.kelas || kelas.trim();
      map.set(key, entry);
    }
  };

  for (const s of talking.podcast) add(s.name_podcast, "", "Podcast");
  for (const s of talking.wtt) add(s.name_wtt, s.class_wtt, "WTT");
  for (const s of talking.wet) add(s.name_wet, s.class_wet, "WET");

  return [...map.values()].sort(
    (a, b) => b.sessions - a.sessions || a.name.localeCompare(b.name, "id")
  );
}

function mergePerformers(
  groups: SummaryTopPerformer[][],
  classLookup: Map<string, string>
): SummaryTopPerformer[] {
  const merged = new Map<string, SummaryTopPerformer>();
  const longest = Math.max(0, ...groups.map((g) => g.length));
  const roundRobin: SummaryTopPerformer[] = [];
  for (let i = 0; i < longest; i++) {
    for (const group of groups) {
      if (group[i]) roundRobin.push(group[i]);
    }
  }

  for (const performer of roundRobin) {
    const key = nameKey(performer.name);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, { ...performer });
      continue;
    }
    existing.categories = [
      ...existing.categories,
      ...performer.categories.filter((c) => !existing.categories.includes(c)),
    ];
    existing.highlight = `${existing.highlight} · ${performer.highlight}`;
    if (existing.className === "—") existing.className = performer.className;
  }

  return [...merged.values()]
    .map((p) => ({
      ...p,
      className:
        p.className && p.className !== "—"
          ? p.className
          : classLookup.get(nameKey(p.name)) ?? "—",
    }))
    .slice(0, MAX_TOP_PERFORMERS);
}

/** Builds the Summary tab purely from spreadsheet-backed payloads. */
export function buildSummary(src: SummarySources): SummaryDashboardData {
  const stats: SummaryStat[] = [];
  const highlights: Highlight[] = [];
  const performerGroups: SummaryTopPerformer[][] = [];
  const classLookup = new Map<string, string>();

  // IDN Lomba
  if (src.lomba.connected) {
    const lomba = src.lomba.data;
    const lombaStats = computeLombaStats(lomba);
    const groups = groupLombaByStatus(lomba);
    const leaderboard = buildLeaderboard(lomba);
    const top = getSpotlightStudent(leaderboard);

    stats.push({
      id: "prestasi",
      label: "Total Prestasi Lomba",
      value: lombaStats.totalKejuaraan,
      program: "lomba",
      description: `${groups.Pendaftaran.length} pendaftaran · ${groups.Pelaksanaan.length} pelaksanaan · ${groups.Selesai.length} selesai${top ? ` — dipimpin ${top.name}` : ""}`,
    });
    highlights.push(
      top
        ? {
            id: "h-lomba",
            program: "IDN Lomba",
            title: `${firstName(top.name)} · Top Juara`,
            value: String(top.totalJuara),
            accent: "amber",
          }
        : {
            id: "h-lomba",
            program: "IDN Lomba",
            title: "Belum ada juara",
            value: "0",
            accent: "amber",
          }
    );

    for (const s of leaderboard) {
      if (s.className) classLookup.set(nameKey(s.name), s.className);
    }
    performerGroups.push(
      leaderboard
        .filter((s) => s.totalJuara > 0)
        .slice(0, PER_PROGRAM_PERFORMERS)
        .map((student) => {
          const best = bestAchievementFor(lomba, student.id);
          return {
            id: `lomba-${student.id}`,
            name: student.name,
            className: student.className || "—",
            categories: ["Lomba"],
            highlight: best
              ? `Juara ${best.peringkat} ${best.nama_lomba} (${best.tingkat_lomba}) · ${student.points} poin`
              : `${student.totalJuara} perolehan juara · ${student.points} poin`,
          };
        })
    );
  } else {
    stats.push(
      pendingStat({ id: "prestasi", label: "Total Prestasi Lomba", program: "lomba" })
    );
    highlights.push(
      pendingHighlight({ id: "h-lomba", program: "IDN Lomba", accent: "amber" })
    );
  }

  // IDN Mengajar
  if (src.mengajar.connected) {
    const { rekap, log } = src.mengajar;
    const mengajarStats = computeMengajarStats(rekap, log);
    const leaderboard = buildMengajarLeaderboard(rekap);
    const top = leaderboard[0];

    stats.push({
      id: "sesi-mengajar",
      label: "Total Sesi Mengajar",
      value: mengajarStats.totalSesi,
      program: "mengajar",
      description: `${mengajarStats.totalSekolah} sekolah mitra · ${formatNum(mengajarStats.totalPeserta)} peserta didik luar`,
    });
    highlights.push(
      top
        ? {
            id: "h-mengajar",
            program: "IDN Mengajar",
            title: `${firstName(top.nama)} · Top Pengajar`,
            value: String(top.totalMengajar),
            accent: "cyan",
          }
        : {
            id: "h-mengajar",
            program: "IDN Mengajar",
            title: "Belum ada sesi mengajar",
            value: "0",
            accent: "cyan",
          }
    );

    for (const r of rekap) {
      if (r.kelas) classLookup.set(nameKey(r.nama), r.kelas);
    }
    performerGroups.push(
      leaderboard.slice(0, PER_PROGRAM_PERFORMERS).map((r) => ({
        id: `mengajar-${r.id}`,
        name: r.nama,
        className: r.kelas || "—",
        categories: ["Mengajar"],
        highlight: `${r.totalMengajar} sesi mengajar`,
      }))
    );
  } else {
    stats.push(
      pendingStat({
        id: "sesi-mengajar",
        label: "Total Sesi Mengajar",
        program: "mengajar",
      })
    );
    highlights.push(
      pendingHighlight({ id: "h-mengajar", program: "IDN Mengajar", accent: "cyan" })
    );
  }

  // IDN Menulis & Sertifikasi (data per kelas, bukan per siswa)
  if (src.menulis.connected) {
    const menulisStats = computeMenulisStats(src.menulis);
    const top = menulisStats.topMenulis;

    stats.push({
      id: "menulis",
      label: "Total Halaman Menulis",
      value: formatNum(menulisStats.totalPencapaianMenulis),
      program: "menulis",
      description: `${formatPct(menulisStats.persenMenulis)} dari target ${formatNum(menulisStats.totalTargetMenulis)} hlm · ${formatNum(menulisStats.totalPencapaianSertifikat)} sertifikat`,
    });
    highlights.push(
      top
        ? {
            id: "h-menulis",
            program: "IDN Menulis",
            title: `Kelas ${top.kelas} · Top Menulis`,
            value: formatNum(top.pencapaian),
            accent: "emerald",
          }
        : {
            id: "h-menulis",
            program: "IDN Menulis",
            title: "Belum ada pencapaian",
            value: "0",
            accent: "emerald",
          }
    );
  } else {
    stats.push(
      pendingStat({ id: "menulis", label: "Total Halaman Menulis", program: "menulis" })
    );
    highlights.push(
      pendingHighlight({ id: "h-menulis", program: "IDN Menulis", accent: "emerald" })
    );
  }

  // IDN Talking
  if (src.talking.connected) {
    const { podcast, wtt, wet } = src.talking;
    const speakers = buildTalkingSpeakers(src.talking);
    const top = speakers[0];

    stats.push({
      id: "talking",
      label: "Total Sesi Talking",
      value: podcast.length + wtt.length + wet.length,
      program: "talking",
      description: `${podcast.length} Podcast · ${wtt.length} WTT · ${wet.length} WET`,
    });
    highlights.push(
      top
        ? {
            id: "h-talking",
            program: "IDN Talking",
            title: `${firstName(top.name)} · Top Speaker`,
            value: String(top.sessions),
            accent: "pink",
          }
        : {
            id: "h-talking",
            program: "IDN Talking",
            title: "Belum ada sesi",
            value: "0",
            accent: "pink",
          }
    );

    performerGroups.push(
      speakers.slice(0, PER_PROGRAM_PERFORMERS).map((s) => ({
        id: `talking-${nameKey(s.name)}`,
        name: s.name,
        className: s.kelas || "—",
        categories: ["Talking"],
        highlight: `${s.sessions} sesi ${[...s.programs].join("/")}`,
      }))
    );
  } else {
    stats.push(
      pendingStat({ id: "talking", label: "Total Sesi Talking", program: "talking" })
    );
    highlights.push(
      pendingHighlight({ id: "h-talking", program: "IDN Talking", accent: "pink" })
    );
  }

  // IDN Seminar
  if (src.seminar.connected) {
    const seminarStats = computeSeminarStats(src.seminar.data);
    stats.push({
      id: "seminar",
      label: "Rata-rata Ketercapaian Seminar",
      value: formatSeminarPct(seminarStats.rataRata),
      program: "seminar",
      description: `${seminarStats.pekanSelesai} pekan selesai 100% · ${seminarStats.totalPekan} pekan`,
    });
  } else {
    stats.push(
      pendingStat({
        id: "seminar",
        label: "Rata-rata Ketercapaian Seminar",
        program: "seminar",
      })
    );
  }

  return {
    stats,
    highlights,
    topPerformers: mergePerformers(performerGroups, classLookup),
  };
}
