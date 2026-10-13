"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, LayoutDashboard, PenLine } from "lucide-react";
import {
  buildKelasRows,
  computeMenulisStats,
  filterKelas,
  toChartPoints,
  type MenulisTab,
} from "@/lib/menulis";
import type { MenulisPayload } from "@/src/data/mockMenulis";
import { EASE_OUT, Reveal, TabPill, useTvMode } from "@/components/Animate";
import { MenulisClassGrid } from "./MenulisClassGrid";
import { MenulisCompareChart } from "./MenulisCompareChart";
import { MenulisStatCards } from "./MenulisStatCards";

interface IdnMenulisDashboardProps {
  data: MenulisPayload;
}

const TABS: {
  id: MenulisTab;
  label: string;
  short: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "all", label: "All Overview", short: "Overview", icon: LayoutDashboard },
  { id: "menulis", label: "Program Menulis", short: "Menulis", icon: PenLine },
  { id: "sertifikasi", label: "Program Sertifikasi", short: "Sertifikasi", icon: Award },
];

export function IdnMenulisDashboard({ data: initialData }: IdnMenulisDashboardProps) {
  const tv = useTvMode();
  const [tab, setTab] = useState<MenulisTab>("all");
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData((current) =>
      current.connected && !initialData.connected ? current : initialData
    );
  }, [initialData]);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch("/api/menulis", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as MenulisPayload;
        if (!cancelled && Array.isArray(json.menulis)) setData(json);
      } catch {
        // Keep the last successful payload on screen.
      }
    }

    const refreshId = setInterval(() => {
      void refresh();
    }, 20_000);
    return () => {
      cancelled = true;
      clearInterval(refreshId);
    };
  }, []);

  const stats = useMemo(() => computeMenulisStats(data), [data]);
  const rows = useMemo(
    () => filterKelas(buildKelasRows(data), tab),
    [data, tab]
  );
  const menulisChart = useMemo(
    () => toChartPoints(filterKelas(buildKelasRows(data), "menulis"), "menulis"),
    [data]
  );
  const sertifikatChart = useMemo(
    () =>
      toChartPoints(
        filterKelas(buildKelasRows(data), "sertifikasi"),
        "sertifikasi"
      ),
    [data]
  );

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
            <span className="font-semibold text-emerald-300">{data.sheet}</span>{" "}
            (live Google Sheets)
          </>
        ) : (
          <>Sumber: data contoh</>
        )}
      </Reveal>

      <MenulisStatCards stats={stats} />

      <Reveal
        delay={0.25}
        role="tablist"
        aria-label="Program IDN Menulis dan Sertifikasi"
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
              className={`press relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-300 sm:py-3 sm:text-sm ${
                active
                  ? "text-slate-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active ? (
                <TabPill
                  layoutId="menulis-tab"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                />
              ) : null}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              <span className="relative z-10 sm:hidden">{item.short}</span>
              <span className="relative z-10 hidden sm:inline">{item.label}</span>
            </motion.button>
          );
        })}
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={tv ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={tv ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={tv ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          className="flex flex-col gap-4"
        >
          {tab === "all" ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Reveal delay={0.1}>
                <MenulisCompareChart
                  data={menulisChart}
                  title="Target vs Pencapaian Menulis"
                  unit="hlm"
                  pencapaianColor="#10B981"
                />
              </Reveal>
              <Reveal delay={0.2}>
                <MenulisCompareChart
                  data={sertifikatChart}
                  title="Target vs Pencapaian Sertifikasi"
                  unit="sertifikat"
                  pencapaianColor="#2DD4BF"
                />
              </Reveal>
            </div>
          ) : tab === "menulis" ? (
            <Reveal delay={0.1}>
              <MenulisCompareChart
                data={menulisChart}
                title="Target vs Pencapaian Menulis"
                unit="hlm"
                pencapaianColor="#10B981"
              />
            </Reveal>
          ) : (
            <Reveal delay={0.1}>
              <MenulisCompareChart
                data={sertifikatChart}
                title="Target vs Pencapaian Sertifikasi"
                unit="sertifikat"
                pencapaianColor="#2DD4BF"
              />
            </Reveal>
          )}

          <MenulisClassGrid rows={rows} view={tab} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
