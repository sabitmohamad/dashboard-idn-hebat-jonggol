export type SheetRow = Record<string, string>;

export type MenuId =
  | "summary"
  | "mengajar"
  | "lomba"
  | "menulis"
  | "talking"
  | "karakter"
  | "tahfidz";

export interface NavItem {
  id: MenuId;
  label: string;
}

export type KpiIcon =
  | "school"
  | "activity"
  | "calendar"
  | "users"
  | "trophy"
  | "medal"
  | "flag"
  | "fileText"
  | "badgeCheck"
  | "bookOpen"
  | "pen"
  | "mic"
  | "headphones"
  | "radio"
  | "video"
  | "heart"
  | "star"
  | "smile"
  | "award"
  | "book"
  | "target"
  | "scroll"
  | "sparkles"
  | "layers";

export type KpiAccent =
  | "blue"
  | "cyan"
  | "indigo"
  | "amber"
  | "orange"
  | "red"
  | "emerald"
  | "mint"
  | "purple"
  | "pink"
  | "teal"
  | "green"
  | "royal"
  | "violet"
  | "rainbow";

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  icon: KpiIcon;
  accent: KpiAccent;
}

export interface StudentRank {
  rank: number;
  name: string;
  className: string;
  days: number;
  school?: string;
}

export interface SpotlightStudent {
  name: string;
  className: string;
  school: string;
  flightHours: number;
  subtitle: string;
  metricTitle?: string;
  metricUnit?: string;
}

export interface StatusSlice {
  name: string;
  value: number;
  color: string;
}

export interface PartnerSchool {
  name: string;
  status: "Aktif" | "Persiapan" | "Selesai";
  team: string[];
}

export interface SidePanelItem {
  title: string;
  subtitle: string;
  badge?: string;
}

export interface MengajarDashboardData {
  kpis: KpiMetric[];
  spotlight: SpotlightStudent;
  leaderboard: StudentRank[];
  statusProgram: StatusSlice[];
  partnerSchools: PartnerSchool[];
  connected: boolean;
}

export interface ProgramDashboardData {
  kpis: KpiMetric[];
  spotlight: SpotlightStudent;
  leaderboard: StudentRank[];
  chart: StatusSlice[];
  chartTitle: string;
  leaderboardTitle: string;
  metricUnit: string;
  sidePanel?: {
    title: string;
    items: SidePanelItem[];
  };
}

export interface SummaryStat {
  id: string;
  label: string;
  value: string | number;
  program: Exclude<MenuId, "summary">;
  description: string;
}

export interface SummaryTopPerformer {
  id: string;
  name: string;
  className: string;
  categories: string[];
  highlight: string;
}

export interface SummaryDashboardData {
  stats: SummaryStat[];
  highlights: {
    id: string;
    program: string;
    title: string;
    value: string;
    accent: KpiAccent;
  }[];
  topPerformers?: SummaryTopPerformer[];
}
