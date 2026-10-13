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
import { CountUp, Reveal } from "@/components/Animate";
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
    <div className="lomba-board flex flex-col gap-5 pb-8 lg:gap-6 lg:pr-12 lg:pb-10">
      <div className="shrink-0 space-y-4">
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

        <Reveal
          variant="fade"
          className="flex items-center justify-between gap-3 text-xs text-slate-400"
        >
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-amber-300 tabular-nums">
              <CountUp value={filtered.length} duration={0.6} delay={0} />
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
        </Reveal>

        <LombaStatCards stats={stats} />
      </div>

      <div className="lomba-mid grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
        <Reveal delay={0.2} className="min-h-[320px] xl:col-span-3">
          <LombaSpotlight student={spotlight} />
        </Reveal>

        <Reveal delay={0.28} className="min-h-[320px] xl:col-span-5">
          <LombaLeaderboard items={leaderboard} />
        </Reveal>

        <div className="lomba-chart-col flex min-h-0 flex-col gap-4 xl:col-span-4">
          <Reveal delay={0.36} className="flex min-h-0 flex-col">
            <LombaSkalaChart data={skalaChart} />
          </Reveal>
          <Reveal delay={0.44} className="flex min-h-0 flex-col">
            <LombaJenjangChart
              data={jenjangChart}
              online={pelaksanaan.online}
              offline={pelaksanaan.offline}
            />
          </Reveal>
        </div>
      </div>

      <div className="lomba-status-band shrink-0">
        <LombaStatusCards groups={statusGroups} />
      </div>
    </div>
  );
}
