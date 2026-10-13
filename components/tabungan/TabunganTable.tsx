import { Table2 } from "lucide-react";
import { CountUp, Reveal, staggerDelay } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";
import { formatRupiah } from "@/lib/tabungan";
import {
  TABUNGAN_MONTH_LABELS,
  type TabunganMonth,
  type TabunganSiswa,
} from "@/src/data/tabungan";

interface TabunganTableProps {
  rows: TabunganSiswa[];
  months: readonly TabunganMonth[];
  topTotal: number;
}

export function TabunganTable({ rows, months, topTotal }: TabunganTableProps) {
  return (
    <GlassCard
      title="Rincian Tabungan Siswa"
      action={
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <Table2 className="h-4 w-4 text-yellow-300" />
          <CountUp value={rows.length} duration={0.6} delay={0} /> siswa
        </span>
      }
      className="!p-4"
    >
      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Tidak ada siswa yang cocok dengan filter.
        </p>
      ) : (
        <div className="max-h-[560px] overflow-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-slate-900/95 text-[11px] uppercase tracking-wide text-slate-400 backdrop-blur">
              <tr>
                <th className="px-3 py-3 font-semibold">No</th>
                <th className="px-3 py-3 font-semibold">Nama Siswa</th>
                <th className="px-3 py-3 font-semibold">Kelas</th>
                {months.map((m) => (
                  <th key={m} className="px-3 py-3 text-right font-semibold">
                    {TABUNGAN_MONTH_LABELS[m]}
                  </th>
                ))}
                <th className="bg-yellow-500/10 px-3 py-3 text-right font-semibold text-yellow-300">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, index) => {
                const isTop = topTotal > 0 && row.total === topTotal;
                return (
                  <Reveal
                    as="tr"
                    key={`${row.no}-${row.nama}`}
                    variant="fade"
                    delay={staggerDelay(index, 0.035, 0.1, 14)}
                    className="data-row"
                  >
                    <td className="px-3 py-2.5 text-slate-500 tabular-nums">
                      {row.no}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-medium text-white">
                      {row.nama}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                        {row.kelas || "—"}
                      </span>
                    </td>
                    {months.map((m) => (
                      <td
                        key={m}
                        className={`whitespace-nowrap px-3 py-2.5 text-right tabular-nums ${
                          row[m] === 0 ? "text-slate-600" : "text-slate-200"
                        }`}
                      >
                        {formatRupiah(row[m])}
                      </td>
                    ))}
                    <td className="bg-yellow-500/[0.06] px-3 py-2 text-right">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-bold tabular-nums sm:text-sm ${
                          isTop
                            ? "border-lime-400/50 bg-gradient-to-r from-yellow-400 to-lime-400 text-slate-950 shadow-[0_0_14px_rgba(163,230,53,0.35)]"
                            : "border-yellow-500/35 bg-yellow-500/15 text-yellow-200"
                        }`}
                      >
                        {formatRupiah(row.total)}
                      </span>
                    </td>
                  </Reveal>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
}
