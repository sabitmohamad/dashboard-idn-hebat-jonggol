import { Flag, Loader, Trophy, Users } from "lucide-react";
import type { LombaStats } from "@/lib/lomba";
import { CountUp, Reveal, staggerDelay } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";

interface LombaStatCardsProps {
  stats: LombaStats;
}

const CARDS = [
  {
    id: "kejuaraan",
    label: "Total Kejuaraan",
    hint: "Juara 1, 2, 3",
    key: "totalKejuaraan" as const,
    icon: Trophy,
    accent: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30",
  },
  {
    id: "progres",
    label: "Lomba Dalam Progres",
    hint: "Pendaftaran & Pelaksanaan",
    key: "lombaDalamProgres" as const,
    icon: Loader,
    accent: "from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/30",
  },
  {
    id: "skala",
    label: "Internasional & Nasional",
    hint: "Skala kompetisi besar",
    key: "skalaBesar" as const,
    icon: Flag,
    accent: "from-red-500/20 to-red-600/5 text-red-400 border-red-500/30",
  },
  {
    id: "siswa",
    label: "Total Siswa Berpartisipasi",
    hint: "Unique ID siswa",
    key: "totalSiswa" as const,
    icon: Users,
    accent: "from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/30",
  },
] as const;

export function LombaStatCards({ stats }: LombaStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {CARDS.map((card, index) => {
        const Icon = card.icon;
        return (
          <Reveal key={card.id} delay={staggerDelay(index, 0.07)}>
            <GlassCard hover className="h-full !p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-400">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
                    <CountUp
                      value={stats[card.key]}
                      delay={staggerDelay(index, 0.07, 0.2)}
                    />
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">{card.hint}</p>
                </div>
                <div
                  className={`stat-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${card.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </GlassCard>
          </Reveal>
        );
      })}
    </div>
  );
}
