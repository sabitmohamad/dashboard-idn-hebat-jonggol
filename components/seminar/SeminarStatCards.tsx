import { CheckCircle2, Headphones, Mic, Presentation } from "lucide-react";
import {
  AnimatedBar,
  CountUp,
  Reveal,
  staggerDelay,
} from "@/components/Animate";
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
      <Reveal delay={staggerDelay(0, 0.08)}>
        <GlassCard hover className="h-full !p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">
                Rata-rata Persentase Ketercapaian
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
                <CountUp value={formatPct(stats.rataRata)} delay={0.2} />
              </p>
            </div>
            <div className="stat-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/25 to-indigo-500/5 text-sky-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-slate-400">
            Dari {stats.totalPekan.toLocaleString("id-ID")} pekan di seluruh bulan
          </p>
        </GlassCard>
      </Reveal>

      <Reveal delay={staggerDelay(1, 0.08)}>
        <GlassCard hover className="h-full !p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">
                Total Pekan Selesai (100%)
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
                <CountUp value={stats.pekanSelesai} delay={0.28} />
                <span className="ml-1 text-base font-semibold text-slate-400">
                  / {stats.totalPekan.toLocaleString("id-ID")}
                </span>
              </p>
            </div>
            <div className="stat-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/25 to-emerald-600/5 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-slate-400">
            Pekan yang menyelesaikan WET, WTT, dan Podcast
          </p>
        </GlassCard>
      </Reveal>

      <Reveal delay={staggerDelay(2, 0.08)}>
        <GlassCard hover className="h-full !p-4">
          <p className="text-xs font-medium text-slate-400">Status Program Aktif</p>
          <ul className="mt-3 space-y-2">
            {programs.map((program, index) => {
              const Icon = program.icon;
              const delay = staggerDelay(index, 0.1, 0.4);
              return (
                <Reveal
                  as="li"
                  key={program.id}
                  variant="left"
                  delay={delay}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                  <span className="w-16 text-[11px] font-semibold text-slate-300">
                    {program.label}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <AnimatedBar
                      percent={program.status.persen}
                      delay={delay + 0.1}
                      className="block h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
                    />
                  </span>
                  <span className="w-14 text-right text-[11px] font-semibold text-white tabular-nums">
                    <CountUp
                      value={program.status.aktif}
                      duration={0.8}
                      delay={delay + 0.1}
                    />
                    /{program.status.total}
                  </span>
                </Reveal>
              );
            })}
          </ul>
        </GlassCard>
      </Reveal>
    </div>
  );
}
