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

      <p className="text-xs text-slate-400">
        {data.connected ? (
          <>
            Sumber:{" "}
            <span className="font-semibold text-emerald-300">{data.sheet}</span>{" "}
            (live Google Sheets)
          </>
        ) : (
          <>Sumber: data contoh</>
        )}
      </p>

      <MenulisStatCards stats={stats} />

      <div
        role="tablist"
        aria-label="Program IDN Menulis dan Sertifikasi"
        className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-1.5"
      >
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 sm:py-3 sm:text-sm ${
                active
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4"
        >
          {tab === "all" ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <MenulisCompareChart
                data={menulisChart}
                title="Target vs Pencapaian Menulis"
                unit="hlm"
                pencapaianColor="#10B981"
              />
              <MenulisCompareChart
                data={sertifikatChart}
                title="Target vs Pencapaian Sertifikasi"
                unit="sertifikat"
                pencapaianColor="#2DD4BF"
              />
            </div>
          ) : tab === "menulis" ? (
            <MenulisCompareChart
              data={menulisChart}
              title="Target vs Pencapaian Menulis"
              unit="hlm"
              pencapaianColor="#10B981"
            />
          ) : (
            <MenulisCompareChart
              data={sertifikatChart}
              title="Target vs Pencapaian Sertifikasi"
              unit="sertifikat"
              pencapaianColor="#2DD4BF"
            />
          )}

          <MenulisClassGrid rows={rows} view={tab} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
