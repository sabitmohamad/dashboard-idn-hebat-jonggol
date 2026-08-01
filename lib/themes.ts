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
  karakter: {
    id: "karakter",
    label: "IDN Karakter",
    primary: "#14B8A6",
    secondary: "#059669",
    primaryRgb: "20, 184, 166",
    secondaryRgb: "5, 150, 105",
    glowRgb: "20, 184, 166",
  },
  tahfidz: {
    id: "tahfidz",
    label: "IDN Tahfidz",
    primary: "#2563EB",
    secondary: "#7C3AED",
    primaryRgb: "37, 99, 235",
    secondaryRgb: "124, 58, 237",
    glowRgb: "37, 99, 235",
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
