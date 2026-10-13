import { Award, BadgeCheck, BookOpen, Trophy } from "lucide-react";
import type { MenulisSchoolStats } from "@/lib/menulis";
import { formatNum, formatPct } from "@/lib/menulis";
import { GlassCard } from "@/components/GlassCard";

interface MenulisStatCardsProps {
  stats: MenulisSchoolStats;
}

export function MenulisStatCards({ stats }: MenulisStatCardsProps) {
  const cards = [
    {
      id: "menulis",
      label: "Total Pencapaian Menulis",
      value: formatNum(stats.totalPencapaianMenulis),
      unit: "halaman",
      hint: `${formatPct(stats.persenMenulis)} dari target ${formatNum(stats.totalTargetMenulis)} hlm`,
      progress: stats.persenMenulis,
      icon: BookOpen,
      accent: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30",
      bar: "bg-emerald-400",
    },
    {
      id: "sertifikat",
      label: "Total Sertifikat Diraih",
      value: formatNum(stats.totalPencapaianSertifikat),
      unit: "sertifikat",
      hint: `${formatPct(stats.persenSertifikat)} dari target ${formatNum(stats.totalTargetSertifikat)}`,
      progress: stats.persenSertifikat,
      icon: Award,
      accent: "from-teal-500/20 to-teal-600/5 text-teal-300 border-teal-500/30",
      bar: "bg-teal-300",
    },
    {
      id: "top-menulis",
      label: "Kelas Teratas Menulis",
      value: stats.topMenulis ? stats.topMenulis.kelas : "—",
      unit: stats.topMenulis
        ? `${formatNum(stats.topMenulis.pencapaian)} hlm`
        : "Belum ada data",
      hint: stats.topMenulis
        ? `Kelas ${stats.topMenulis.kelas} — ${formatNum(stats.topMenulis.pencapaian)} hlm`
        : "Menunggu rekap kelas",
      progress: null,
      icon: Trophy,
      accent: "from-emerald-400/20 to-lime-500/5 text-lime-300 border-lime-400/30",
      bar: "bg-emerald-400",
    },
    {
      id: "top-sertifikat",
      label: "Kelas Teratas Sertifikasi",
      value: stats.topSertifikat ? stats.topSertifikat.kelas : "—",
      unit: stats.topSertifikat
        ? `${formatNum(stats.topSertifikat.pencapaian)} sertifikat`
        : "Belum ada data",
      hint: stats.topSertifikat
        ? `Kelas ${stats.topSertifikat.kelas} — ${formatNum(stats.topSertifikat.pencapaian)} sertifikat`
        : "Menunggu rekap kelas",
      progress: null,
      icon: BadgeCheck,
      accent: "from-cyan-500/20 to-emerald-500/5 text-cyan-300 border-cyan-400/30",
      bar: "bg-teal-300",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <GlassCard key={card.id} hover className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">{card.label}</p>
                <p className="mt-2 truncate text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
                  {card.value}
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-200/90">{card.unit}</p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${card.accent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            {card.progress !== null ? (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${card.bar}`}
                  style={{ width: `${Math.min(Math.max(card.progress, 0), 100)}%` }}
                />
              </div>
            ) : null}
            <p className="mt-2 text-[11px] leading-snug text-slate-500">{card.hint}</p>
          </GlassCard>
        );
      })}
    </div>
  );
}
