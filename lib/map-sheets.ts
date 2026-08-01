import { getProgramMock } from "./mock-data";
import { IDN_STUDENTS } from "./students";
import type {
  KpiMetric,
  MengajarDashboardData,
  MenuId,
  PartnerSchool,
  ProgramDashboardData,
  SheetRow,
  SpotlightStudent,
  StatusSlice,
  StudentRank,
} from "./types";

function pick(row: SheetRow, keys: string[]): string {
  const entries = Object.entries(row);
  for (const key of keys) {
    const found = entries.find(
      ([k]) => k.trim().toLowerCase() === key.toLowerCase()
    );
    if (found?.[1]?.trim()) return found[1].trim();
  }
  for (const key of keys) {
    const k = key.toLowerCase();
    const found = entries.find(([header]) => {
      const h = header.trim().toLowerCase();
      // Avoid false positives like "Total Siswa" matching key "Siswa"
      if (h.includes("total") || h.includes("jumlah") || h.includes("frekuensi")) {
        return false;
      }
      return h === k || h.startsWith(`${k} `) || h.startsWith(`${k}/`) || h.endsWith(` ${k}`);
    });
    if (found?.[1]?.trim()) return found[1].trim();
  }
  return "";
}

function toNumber(value: string): number {
  const n = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

/** Reject aggregate metrics mistaken for student names (e.g. "67" from Total Siswa). */
function isPersonName(value: string): boolean {
  const v = value.trim();
  if (v.length < 3) return false;
  if (/^[\d.,%\s]+$/.test(v)) return false;
  if (/^(kelas|bulan|total|juli|agustus|september|oktober|november|desember|januari|februari|maret|april|mei|juni)\b/i.test(v)) {
    return false;
  }
  return /[a-zA-Z\u00C0-\u024F]/.test(v);
}

const NAME_KEYS = [
  "Nama Siswa",
  "Nama Lengkap",
  "Nama",
  "Nama Pengajar",
  "Pengajar",
  "Speaker",
  "Author",
  "Penulis",
];

const CLASS_KEYS = ["Kelas", "Class", "Jurusan", "Grade"];
const METRIC_KEYS = [
  "Hari Mengajar",
  "Total Hari",
  "Hari",
  "Days",
  "Jumlah Hari",
  "Medali",
  "Poin",
  "Skor",
  "Skor Kedisiplinan",
  "Artikel",
  "Episode",
  "Juz",
  "Jumlah Juz",
  "Nilai",
  "Score",
];
const CONTEXT_KEYS = [
  "Mitra Sekolah",
  "Sekolah Mitra",
  "Sekolah",
  "Nama Sekolah",
  "Lomba",
  "Kompetisi",
  "Artikel",
  "Kategori",
  "Sesi",
  "Session",
  "Predikat",
  "Award",
  "Penghargaan",
  "Halaqah",
  "Badge",
];

const FALLBACK: MengajarDashboardData = {
  connected: false,
  kpis: [
    { id: "mitra", label: "Mitra Sekolah", value: 8, icon: "school", accent: "blue" },
    { id: "kegiatan", label: "Total Kegiatan", value: 24, icon: "activity", accent: "cyan" },
    { id: "hari", label: "Total Hari Mengajar", value: 156, icon: "calendar", accent: "indigo" },
    { id: "siswa", label: "Siswa Terlibat", value: IDN_STUDENTS.length, icon: "users", accent: "amber" },
  ],
  spotlight: {
    name: IDN_STUDENTS[0].name,
    className: `${IDN_STUDENTS[0].className} · Software Engineering`,
    school: "SMPN 1 Jonggol",
    flightHours: 48,
    subtitle: "Spotlight Pengajar / Siswa",
  },
  leaderboard: IDN_STUDENTS.slice(0, 10).map((s, i) => ({
    rank: i + 1,
    name: s.name,
    className: s.className,
    days: 18 - i,
    school: [
      "SMPN 1 Jonggol",
      "SMPN 2 Jonggol",
      "MTs Al-Hikmah",
      "SMPN 1 Cileungsi",
      "SMPN 3 Jonggol",
      "SMP Islam Terpadu",
      "MTs Nurul Falah",
      "SMPN 1 Jonggol",
      "SMPN 2 Jonggol",
      "SMPN 1 Cileungsi",
    ][i],
  })),
  statusProgram: [
    { name: "Persiapan", value: 4, color: "#F59E0B" },
    { name: "Pelaksanaan", value: 12, color: "#3B82F6" },
    { name: "Selesai", value: 8, color: "#06B6D4" },
  ],
  partnerSchools: [
    {
      name: "SMPN 1 Jonggol",
      status: "Aktif",
      team: [
        IDN_STUDENTS[0].name,
        IDN_STUDENTS[1].name,
        IDN_STUDENTS[15].name,
      ],
    },
    {
      name: "SMPN 2 Jonggol",
      status: "Aktif",
      team: [IDN_STUDENTS[2].name, IDN_STUDENTS[14].name],
    },
    {
      name: "MTs Al-Hikmah",
      status: "Persiapan",
      team: [IDN_STUDENTS[3].name],
    },
  ],
};

function aggregateStudents(
  rows: SheetRow[],
  metricKeys: string[] = METRIC_KEYS
): { name: string; className: string; school: string; days: number }[] {
  const dayMap = new Map<
    string,
    { name: string; className: string; school: string; days: number }
  >();

  for (const row of rows) {
    const name = pick(row, NAME_KEYS);
    if (!name || !isPersonName(name)) continue;
    const className = pick(row, CLASS_KEYS) || "—";
    const school = pick(row, CONTEXT_KEYS) || "—";
    const daysRaw = pick(row, metricKeys);
    const days = daysRaw ? toNumber(daysRaw) : 1;
    const prev = dayMap.get(name);
    if (prev) {
      prev.days += days;
      if (school !== "—" && prev.school === "—") prev.school = school;
    } else {
      dayMap.set(name, { name, className, school, days });
    }
  }

  return [...dayMap.values()].sort((a, b) => {
    if (b.days !== a.days) return b.days - a.days;
    return a.name.localeCompare(b.name, "id");
  });
}

export function mapSheetsToMengajar(rows: SheetRow[]): MengajarDashboardData {
  if (!rows.length) {
    return { ...FALLBACK, connected: true };
  }

  const schools = unique(
    rows.map((r) =>
      pick(r, [
        "Mitra Sekolah",
        "Sekolah Mitra",
        "Sekolah",
        "Nama Sekolah",
        "Partner School",
      ])
    )
  );

  const students = unique(rows.map((r) => pick(r, NAME_KEYS)));

  const totalDays = rows.reduce((sum, r) => {
    const days = pick(r, [
      "Hari Mengajar",
      "Total Hari",
      "Hari",
      "Days",
      "Jumlah Hari",
    ]);
    return sum + (days ? toNumber(days) : 1);
  }, 0);

  const kegiatan = unique(
    rows.map((r) => pick(r, ["Kegiatan", "Aktivitas", "Program", "Judul"]))
  );

  const hasDayColumn = rows.some((r) =>
    Boolean(
      pick(r, [
        "Hari Mengajar",
        "Total Hari",
        "Hari",
        "Days",
        "Jumlah Hari",
      ])
    )
  );
  const hasKegiatanColumn = kegiatan.length > 0;
  const hasSchoolColumn = schools.length > 0;

  const kpis: KpiMetric[] = [
    {
      id: "mitra",
      label: "Mitra Sekolah",
      value: hasSchoolColumn ? schools.length : FALLBACK.kpis[0].value,
      icon: "school",
      accent: "blue",
    },
    {
      id: "kegiatan",
      label: "Total Kegiatan",
      value: hasKegiatanColumn
        ? kegiatan.length
        : hasDayColumn
          ? rows.length
          : FALLBACK.kpis[1].value,
      icon: "activity",
      accent: "cyan",
    },
    {
      id: "hari",
      label: "Total Hari Mengajar",
      value: hasDayColumn ? totalDays : FALLBACK.kpis[2].value,
      icon: "calendar",
      accent: "indigo",
    },
    {
      id: "siswa",
      label: "Siswa Terlibat",
      value: students.length || rows.length || FALLBACK.kpis[3].value,
      icon: "users",
      accent: "amber",
    },
  ];

  const ranked = aggregateStudents(rows, [
    "Hari Mengajar",
    "Total Hari",
    "Hari",
    "Days",
    "Jumlah Hari",
  ]);

  const leaderboardSource = ranked.length
    ? ranked
    : FALLBACK.leaderboard.map((s) => ({
        name: s.name,
        className: s.className,
        school: s.school || "—",
        days: s.days,
      }));

  const leaderboard: StudentRank[] = leaderboardSource
    .slice(0, 10)
    .map((s, i) => ({
      rank: i + 1,
      name: s.name,
      className: s.className,
      school: s.school,
      days: s.days,
    }));

  const top = leaderboard[0];
  const spotlight: SpotlightStudent = top
    ? {
        name: top.name,
        className: top.className,
        school: top.school && top.school !== "—" ? top.school : "SMP IDN Jonggol",
        flightHours: top.days,
        subtitle: "Spotlight Pengajar / Siswa",
      }
    : FALLBACK.spotlight;

  const statusCount: Record<string, number> = {
    Persiapan: 0,
    Pelaksanaan: 0,
    Selesai: 0,
  };
  let statusHits = 0;

  for (const row of rows) {
    const status = pick(row, ["Status", "Status Program", "Tahap"]).toLowerCase();
    if (!status) continue;
    statusHits += 1;
    if (status.includes("selesai") || status.includes("done") || status.includes("complete")) {
      statusCount.Selesai += 1;
    } else if (
      status.includes("laksana") ||
      status.includes("aktif") ||
      status.includes("progress") ||
      status.includes("berjalan")
    ) {
      statusCount.Pelaksanaan += 1;
    } else if (
      status.includes("persiapan") ||
      status.includes("prep") ||
      status.includes("rencana")
    ) {
      statusCount.Persiapan += 1;
    } else {
      statusCount.Pelaksanaan += 1;
    }
  }

  const statusProgram: StatusSlice[] =
    statusHits > 0
      ? [
          { name: "Persiapan", value: statusCount.Persiapan || 0, color: "#F59E0B" },
          { name: "Pelaksanaan", value: statusCount.Pelaksanaan || 0, color: "#3B82F6" },
          { name: "Selesai", value: statusCount.Selesai || 0, color: "#06B6D4" },
        ]
      : FALLBACK.statusProgram;

  const schoolTeams = new Map<string, Set<string>>();
  const schoolStatus = new Map<string, PartnerSchool["status"]>();

  for (const row of rows) {
    const school = pick(row, [
      "Mitra Sekolah",
      "Sekolah Mitra",
      "Sekolah",
      "Nama Sekolah",
    ]);
    if (!school) continue;
    const name = pick(row, NAME_KEYS);
    if (!schoolTeams.has(school)) schoolTeams.set(school, new Set());
    if (name) schoolTeams.get(school)!.add(name);

    const status = pick(row, ["Status", "Status Program", "Tahap"]).toLowerCase();
    let mapped: PartnerSchool["status"] = "Aktif";
    if (status.includes("selesai")) mapped = "Selesai";
    else if (status.includes("persiapan") || status.includes("prep"))
      mapped = "Persiapan";
    schoolStatus.set(school, mapped);
  }

  const partnerSchools: PartnerSchool[] =
    schoolTeams.size > 0
      ? [...schoolTeams.entries()].slice(0, 4).map(([name, team]) => ({
          name,
          status: schoolStatus.get(name) || "Aktif",
          team: [...team].slice(0, 4),
        }))
      : FALLBACK.partnerSchools;

  return {
    connected: true,
    kpis,
    spotlight,
    leaderboard,
    statusProgram,
    partnerSchools,
  };
}

type ProgramMenuId = Exclude<MenuId, "summary" | "mengajar">;

/**
 * Maps a Google Sheets program tab into ProgramDashboardData.
 * Falls back to enriched IDN roster mock when the sheet is aggregate-only
 * (e.g. IDN Lomba monthly stats) or has no usable student name column.
 */
export function mapSheetsToProgram(
  rows: SheetRow[],
  menuId: ProgramMenuId
): ProgramDashboardData {
  const fallback = getProgramMock(menuId);
  if (!rows.length) return fallback;

  const ranked = aggregateStudents(rows);
  // Aggregate sheets (no Nama column) → keep enriched IDN roster mock
  if (!ranked.length) return fallback;

  const leaderboard: StudentRank[] = ranked.slice(0, 10).map((s, i) => ({
    rank: i + 1,
    name: s.name,
    className: s.className !== "—" ? s.className : "—",
    school: s.school !== "—" ? s.school : undefined,
    days: s.days,
  }));

  const top = leaderboard[0];
  const spotlight: SpotlightStudent = {
    ...fallback.spotlight,
    name: top.name,
    className: top.className,
    school:
      top.school && top.school !== "—"
        ? top.school
        : fallback.spotlight.school,
    flightHours: top.days,
  };

  const sideItems = ranked.slice(0, 4).map((s) => ({
    title: s.school !== "—" ? s.school : s.name,
    subtitle: `${s.name} · ${s.days} ${fallback.metricUnit}`,
    badge: s.className !== "—" ? s.className : undefined,
  }));

  return {
    ...fallback,
    spotlight,
    leaderboard,
    sidePanel: fallback.sidePanel
      ? {
          ...fallback.sidePanel,
          items: sideItems.length ? sideItems : fallback.sidePanel.items,
        }
      : undefined,
  };
}

export { FALLBACK as FALLBACK_MENGAJAR_DATA };
