"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  Headphones,
  Layers,
  Presentation,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Radio,
  School,
  Trophy,
  Tv,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { getTheme } from "@/lib/themes";
import type { MenuId } from "@/lib/types";

const DAYS_ID = [
  "MINGGU",
  "SENIN",
  "SELASA",
  "RABU",
  "KAMIS",
  "JUMAT",
  "SABTU",
];

const MONTHS_ID = [
  "JANUARI",
  "FEBRUARI",
  "MARET",
  "APRIL",
  "MEI",
  "JUNI",
  "JULI",
  "AGUSTUS",
  "SEPTEMBER",
  "OKTOBER",
  "NOVEMBER",
  "DESEMBER",
];

const TITLE_BY_MENU: Record<MenuId, string> = {
  summary: "IDN Hebat",
  mengajar: "IDN Mengajar",
  lomba: "IDN Lomba",
  menulis: "IDN Menulis & Sertifikasi",
  talking: "IDN Talking",
  tabungan: "Tabungan Siswa",
  seminar: "IDN Seminar",
};

const ICON_BY_MENU: Record<MenuId, LucideIcon> = {
  summary: Layers,
  mengajar: School,
  lomba: Trophy,
  menulis: FileText,
  talking: Headphones,
  tabungan: Wallet,
  seminar: Presentation,
};

function formatClock(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const day = DAYS_ID[date.getDay()];
  const dateNum = date.getDate();
  const month = MONTHS_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${hh}.${mm} - ${day}, ${dateNum} ${month} ${year}`;
}

function ProgressRing({
  progress,
  size = 28,
  stroke = 2.5,
}: {
  progress: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

interface HeaderProps {
  connected: boolean;
  /** True while the first sheet request is still in flight. */
  syncing?: boolean;
  activeMenu: MenuId;
  tvMode: boolean;
  isFullscreen: boolean;
  slideProgress: number;
  slideSeconds: number;
  onToggleTvMode: () => void;
  onToggleFullscreen: () => void;
}

export function Header({
  connected,
  syncing = false,
  activeMenu,
  tvMode,
  isFullscreen,
  slideProgress,
  slideSeconds,
  onToggleTvMode,
  onToggleFullscreen,
}: HeaderProps) {
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const theme = getTheme(activeMenu);
  const title = TITLE_BY_MENU[activeMenu];
  const TitleIcon = ICON_BY_MENU[activeMenu];
  const secondsLeft = Math.max(
    1,
    Math.ceil(slideSeconds * (1 - slideProgress))
  );

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="glass-card relative sticky top-0 z-40 rounded-none border-x-0 border-t-0 px-4 py-4 sm:px-6 lg:px-8">
      {/* TV slide progress strip */}
      {tvMode ? (
        <div
          className="absolute inset-x-0 top-0 h-[3px] overflow-hidden bg-white/5"
          aria-hidden
        >
          <div
            className="h-full transition-none"
            style={{
              width: `${slideProgress * 100}%`,
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 0 12px rgba(${theme.glowRgb}, 0.7)`,
            }}
          />
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Brand */}
        <div className="flex items-start gap-3 sm:items-center">
          <div className="relative mt-0.5 flex h-12 w-[7.5rem] shrink-0 items-center sm:mt-0 sm:h-14 sm:w-40">
            <Image
              src="/idn-boarding-school-logo.png"
              alt="IDN Boarding School"
              fill
              priority
              className="object-contain object-left"
              sizes="160px"
            />
          </div>
          <div className="min-w-0 border-l border-white/10 pl-3 sm:pl-4">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan-400/90 sm:text-xs">
              DASHBOARD PRESTASI SISWA SMP IDN JONGGOL
            </p>
            <div className="mt-1 flex min-h-[2rem] items-center gap-2.5 sm:min-h-[2.25rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeMenu}
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border sm:h-9 sm:w-9"
                  style={{
                    borderColor: `rgba(${theme.primaryRgb}, 0.45)`,
                    background: `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.35), rgba(${theme.secondaryRgb}, 0.15))`,
                    boxShadow: `0 0 18px rgba(${theme.glowRgb}, 0.45)`,
                    color: theme.primary,
                  }}
                  aria-hidden
                >
                  <TitleIcon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
                </motion.div>
              </AnimatePresence>

              <div className="relative min-w-0 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h1
                    key={title}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl"
                  >
                    {title}
                  </motion.h1>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          {tvMode ? (
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: `rgba(${theme.primaryRgb}, 0.4)`,
                backgroundColor: `rgba(${theme.primaryRgb}, 0.12)`,
                color: theme.secondary,
              }}
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span style={{ color: theme.primary }}>
                  <ProgressRing progress={slideProgress} />
                </span>
                <span className="absolute text-[9px] font-bold text-white">
                  {secondsLeft}
                </span>
              </span>
              <Tv className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[11px] font-semibold tracking-wide text-white sm:text-xs">
                TV AUTO-PLAYING ({slideSeconds}s)
              </span>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTvMode}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                tvMode
                  ? "border-white/20 text-white"
                  : "border-white/10 text-slate-200 hover:border-white/25 hover:bg-white/5"
              }`}
              style={
                tvMode
                  ? {
                      background: `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.45), rgba(${theme.secondaryRgb}, 0.25))`,
                      boxShadow: `0 4px 18px rgba(${theme.primaryRgb}, 0.35)`,
                    }
                  : undefined
              }
              aria-pressed={tvMode}
              title={tvMode ? "Pause TV Mode" : "Start TV Mode"}
            >
              {tvMode ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {tvMode ? "Pause TV" : "TV Mode"}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleFullscreen}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-white/25 hover:bg-white/5 sm:text-sm"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              aria-pressed={isFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span className="hidden md:inline">
                {isFullscreen ? "Exit" : "Fullscreen"}
              </span>
            </button>
          </div>

          <div className="rounded-xl border border-[rgba(var(--theme-primary-rgb),0.25)] bg-[#0F172A]/60 px-3 py-2 font-mono text-xs text-slate-200 sm:text-sm">
            {clock}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5">
            <span
              className={`pulse-dot h-2.5 w-2.5 rounded-full ${
                connected || syncing ? "bg-cyan-400" : "bg-amber-400"
              }`}
            />
            <Radio
              className={`h-3.5 w-3.5 ${
                connected || syncing ? "text-cyan-400" : "text-amber-400"
              }`}
            />
            <span className="text-[11px] font-semibold tracking-wide text-slate-200 sm:text-xs">
              {connected
                ? "LIVE SYNC - Google Sheets Connected"
                : syncing
                  ? "SYNC - Menghubungkan Google Sheets"
                  : "SYNC - Data Contoh"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
