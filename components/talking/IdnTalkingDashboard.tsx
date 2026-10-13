"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Languages,
  MessagesSquare,
  Mic2,
  Users,
} from "lucide-react";
import {
  buildProgramSlices,
  computeTalkingStats,
  formatTalkingNames,
  isDoneStatus,
  topicBadgeClass,
  type TalkingTab,
} from "@/lib/talking";
import type { TalkingPayload } from "@/src/data/mockTalking";
import {
  EASE_OUT,
  Reveal,
  TabPill,
  staggerDelay,
  useTvMode,
} from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";
import { TalkingProgramChart } from "./TalkingProgramChart";
import { TalkingStatCards } from "./TalkingStatCards";

interface IdnTalkingDashboardProps {
  data: TalkingPayload;
}

const TABS: {
  id: TalkingTab;
  label: string;
  short: string;
  icon: typeof Mic2;
}[] = [
  { id: "podcast", label: "Podcast Sessions", short: "Podcast", icon: Mic2 },
  { id: "wtt", label: "WTT (Weekly Talk)", short: "WTT", icon: MessagesSquare },
  { id: "wet", label: "WET (Weekly English Talk)", short: "WET", icon: Languages },
];

function StatusBadge({ status }: { status: string }) {
  const done = isDoneStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
        done
          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
          : "border-amber-400/40 bg-amber-500/15 text-amber-200"
      }`}
    >
      {done ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
      {status || "—"}
    </span>
  );
}

function ClassBadge({ value }: { value: string }) {
  if (!value) return null;
  return (
    <span className="inline-flex rounded-md border border-purple-400/40 bg-purple-500/20 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-purple-100">
      {value}
    </span>
  );
}

export function IdnTalkingDashboard({ data }: IdnTalkingDashboardProps) {
  const tv = useTvMode();
  const [tab, setTab] = useState<TalkingTab>("podcast");

  const stats = useMemo(
    () => computeTalkingStats(data.podcast, data.wtt, data.wet),
    [data.podcast, data.wtt, data.wet]
  );
  const slices = useMemo(() => buildProgramSlices(stats), [stats]);

  return (
    <div className="tv-page flex flex-col gap-4">
      {!data.connected && data.message ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200 sm:text-sm">
          {data.message}
        </div>
      ) : null}

      <Reveal as="p" variant="fade" className="text-xs text-slate-400">
        {data.connected ? (
          <>
            Sumber:{" "}
            <span className="font-semibold text-fuchsia-300">{data.sheet}</span>{" "}
            (live Google Sheets)
          </>
        ) : (
          <>Sumber: data contoh (fallback)</>
        )}
      </Reveal>

      <TalkingStatCards stats={stats} />

      <Reveal delay={0.25}>
        <TalkingProgramChart data={slices} />
      </Reveal>

      <Reveal
        delay={0.35}
        role="tablist"
        aria-label="Program IDN Talking"
        className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-1.5"
      >
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              whileHover={tv ? undefined : { y: -1 }}
              whileTap={tv ? undefined : { scale: 0.96 }}
              className={`press relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-300 sm:text-sm ${
                active
                  ? "text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active ? (
                <TabPill
                  layoutId="talking-tab"
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_8px_24px_rgba(168,85,247,0.35)]"
                />
              ) : null}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10 hidden sm:inline">{item.label}</span>
              <span className="relative z-10 sm:hidden">{item.short}</span>
            </motion.button>
          );
        })}
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={tv ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={tv ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={tv ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
        >
          {tab === "podcast" ? (
            <GlassCard title="Podcast Sessions" className="!p-4">
              {data.podcast.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  Belum ada sesi podcast.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {data.podcast.map((item, index) => (
                    <Reveal
                      as="article"
                      key={`${item.no}-${item.name_podcast}-${index}`}
                      interactive
                      delay={staggerDelay(index, 0.05, 0.1, 10)}
                      className="side-panel-row rounded-xl border p-4 hover:!border-fuchsia-400/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold tracking-[0.16em] text-fuchsia-300/80 uppercase">
                            Episode {item.no || index + 1}
                          </p>
                          <h3 className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white">
                            <Users className="h-3.5 w-3.5 shrink-0 text-purple-300" />
                            <span className="truncate">
                              {formatTalkingNames(item.name_podcast) || "—"}
                            </span>
                          </h3>
                        </div>
                        <StatusBadge status={item.status_podcast} />
                      </div>
                      {item.topic_podcast ? (
                        <p
                          className={`mt-3 inline-flex max-w-full rounded-full border px-2.5 py-1 text-[11px] font-medium ${topicBadgeClass(item.topic_podcast)}`}
                        >
                          {item.topic_podcast}
                        </p>
                      ) : null}
                      <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <CalendarDays className="h-3 w-3" />
                        {item.date_podcast || "—"}
                      </p>
                    </Reveal>
                  ))}
                </div>
              )}
            </GlassCard>
          ) : null}

          {tab === "wtt" ? (
            <GlassCard title="Weekly Talk (WTT)" className="!p-4">
              {data.wtt.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  Belum ada jadwal WTT.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-[11px] tracking-wider text-slate-400 uppercase">
                        <th className="px-3 py-2 font-semibold">Kelas</th>
                        <th className="px-3 py-2 font-semibold">Nama / Kelompok</th>
                        <th className="px-3 py-2 font-semibold">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.wtt.map((item, index) => (
                        <Reveal
                          as="tr"
                          key={`${item.name_wtt}-${item.date_wtt}-${index}`}
                          variant="fade"
                          delay={staggerDelay(index, 0.04, 0.1, 12)}
                          className="data-row border-b border-white/5"
                        >
                          <td className="px-3 py-3">
                            <ClassBadge value={item.class_wtt} />
                          </td>
                          <td className="px-3 py-3 font-medium text-white">
                            {formatTalkingNames(item.name_wtt) || "—"}
                          </td>
                          <td className="px-3 py-3 text-slate-300">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-pink-300" />
                              {item.date_wtt || "—"}
                            </span>
                          </td>
                        </Reveal>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          ) : null}

          {tab === "wet" ? (
            <GlassCard title="Weekly English Talk (WET)" className="!p-4">
              {data.wet.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  Belum ada jadwal WET.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {data.wet.map((item, index) => (
                    <Reveal
                      as="article"
                      key={`${item.name_wet}-${item.date_wet}-${index}`}
                      interactive
                      variant="left"
                      delay={staggerDelay(index, 0.05, 0.1, 10)}
                      className="side-panel-row flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 hover:!border-sky-400/40"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <ClassBadge value={item.class_wet} />
                          <h3 className="text-sm font-semibold text-white">
                            {formatTalkingNames(item.name_wet) || "—"}
                          </h3>
                        </div>
                        <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <CalendarDays className="h-3 w-3" />
                          {item.date_wet || "—"}
                        </p>
                      </div>
                      <StatusBadge status={item.status_wet} />
                    </Reveal>
                  ))}
                </div>
              )}
            </GlassCard>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
