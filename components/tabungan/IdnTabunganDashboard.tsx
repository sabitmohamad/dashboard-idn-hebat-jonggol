"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, RefreshCw, Search, X } from "lucide-react";
import {
  KELAS_OPTIONS,
  activeMonths,
  buildMonthlyTrend,
  computeTabunganStats,
  filterTabungan,
  type KelasFilter,
} from "@/lib/tabungan";
import type { TabunganPayload } from "@/src/data/tabungan";
import { TabunganStatCards } from "./TabunganStatCards";
import { TabunganTable } from "./TabunganTable";
import { TabunganTrendChart } from "./TabunganTrendChart";

interface IdnTabunganDashboardProps {
  data: TabunganPayload;
}

const SYNC_INTERVAL_MS = 30_000;

function formatSyncTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function IdnTabunganDashboard({
  data: initialData,
}: IdnTabunganDashboardProps) {
  const [data, setData] = useState<TabunganPayload>(initialData);
  const [kelas, setKelas] = useState<KelasFilter>("Semua");
  const [query, setQuery] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const sync = useCallback(async () => {
    try {
      const res = await fetch("/api/tabungan", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as TabunganPayload;
      if (json.connected) {
        setData(json);
        setSyncError(null);
        setLastSync(new Date());
      } else {
        // Keep the last successful snapshot instead of blanking the table.
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

  const handleManualSync = () => {
    setSyncing(true);
    void sync();
  };

  const months = useMemo(() => activeMonths(data.data), [data.data]);
  const rows = useMemo(
    () => filterTabungan(data.data, kelas, query),
    [data.data, kelas, query]
  );
  const stats = useMemo(() => computeTabunganStats(rows), [rows]);
  const trend = useMemo(() => buildMonthlyTrend(rows, months), [rows, months]);

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

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          {data.connected ? (
            <>
              Sumber:{" "}
              <span className="font-semibold text-yellow-300">
                {data.sheet}
              </span>{" "}
              (Google Sheets)
            </>
          ) : (
            <>Sumber: Google Sheets belum terhubung</>
          )}
        </p>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
              data.connected && !syncError
                ? "border-lime-500/30 bg-lime-500/10"
                : "border-amber-500/30 bg-amber-500/10"
            }`}
          >
            <span
              className={`pulse-dot h-2 w-2 rounded-full ${
                data.connected && !syncError ? "bg-lime-400" : "bg-amber-400"
              }`}
            />
            <span className="text-[11px] font-semibold tracking-wide text-slate-200">
              {data.connected && !syncError ? "LIVE SYNC" : "SYNC TERPUTUS"}
              {lastSync ? ` · ${formatSyncTime(lastSync)}` : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-slate-200 transition-colors hover:border-white/25 hover:bg-white/5 disabled:opacity-60"
            title={`Sinkron otomatis setiap ${SYNC_INTERVAL_MS / 1000} detik`}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
            />
            Sinkronkan
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-2 sm:flex-row sm:items-center">
        <label className="relative flex items-center sm:w-56">
          <Filter className="pointer-events-none absolute left-3 h-4 w-4 text-yellow-300" />
          <span className="sr-only">Filter kelas</span>
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value as KelasFilter)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 py-2.5 pr-9 pl-9 text-sm font-medium text-white outline-none transition-colors focus:border-yellow-400/60"
          >
            {KELAS_OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-slate-900">
                {option === "Semua" ? "Semua Kelas" : `Kelas ${option}`}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
        </label>

        <label className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
          <span className="sr-only">Cari nama siswa</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama siswa…"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-2.5 pr-9 pl-9 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-yellow-400/60 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>
      </div>

      <TabunganStatCards stats={stats} />

      <TabunganTrendChart data={trend} />

      <TabunganTable
        rows={rows}
        months={months}
        topTotal={stats.tertinggi?.total ?? 0}
      />
    </div>
  );
}
