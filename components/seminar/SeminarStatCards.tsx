import { CheckCircle2, Headphones, Mic, Presentation } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { formatPct, type SeminarStats } from "@/lib/seminar";

interface SeminarStatCardsProps {
  stats: SeminarStats;
}

export function SeminarStatCards({ stats }: SeminarStatCardsProps) {
  const programs = [
    { id: "wet", label: "WET", status: stats.wet, icon: Mic },
    { id: "wtt", label: "WTT", status: stats.wtt, icon: Presentation },
    { id: "podcast", label: "Podcast", status: stats.podcast, icon: Headphones },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      <GlassCard hover className="!p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">
              Rata-rata Persentase Ketercapaian
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
              {formatPct(stats.rataRata)}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/25 to-indigo-500/5 text-sky-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-slate-400">
          Dari {stats.totalPekan.toLocaleString("id-ID")} pekan di seluruh bulan
        </p>
      </GlassCard>

      <GlassCard hover className="!p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">
              Total Pekan Selesai (100%)
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
              {stats.pekanSelesai.toLocaleString("id-ID")}
              <span className="ml-1 text-base font-semibold text-slate-400">
                / {stats.totalPekan.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/25 to-emerald-600/5 text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-slate-400">
          Pekan yang menyelesaikan WET, WTT, dan Podcast
        </p>
      </GlassCard>

      <GlassCard hover className="!p-4">
        <p className="text-xs font-medium text-slate-400">Status Program Aktif</p>
        <ul className="mt-3 space-y-2">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <li key={program.id} className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                <span className="w-16 text-[11px] font-semibold text-slate-300">
                  {program.label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
                    style={{ width: `${Math.min(program.status.persen, 100)}%` }}
                  />
                </span>
                <span className="w-14 text-right text-[11px] font-semibold text-white tabular-nums">
                  {program.status.aktif}/{program.status.total}
                </span>
              </li>
            );
          })}
        </ul>
      </GlassCard>
    </div>
  );
}
