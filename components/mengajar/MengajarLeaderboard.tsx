import { Crown } from "lucide-react";
import type { RekapSiswaMengajar } from "@/src/data/mockMengajar";
import { GlassCard } from "@/components/GlassCard";
import { StudentAvatar } from "@/components/StudentAvatar";

interface MengajarLeaderboardProps {
  items: RekapSiswaMengajar[];
}

function rankTone(rank: number): string {
  if (rank === 1)
    return "bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.45)]";
  if (rank === 2)
    return "bg-slate-300 text-slate-900 shadow-[0_0_12px_rgba(203,213,225,0.35)]";
  if (rank === 3)
    return "bg-amber-700 text-amber-50 shadow-[0_0_12px_rgba(180,83,9,0.4)]";
  return "bg-slate-700/80 text-slate-200";
}

function rowTone(rank: number): string {
  if (rank === 1) return "!border-amber-400/40 bg-amber-500/5";
  if (rank === 2) return "!border-slate-300/30";
  if (rank === 3) return "!border-amber-700/40";
  return "";
}

export function MengajarLeaderboard({ items }: MengajarLeaderboardProps) {
  return (
    <GlassCard
      title="Leaderboard Siswa Teraktif"
      action={<Crown className="h-4 w-4 text-amber-400" />}
      className="flex h-full min-h-0 flex-col !p-4"
    >
      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Belum ada rekap mengajar siswa.
        </p>
      ) : (
        <ul className="mengajar-scroll flex flex-1 flex-col gap-2 max-h-[520px] overflow-y-auto pr-1 xl:max-h-[calc(100vh-330px)]">
          {items.map((item, index) => {
            const rank = index + 1;
            return (
              <li
                key={item.id}
                className={`leaderboard-row flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${rowTone(rank)}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${rankTone(rank)}`}
                >
                  {rank}
                </span>
                <StudentAvatar size={36} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.nama}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    Kelas {item.kelas || "—"}
                    <span className="text-slate-600"> · {item.id}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-cyan-300">
                    {item.totalMengajar}
                  </p>
                  <p className="text-[10px] text-slate-500">sesi</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
