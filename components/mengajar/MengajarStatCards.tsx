import { CalendarCheck, GraduationCap, School, Users } from "lucide-react";
import type { MengajarStats } from "@/lib/mengajar";
import { CountUp, Reveal, staggerDelay } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";

interface MengajarStatCardsProps {
  stats: MengajarStats;
}

const CARDS = [
  {
    id: "sesi",
    label: "Total Sesi Mengajar",
    hint: "Kegiatan terlaksana",
    key: "totalSesi" as const,
    icon: CalendarCheck,
    accent: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30",
  },
  {
    id: "siswa",
    label: "Total Siswa Partisipan",
    hint: "Siswa IDN yang mengajar",
    key: "totalSiswa" as const,
    icon: Users,
    accent: "from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "sekolah",
    label: "Total Sekolah Mitra",
    hint: "Sekolah tujuan pengabdian",
    key: "totalSekolah" as const,
    icon: School,
    accent: "from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "peserta",
    label: "Total Peserta Didik Luar",
    hint: "Siswa eksternal yang diajar",
    key: "totalPeserta" as const,
    icon: GraduationCap,
    accent: "from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/30",
  },
] as const;

export function MengajarStatCards({ stats }: MengajarStatCardsProps) {
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
