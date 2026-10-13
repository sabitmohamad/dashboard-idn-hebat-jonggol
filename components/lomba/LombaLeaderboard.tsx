import { Trophy, Users, User } from "lucide-react";
import type { StudentAchievement } from "@/lib/lomba";
import { CountUp, Reveal, staggerDelay } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";
import { StudentAvatar } from "@/components/StudentAvatar";

interface LombaLeaderboardProps {
  items: StudentAchievement[];
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

export function LombaLeaderboard({ items }: LombaLeaderboardProps) {
  return (
    <GlassCard
      title="Leaderboard Perolehan Juara"
      action={<Trophy className="h-4 w-4 text-amber-400" />}
      className="flex h-full min-h-0 flex-col !p-4"
    >
      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Tidak ada perolehan juara pada filter ini.
        </p>
      ) : (
        <ul className="lomba-scroll flex max-h-[28rem] min-h-[16rem] flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
          {items.slice(0, 10).map((item, index) => {
            const rank = index + 1;
            const JenisIcon = item.jenis === "Tim" ? Users : User;
            return (
              <Reveal
                as="li"
                key={item.id}
                interactive
                variant="left"
                delay={staggerDelay(index, 0.05, 0.25)}
                className="leaderboard-row flex items-center gap-3 rounded-xl border px-3 py-2.5"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${rankTone(rank)}`}
                >
                  {rank}
                </span>
                <StudentAvatar size={36} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {item.className}
                    {" · "}
                    {item.juara1}🥇 {item.juara2}🥈 {item.juara3}🥉
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-200">
                      <JenisIcon className="h-2.5 w-2.5" />
                      {item.jenis}
                    </span>
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${
                        item.pelaksanaan === "Online"
                          ? "border-sky-500/30 bg-sky-500/10 text-sky-300"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {item.pelaksanaan}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-300 tabular-nums">
                    <CountUp
                      value={item.points}
                      duration={0.8}
                      delay={staggerDelay(index, 0.05, 0.35)}
                    />
                  </p>
                  <p className="text-[10px] text-slate-500">poin</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
