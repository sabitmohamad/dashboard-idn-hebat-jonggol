"use client";

import {
  FileText,
  Headphones,
  Presentation,
  School,
  Trophy,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { MENU_THEMES } from "@/lib/themes";
import type { KpiAccent, MenuId, SummaryDashboardData } from "@/lib/types";
import { CountUp, Reveal, staggerDelay } from "./Animate";
import { GlassCard } from "./GlassCard";
import { StudentAvatar } from "./StudentAvatar";

const PROGRAM_ICONS: Record<Exclude<MenuId, "summary">, LucideIcon> = {
  mengajar: School,
  lomba: Trophy,
  menulis: FileText,
  talking: Headphones,
  tabungan: Wallet,
  seminar: Presentation,
};

const ACCENT_TEXT: Record<KpiAccent, string> = {
  blue: "text-blue-400",
  cyan: "text-cyan-400",
  indigo: "text-indigo-400",
  amber: "text-amber-400",
  orange: "text-orange-400",
  red: "text-red-400",
  emerald: "text-emerald-400",
  mint: "text-emerald-300",
  purple: "text-purple-400",
  pink: "text-pink-400",
  teal: "text-teal-400",
  green: "text-green-400",
  royal: "text-blue-400",
  violet: "text-violet-400",
  rainbow: "text-indigo-300",
};

interface SummaryViewProps {
  data: SummaryDashboardData;
  onSelectMenu?: (id: MenuId) => void;
}

const HIGHLIGHT_MENU: Record<string, Exclude<MenuId, "summary">> = {
  "IDN Lomba": "lomba",
  "IDN Mengajar": "mengajar",
  "IDN Menulis": "menulis",
  "IDN Talking": "talking",
  "IDN Seminar": "seminar",
};

export function SummaryView({ data, onSelectMenu }: SummaryViewProps) {
  return (
    <div className="space-y-4">
      <Reveal>
        <GlassCard className="overflow-hidden !p-0">
          <div className="summary-hero hero-shine relative px-5 py-6 sm:px-6">
            <div className="summary-rainbow absolute inset-0 opacity-80" />
            <div className="relative z-10">
              <Reveal as="p" delay={0.15} variant="left" className="text-[10px] font-semibold tracking-[0.2em] text-indigo-200/90 uppercase">
                Overview Lintas Program
              </Reveal>
              <Reveal as="p" delay={0.25} variant="left" className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Ringkasan Prestasi IDN Hebat
              </Reveal>
              <Reveal as="p" delay={0.35} variant="left" className="mt-1 max-w-2xl text-sm text-slate-300">
                Snapshot seluruh program unggulan — dari mengajar, lomba, menulis,
                talking, hingga seminar.
              </Reveal>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat, index) => {
          const Icon = PROGRAM_ICONS[stat.program];
          const theme = MENU_THEMES[stat.program];
          return (
            <Reveal key={stat.id} delay={staggerDelay(index, 0.07, 0.1)}>
              <GlassCard
                hover
                className="h-full !p-4"
                onClick={
                  onSelectMenu ? () => onSelectMenu(stat.program) : undefined
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      {theme.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-300">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white tabular-nums">
                      <CountUp
                        value={stat.value}
                        delay={staggerDelay(index, 0.07, 0.3)}
                      />
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
                  </div>
                  <div
                    className="stat-icon flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{
                      borderColor: `rgba(${theme.primaryRgb}, 0.35)`,
                      background: `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.2), rgba(${theme.secondaryRgb}, 0.08))`,
                      color: theme.primary,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {data.highlights.map((item, index) => (
          <Reveal
            key={item.id}
            variant="scale"
            delay={staggerDelay(index, 0.07, 0.35)}
          >
            <GlassCard
              hover
              className="h-full !p-4 text-center"
              onClick={
                onSelectMenu && HIGHLIGHT_MENU[item.program]
                  ? () => onSelectMenu(HIGHLIGHT_MENU[item.program])
                  : undefined
              }
            >
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {item.program}
              </p>
              <p
                className={`mt-2 text-2xl font-bold tabular-nums ${ACCENT_TEXT[item.accent]}`}
              >
                <CountUp
                  value={item.value}
                  delay={staggerDelay(index, 0.07, 0.5)}
                />
              </p>
              <p className="mt-1 text-xs text-slate-300">{item.title}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {data.topPerformers && data.topPerformers.length > 0 ? (
        <Reveal delay={0.55}>
          <GlassCard
            title="Top Performing IDN Students"
            className="!p-4 sm:!p-5"
          >
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {data.topPerformers.map((student, index) => (
                <Reveal
                  as="li"
                  key={student.id}
                  interactive
                  delay={staggerDelay(index, 0.06, 0.7)}
                  className="leaderboard-row flex items-start gap-3 rounded-xl border px-3 py-3"
                >
                  <StudentAvatar size={40} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-400">{student.className}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                      {student.highlight}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {student.categories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-300 uppercase"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      ) : null}
    </div>
  );
}
