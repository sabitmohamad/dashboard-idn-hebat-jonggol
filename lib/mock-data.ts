import { getStudent, IDN_STUDENTS } from "./students";
import type {
  MenuId,
  ProgramDashboardData,
  StudentRank,
} from "./types";

function rank(
  order: { name: string; days: number; school: string }[]
): StudentRank[] {
  return order.map((item, i) => {
    const s = getStudent(item.name);
    return {
      rank: i + 1,
      name: s.name,
      className: s.className,
      days: item.days,
      school: item.school,
    };
  });
}

function spotlightFrom(
  name: string,
  opts: {
    role: string;
    school: string;
    flightHours: number;
    subtitle: string;
    metricTitle: string;
    metricUnit: string;
  }
) {
  const s = getStudent(name);
  return {
    name: s.name,
    className: `${s.className} · ${opts.role}`,
    school: opts.school,
    flightHours: opts.flightHours,
    subtitle: opts.subtitle,
    metricTitle: opts.metricTitle,
    metricUnit: opts.metricUnit,
  };
}

// ─── IDN Lomba ───────────────────────────────────────────────────────────────

export const MOCK_LOMBA: ProgramDashboardData = {
  kpis: [
    { id: "kejuaraan", label: "Total Kejuaraan", value: 47, icon: "trophy", accent: "amber" },
    { id: "emas", label: "Medali Emas", value: 18, icon: "medal", accent: "orange" },
    { id: "nasional", label: "Tingkat Nasional", value: 12, icon: "flag", accent: "red" },
    { id: "peserta", label: "Total Peserta", value: 86, icon: "users", accent: "amber" },
  ],
  spotlight: spotlightFrom("Rajjah Abqory Yasir", {
    role: "Robotics",
    school: "SMP IDN Jonggol",
    flightHours: 9,
    subtitle: "Siswa Berprestasi",
    metricTitle: "Total Medali",
    metricUnit: "medali",
  }),
  leaderboard: rank([
    { name: "Rajjah Abqory Yasir", days: 9, school: "Gemastik Hackathon" },
    { name: "Salman Hanan Mufti", days: 7, school: "Olympiad Matematika" },
    { name: "Utara Wicaksono", days: 6, school: "Cyber Security Competition" },
    { name: "Abdul Malik Karim Arvinahl", days: 5, school: "Robotics Challenge" },
    { name: "Ahsan Khalifi Fajriyanto", days: 5, school: "Lomba Web Design" },
    { name: "Almer Hadyan Raditya Den", days: 4, school: "Gemastik Hackathon" },
    { name: "Hans Roy Ghaffar", days: 4, school: "Olympiad Matematika" },
    { name: "Ahmad Syafi Multazam", days: 3, school: "Cyber Security Competition" },
    { name: "Yandhi Herlambang", days: 3, school: "Robotics Challenge" },
    { name: "Zidane Fathan Alfarisii", days: 2, school: "Lomba Web Design" },
  ]),
  chart: [
    { name: "Kabupaten", value: 16, color: "#FBBF24" },
    { name: "Provinsi", value: 14, color: "#F59E0B" },
    { name: "Nasional", value: 12, color: "#EF4444" },
    { name: "Internasional", value: 5, color: "#DC2626" },
  ],
  chartTitle: "Tingkat Kompetisi",
  leaderboardTitle: "Leaderboard Perolehan Juara",
  metricUnit: "medali",
  sidePanel: {
    title: "Kejuaraan Terbaru",
    items: [
      {
        title: "Gemastik Hackathon",
        subtitle: "Rajjah Abqory Yasir · Medali Emas",
        badge: "Juara 1",
      },
      {
        title: "Olympiad Matematika",
        subtitle: "Salman Hanan Mufti · Medali Perak",
        badge: "Juara 2",
      },
      {
        title: "Cyber Security Competition",
        subtitle: "Utara Wicaksono · Medali Perunggu",
        badge: "Nasional",
      },
      {
        title: "Robotics Challenge",
        subtitle: "Abdul Malik Karim Arvinahl · Medali Emas",
        badge: "Juara 1",
      },
    ],
  },
};

// ─── IDN Menulis & Sertifikasi ───────────────────────────────────────────────

export const MOCK_MENULIS: ProgramDashboardData = {
  kpis: [
    { id: "artikel", label: "Artikel Published", value: 128, icon: "fileText", accent: "emerald" },
    { id: "sertifikasi", label: "Sertifikasi Terbit", value: 64, icon: "badgeCheck", accent: "mint" },
    { id: "readers", label: "Reader Count", value: "12.4K", icon: "bookOpen", accent: "green" },
    { id: "writers", label: "Active Writers", value: 38, icon: "pen", accent: "emerald" },
  ],
  spotlight: spotlightFrom("Muhammad Al Ghani Izzaldin", {
    role: "Content Writer",
    school: "Portal IDN Media",
    flightHours: 24,
    subtitle: "Top Author of the Month",
    metricTitle: "Artikel Terbit",
    metricUnit: "artikel",
  }),
  leaderboard: rank([
    { name: "Muhammad Al Ghani Izzaldin", days: 24, school: "Tech & Education" },
    { name: "Muhammad Fathan Ghifari", days: 19, school: "Religion" },
    { name: "Khairy Nabihan Elfathin", days: 17, school: "Education" },
    { name: "Luqman", days: 15, school: "Tech" },
    { name: "Ahmad Syafi Multazam", days: 14, school: "Lifestyle" },
    { name: "Hazlam Ibad Athaillah", days: 12, school: "Religion" },
    { name: "Kenzie Aflah Mulyana", days: 11, school: "Education" },
    { name: "Rayyan Firdaus Sudais", days: 10, school: "Tech" },
    { name: "Sabil Tsaqib Hasibuan", days: 9, school: "Opinion" },
    { name: "Achtarruziq Ali Firnandi", days: 8, school: "Education" },
  ]),
  chart: [
    { name: "Tech", value: 42, color: "#10B981" },
    { name: "Religion", value: 38, color: "#34D399" },
    { name: "Education", value: 48, color: "#059669" },
  ],
  chartTitle: "Kategori Artikel",
  leaderboardTitle: "Top Writers",
  metricUnit: "artikel",
  sidePanel: {
    title: "Latest Articles",
    items: [
      {
        title: "Tutorial Next.js 14",
        subtitle: "Muhammad Al Ghani Izzaldin · 2.1K readers",
        badge: "Tech",
      },
      {
        title: "Panduan Flutter GetX",
        subtitle: "Muhammad Fathan Ghifari · 1.8K readers",
        badge: "Tech",
      },
      {
        title: "Adab Menuntut Ilmu",
        subtitle: "Khairy Nabihan Elfathin · 1.5K readers",
        badge: "Religion",
      },
      {
        title: "Menjadi Muslim Technopreneur",
        subtitle: "Luqman · 1.2K readers",
        badge: "Education",
      },
      {
        title: "Tips Sertifikasi CCNA",
        subtitle: "Ahmad Syafi Multazam · 1.1K readers",
        badge: "Tech",
      },
    ],
  },
};

// ─── IDN Talking (WET, WTT, Podcast) ─────────────────────────────────────────

export const MOCK_TALKING: ProgramDashboardData = {
  kpis: [
    { id: "episode", label: "Total Episode", value: 96, icon: "mic", accent: "purple" },
    { id: "listeners", label: "Total Listeners/Views", value: "48.2K", icon: "headphones", accent: "pink" },
    { id: "wet", label: "WET Sessions", value: 32, icon: "radio", accent: "purple" },
    { id: "wtt", label: "WTT Sessions", value: 28, icon: "video", accent: "pink" },
  ],
  spotlight: spotlightFrom("Almer Hadyan Raditya Den", {
    role: "Public Speaking",
    school: "IDN Podcast Studio",
    flightHours: 22,
    subtitle: "Top Speaker / Presenter",
    metricTitle: "Episode Hosted",
    metricUnit: "episode",
  }),
  leaderboard: rank([
    { name: "Almer Hadyan Raditya Den", days: 22, school: "Podcast Host" },
    { name: "Ahsan Khalifi Fajriyanto", days: 18, school: "WET Moderator" },
    { name: "Hans Roy Ghaffar", days: 16, school: "WTT Speaker" },
    { name: "Yandhi Herlambang", days: 14, school: "Podcast Guest" },
    { name: "Zidane Fathan Alfarisii", days: 13, school: "WET Panelist" },
    { name: "Rajjah Abqory Yasir", days: 12, school: "YouTube Host" },
    { name: "Salman Hanan Mufti", days: 11, school: "WTT Coach" },
    { name: "Utara Wicaksono", days: 10, school: "Podcast Editor" },
    { name: "Ahmad Husein", days: 9, school: "WET Speaker" },
    { name: "Kenzie Aflah Mulyana", days: 8, school: "School Audio" },
  ]),
  chart: [
    { name: "Spotify", value: 38, color: "#A855F7" },
    { name: "YouTube", value: 42, color: "#EC4899" },
    { name: "School Audio", value: 20, color: "#C084FC" },
  ],
  chartTitle: "Platform Breakdown",
  leaderboardTitle: "Top Speakers / Presenters",
  metricUnit: "episode",
  sidePanel: {
    title: "Episode Highlights",
    items: [
      {
        title: "Weekly English Talk: AI in Future",
        subtitle: "Almer Hadyan Raditya Den · 4.2K views",
        badge: "WET",
      },
      {
        title: "Weekly Tech Talk: Laravel Sanctum",
        subtitle: "Hans Roy Ghaffar · 3.8K views",
        badge: "WTT",
      },
      {
        title: "Podcast Santri Tech",
        subtitle: "Ahsan Khalifi Fajriyanto · 3.1K listens",
        badge: "Podcast",
      },
      {
        title: "Weekly English Talk: Soft Skills",
        subtitle: "Yandhi Herlambang · 2.4K views",
        badge: "WET",
      },
    ],
  },
};

export const PROGRAM_MOCK_MAP: Record<
  Exclude<MenuId, "summary" | "mengajar" | "tabungan" | "seminar">,
  ProgramDashboardData
> = {
  lomba: MOCK_LOMBA,
  menulis: MOCK_MENULIS,
  talking: MOCK_TALKING,
};

export function getProgramMock(
  menuId: Exclude<MenuId, "summary" | "mengajar" | "tabungan" | "seminar">
): ProgramDashboardData {
  return PROGRAM_MOCK_MAP[menuId];
}

/** Sheet tab candidates per menu (tried in order by the API / client). */
export const SHEET_TAB_CANDIDATES: Record<MenuId, string[]> = {
  summary: ["Data Siswa", "Data_Siswa", "Summary"],
  mengajar: ["IDN Mengajar", "Mengajar", "Data Siswa", "Data_Siswa", "Sheet1"],
  // Program tabs that are aggregate-only (no Nama) fall back to mock in mapSheetsToProgram.
  // Do not use Data Siswa as a silent stand-in for program leaderboards.
  lomba: ["IDN Lomba", "Lomba"],
  menulis: [
    "Menulis_Sertifikasi_Report",
    "Menulis_Log",
    "Sertifikasi_Log",
    "IDN Menulis dan Sertifikasi",
    "IDN Menulis",
    "Menulis",
  ],
  talking: ["Talking_Log", "IDN Talking", "Talking"],
  tabungan: ["Tabungan_Log", "Data_Tabungan", "Tabungan", "Tabungan Siswa"],
  seminar: ["Seminar_Report"],
};

export { IDN_STUDENTS };
