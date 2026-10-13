import { Fragment } from "react";
import { Check, X } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import {
  formatPct,
  groupByMonth,
  progressTone,
  type ProgressTone,
} from "@/lib/seminar";
import type { SeminarRow } from "@/src/data/mockSeminar";

interface SeminarTableProps {
  rows: SeminarRow[];
}

const TONE_BAR: Record<ProgressTone, string> = {
  complete: "bg-emerald-400",
  partial: "bg-yellow-400",
  low: "bg-red-400",
};

const TONE_TEXT: Record<ProgressTone, string> = {
  complete: "text-emerald-300",
  partial: "text-yellow-300",
  low: "text-red-300",
};

function StatusBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  const status = active ? "tercapai" : "belum tercapai";

  return (
    <button
      type="button"
      aria-label={`${label} ${status}`}
      title={`${label}: ${status}`}
      className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
        active
          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
          : "border-red-400/40 bg-red-500/15 text-red-300"
      }`}
    >
      {active ? (
        <Check className="h-4 w-4" strokeWidth={2.75} />
      ) : (
        <X className="h-4 w-4" strokeWidth={2.75} />
      )}
      <span className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-950 px-2 py-1 text-[10px] font-semibold text-slate-100 shadow-lg group-hover:block group-focus-visible:block">
        {label}: {active ? "Tercapai" : "Belum"}
      </span>
    </button>
  );
}

function TotalCell({ total }: { total: number }) {
  const tone = progressTone(total);
  const width = Math.max(0, Math.min(total, 100));

  return (
    <div className="flex min-w-[8.5rem] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${TONE_BAR[tone]}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`w-14 text-right text-xs font-semibold tabular-nums ${TONE_TEXT[tone]}`}>
        {formatPct(total)}
      </span>
    </div>
  );
}

export function SeminarTable({ rows }: SeminarTableProps) {
  const groups = groupByMonth(rows);

  return (
    <GlassCard title="Statistik per Bulan & Pekan" className="!p-4">
      {groups.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Belum ada data seminar untuk filter bulan ini.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-1 text-left">
            <thead>
              <tr className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                <th className="px-3 py-2">Pekan</th>
                <th className="px-3 py-2 text-center">WET</th>
                <th className="px-3 py-2 text-center">WTT</th>
                <th className="px-3 py-2 text-center">Podcast</th>
                <th className="px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <Fragment key={group.bulan}>
                  <tr>
                    <td colSpan={5} className="px-3 pt-4 pb-1">
                      <p className="text-xs font-semibold tracking-[0.16em] text-sky-300 uppercase">
                        {group.bulan}
                      </p>
                    </td>
                  </tr>
                  {group.rows.map((row, index) => (
                    <tr
                      key={`${group.bulan}-${row.pekan}-${index}`}
                      className="bg-slate-900/60"
                    >
                      <td className="rounded-l-xl px-3 py-2.5 text-sm font-medium text-white">
                        {row.pekan || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <StatusBadge label="WET" active={row.wet} />
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <StatusBadge label="WTT" active={row.wtt} />
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <StatusBadge label="Podcast" active={row.podcast} />
                      </td>
                      <td className="rounded-r-xl px-3 py-2.5">
                        <TotalCell total={row.total} />
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
}
