import { Crown, Users, Wallet } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { formatRupiah, type TabunganStats } from "@/lib/tabungan";

interface TabunganStatCardsProps {
  stats: TabunganStats;
}

export function TabunganStatCards({ stats }: TabunganStatCardsProps) {
  const cards = [
    {
      id: "total",
      label: "Total Akumulasi Tabungan",
      value: formatRupiah(stats.total),
      hint: `Dari ${stats.jumlahSiswa.toLocaleString("id-ID")} siswa sesuai filter aktif`,
      icon: Wallet,
      accent:
        "from-yellow-500/25 to-amber-600/5 text-yellow-300 border-yellow-500/30",
    },
    {
      id: "rata-rata",
      label: "Rata-rata Tabungan Per Siswa",
      value: formatRupiah(stats.rataRata),
      hint: "Total akumulasi dibagi jumlah siswa",
      icon: Users,
      accent:
        "from-lime-500/25 to-lime-600/5 text-lime-300 border-lime-500/30",
    },
    {
      id: "tertinggi",
      label: "Siswa dengan Saldo Tertinggi",
      value: stats.tertinggi ? formatRupiah(stats.tertinggi.total) : "—",
      hint: stats.tertinggi
        ? `${stats.tertinggi.nama} · Kelas ${stats.tertinggi.kelas || "—"}`
        : "Belum ada data siswa",
      icon: Crown,
      accent:
        "from-amber-400/25 to-orange-500/5 text-amber-300 border-amber-400/30",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <GlassCard key={card.id} hover className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  {card.label}
                </p>
                <p className="mt-2 truncate text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${card.accent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 truncate text-[11px] leading-snug text-slate-400">
              {card.hint}
            </p>
          </GlassCard>
        );
      })}
    </div>
  );
}
