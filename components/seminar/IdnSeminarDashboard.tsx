"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, RefreshCw } from "lucide-react";
import {
  SEMINAR_MONTHS,
  buildMonthlyTrend,
  computeSeminarStats,
  filterByMonth,
  type MonthFilter,
} from "@/lib/seminar";
import type { SeminarPayload } from "@/src/data/mockSeminar";
import { CountUp, Reveal } from "@/components/Animate";
import { SeminarStatCards } from "./SeminarStatCards";
import { SeminarTable } from "./SeminarTable";
import { SeminarTrendChart } from "./SeminarTrendChart";

interface IdnSeminarDashboardProps {
  data: SeminarPayload;
}

const SYNC_INTERVAL_MS = 30_000;

function formatSyncTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function IdnSeminarDashboard({
  data: initialData,
}: IdnSeminarDashboardProps) {
  const [data, setData] = useState<SeminarPayload>(initialData);
  const [month, setMonth] = useState<MonthFilter>("Semua");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const sync = useCallback(async () => {
    try {
      const res = await fetch("/api/seminar", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as SeminarPayload;
      if (json.connected) {
        setData(json);
        setSyncError(null);
        setLastSync(new Date());
      } else {
        setData((prev) => (prev.connected ? prev : json));
        setSyncError(json.message ?? "Google Sheets tidak terhubung.");
      }
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Gagal sinkronisasi.");
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => void sync(), 0);
    const id = setInterval(() => void sync(), SYNC_INTERVAL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [sync]);

  const stats = useMemo(() => computeSeminarStats(data.data), [data.data]);
  const filtered = useMemo(
    () => filterByMonth(data.data, month),
    [data.data, month]
  );
  const trend = useMemo(() => buildMonthlyTrend(data.data), [data.data]);

  return (
    <div className="tv-page flex flex-col gap-4">
      {syncError ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200 sm:text-sm">
          {data.connected
            ? `Sinkronisasi terakhir gagal (${syncError}). Menampilkan data Sheets terakhir yang berhasil dimuat.`
            : syncError}
        </div>
      ) : !data.connected && data.message ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200 sm:text-sm">
          {data.message}
        </div>
      ) : null}

      <Reveal
        variant="fade"
        className="flex flex-wrap items-center justify-between gap-2"
      >
        <p className="text-xs text-slate-400">
          {data.connected ? (
            <>
              Sumber:{" "}
              <span className="font-semibold text-sky-300">{data.sheet}</span>{" "}
              (Google Sheets)
            </>
          ) : (
            <>Sumber: data contoh — Google Sheets belum terhubung</>
          )}
        </p>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
              data.connected && !syncError
                ? "border-sky-500/30 bg-sky-500/10"
                : "border-amber-500/30 bg-amber-500/10"
            }`}
          >
            <span
              className={`pulse-dot h-2 w-2 rounded-full ${
                data.connected && !syncError ? "bg-sky-400" : "bg-amber-400"
              }`}
            />
            <span className="text-[11px] font-semibold tracking-wide text-slate-200">
              {data.connected && !syncError ? "LIVE SYNC" : "DATA CONTOH"}
              {lastSync ? ` · ${formatSyncTime(lastSync)}` : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSyncing(true);
              void sync();
            }}
            disabled={syncing}
            className="press inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-slate-200 transition-colors hover:border-white/25 hover:bg-white/5 disabled:opacity-60"
            title={`Sinkron otomatis setiap ${SYNC_INTERVAL_MS / 1000} detik`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            Sinkronkan
          </button>
        </div>
      </Reveal>

      <SeminarStatCards stats={stats} />

      <Reveal
        delay={0.3}
        className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <label className="relative flex items-center sm:w-64">
          <Filter className="pointer-events-none absolute left-3 h-4 w-4 text-sky-300" />
          <span className="sr-only">Filter bulan</span>
          <select
            value={month}
            onChange={(event) => setMonth(event.target.value as MonthFilter)}
            className="interactive-field w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 py-2.5 pr-9 pl-9 text-sm font-medium text-white outline-none focus:border-sky-400/60"
          >
            <option value="Semua" className="bg-slate-900">
              Semua Bulan
            </option>
            {SEMINAR_MONTHS.map((option) => (
              <option key={option} value={option} className="bg-slate-900">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
        </label>
        <p className="px-2 text-[11px] text-slate-400">
          <CountUp value={filtered.length} duration={0.6} delay={0} /> pekan
          ditampilkan
          {month === "Semua" ? "" : ` · ${month}`}
        </p>
      </Reveal>

      <Reveal delay={0.38}>
        <SeminarTrendChart data={trend} />
      </Reveal>
      <Reveal delay={0.46}>
        <SeminarTable key={month} rows={filtered} />
      </Reveal>
    </div>
  );
}
