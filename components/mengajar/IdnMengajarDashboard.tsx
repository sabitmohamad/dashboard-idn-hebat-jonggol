"use client";

import { useMemo } from "react";
import {
  buildMengajarLeaderboard,
  buildTopMateri,
  computeMengajarStats,
  sortLogTerbaru,
} from "@/lib/mengajar";
import type { MengajarPayload } from "@/src/data/mockMengajar";
import { MengajarActivityLog } from "./MengajarActivityLog";
import { MengajarLeaderboard } from "./MengajarLeaderboard";
import { MengajarMateriChart } from "./MengajarMateriChart";
import { MengajarStatCards } from "./MengajarStatCards";

interface IdnMengajarDashboardProps {
  data: MengajarPayload;
}

export function IdnMengajarDashboard({ data }: IdnMengajarDashboardProps) {
  const stats = useMemo(
    () => computeMengajarStats(data.rekap, data.log),
    [data.rekap, data.log]
  );
  const leaderboard = useMemo(
    () => buildMengajarLeaderboard(data.rekap),
    [data.rekap]
  );
  const materi = useMemo(() => buildTopMateri(data.log), [data.log]);
  const log = useMemo(() => sortLogTerbaru(data.log), [data.log]);

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
            <span className="font-semibold text-cyan-300">{data.sheet}</span>{" "}
            (live Google Sheets)
          </>
        ) : (
          <>Sumber: data contoh (fallback)</>
        )}
      </p>

      <MengajarStatCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-start">
        <div className="xl:col-span-5">
          <MengajarLeaderboard items={leaderboard} />
        </div>

        <div className="flex flex-col gap-4 xl:col-span-7">
          <MengajarMateriChart data={materi} />
          <div className="mengajar-scroll xl:max-h-[calc(100vh-520px)] xl:min-h-[320px] xl:overflow-y-auto">
            <MengajarActivityLog items={log} />
          </div>
        </div>
      </div>
    </div>
  );
}
