"use client";

import { useMemo, useState } from "react";
import type { LombaItem } from "@/src/data/mockLomba";
import { MOCK_LOMBA_DATA } from "@/src/data/mockLomba";
import {
  DEFAULT_LOMBA_FILTERS,
  buildJenjangChart,
  buildLeaderboard,
  buildSkalaChart,
  computeLombaStats,
  countPelaksanaan,
  filterLombaData,
  getSpotlightStudent,
  groupLombaByStatus,
  uniqueSorted,
  type LombaFilters,
} from "@/lib/lomba";
import { LombaFilterBar } from "./LombaFilterBar";
import { LombaJenjangChart } from "./LombaJenjangChart";
import { LombaLeaderboard } from "./LombaLeaderboard";
import { LombaSkalaChart } from "./LombaSkalaChart";
import { LombaSpotlight } from "./LombaSpotlight";
import { LombaStatCards } from "./LombaStatCards";
import { LombaStatusCards } from "./LombaStatusCards";

interface IdnLombaViewProps {
  data?: LombaItem[];
  connected?: boolean;
  sheet?: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export function IdnLombaView({
  data = MOCK_LOMBA_DATA,
  connected = false,
  sheet = null,
  isLoading = false,
  error = null,
}: IdnLombaViewProps) {
  const [filters, setFilters] = useState<LombaFilters>(DEFAULT_LOMBA_FILTERS);

  const pekanOptions = useMemo(
    () => ["Semua", ...uniqueSorted(data.map((d) => d.pekan))],
    [data]
  );

  const bulanOptions = useMemo(
    () => ["Semua", ...uniqueSorted(data.map((d) => d.bulan))],
    [data]
  );

  const filtered = useMemo(
    () => filterLombaData(data, filters),
    [data, filters]
  );

  const stats = useMemo(() => computeLombaStats(filtered), [filtered]);
  const leaderboard = useMemo(() => buildLeaderboard(filtered), [filtered]);
  const spotlight = useMemo(
    () => getSpotlightStudent(leaderboard),
    [leaderboard]
  );
  const skalaChart = useMemo(() => buildSkalaChart(filtered), [filtered]);
  const jenjangChart = useMemo(() => buildJenjangChart(filtered), [filtered]);
  const pelaksanaan = useMemo(() => countPelaksanaan(filtered), [filtered]);
  const statusGroups = useMemo(() => groupLombaByStatus(filtered), [filtered]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="rounded-2xl border border-amber-500/25 bg-slate-950/70 px-6 py-5 text-sm text-amber-200">
          Memuat data IDN Lomba dari Google Sheets…
        </div>
      </div>
    );
  }

  return (
    <div className="lomba-board flex h-full flex-col gap-3 overflow-y-auto xl:h-[calc(100vh-100px)] xl:max-h-screen xl:overflow-hidden">
      <div className="shrink-0 space-y-3">
        {error ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200 sm:text-sm">
            {error}
          </div>
        ) : null}

        <LombaFilterBar
          filters={filters}
          pekanOptions={pekanOptions}
          bulanOptions={bulanOptions}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_LOMBA_FILTERS)}
        />

        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-amber-300">
              {filtered.length}
            </span>{" "}
            dari {data.length} entri{" "}
            {connected ? (
              <>
                <span className="font-semibold text-emerald-300">
                  {sheet ?? "Lomba_Filter"}
                </span>{" "}
                (live Sheets)
              </>
            ) : (
              <>(mock · fallback)</>
            )}
          </p>
        </div>

        <LombaStatCards stats={stats} />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
        <div className="min-h-[420px] xl:min-h-0 xl:h-full xl:col-span-3">
          <LombaSpotlight student={spotlight} />
        </div>

        <div className="min-h-[420px] xl:min-h-0 xl:h-full xl:col-span-5">
          <LombaLeaderboard items={leaderboard} />
        </div>

        <div className="lomba-chart-col flex min-h-0 h-full flex-col gap-3 xl:col-span-4">
          <div className="min-h-0 flex-1">
            <LombaSkalaChart data={skalaChart} />
          </div>
          <div className="min-h-0 flex-1">
            <LombaJenjangChart
              data={jenjangChart}
              online={pelaksanaan.online}
              offline={pelaksanaan.offline}
            />
          </div>
        </div>
      </div>

      <div className="lomba-status-band shrink-0 xl:h-[clamp(210px,27vh,300px)]">
        <LombaStatusCards groups={statusGroups} />
      </div>
    </div>
  );
}
