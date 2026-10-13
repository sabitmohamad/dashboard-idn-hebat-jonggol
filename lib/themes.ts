import type { MenuId } from "./types";

export interface MenuTheme {
  id: MenuId;
  label: string;
  primary: string;
  secondary: string;
  primaryRgb: string;
  secondaryRgb: string;
  glowRgb: string;
}

export const MENU_THEMES: Record<MenuId, MenuTheme> = {
  summary: {
    id: "summary",
    label: "Summary",
    primary: "#4F46E5",
    secondary: "#A855F7",
    primaryRgb: "79, 70, 229",
    secondaryRgb: "168, 85, 247",
    glowRgb: "99, 102, 241",
  },
  mengajar: {
    id: "mengajar",
    label: "IDN Mengajar",
    primary: "#3B82F6",
    secondary: "#06B6D4",
    primaryRgb: "59, 130, 246",
    secondaryRgb: "6, 182, 212",
    glowRgb: "59, 130, 246",
  },
  lomba: {
    id: "lomba",
    label: "IDN Lomba",
    primary: "#F59E0B",
    secondary: "#EF4444",
    primaryRgb: "245, 158, 11",
    secondaryRgb: "239, 68, 68",
    glowRgb: "245, 158, 11",
  },
  menulis: {
    id: "menulis",
    label: "IDN Menulis & Sertifikasi",
    primary: "#10B981",
    secondary: "#34D399",
    primaryRgb: "16, 185, 129",
    secondaryRgb: "52, 211, 153",
    glowRgb: "16, 185, 129",
  },
  talking: {
    id: "talking",
    label: "IDN Talking",
    primary: "#A855F7",
    secondary: "#EC4899",
    primaryRgb: "168, 85, 247",
    secondaryRgb: "236, 72, 153",
    glowRgb: "168, 85, 247",
  },
  tabungan: {
    id: "tabungan",
    label: "Tabungan Siswa",
    primary: "#EAB308",
    secondary: "#84CC16",
    primaryRgb: "234, 179, 8",
    secondaryRgb: "132, 204, 22",
    glowRgb: "234, 179, 8",
  },
  seminar: {
    id: "seminar",
    label: "IDN Seminar",
    primary: "#0EA5E9",
    secondary: "#6366F1",
    primaryRgb: "14, 165, 233",
    secondaryRgb: "99, 102, 241",
    glowRgb: "14, 165, 233",
  },
};

export function getTheme(menuId: MenuId): MenuTheme {
  return MENU_THEMES[menuId];
}

export function themeCssVars(theme: MenuTheme): Record<string, string> {
  return {
    "--theme-primary": theme.primary,
    "--theme-secondary": theme.secondary,
    "--theme-primary-rgb": theme.primaryRgb,
    "--theme-secondary-rgb": theme.secondaryRgb,
    "--theme-glow-rgb": theme.glowRgb,
    "--glass-border": `rgba(${theme.primaryRgb}, 0.22)`,
  };
}
