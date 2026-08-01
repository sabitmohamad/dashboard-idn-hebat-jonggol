import { Trophy } from "lucide-react";
import type { StudentRank } from "@/lib/types";
import { GlassCard } from "./GlassCard";
import { StudentAvatar } from "./StudentAvatar";

interface LeaderboardCardProps {
  items: StudentRank[];
  title?: string;
  metricUnit?: string;
}

function rankTone(rank: number): string {
  if (rank === 1) return "bg-amber-500 text-slate-950";
  if (rank === 2) return "bg-slate-300 text-slate-900";
  if (rank === 3) return "bg-amber-700 text-amber-50";
  return "rank-default";
}

export function LeaderboardCard({
  items,
  title = "Top 10 Terbanyak",
  metricUnit = "hari",
}: LeaderboardCardProps) {
  return (
    <GlassCard
      title={title}
      action={
        <Trophy
          className="h-4 w-4"
          style={{ color: "var(--theme-secondary)" }}
        />
      }
      className="flex h-full flex-col"
    >
      <ul
        className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1"
        style={{ maxHeight: 420 }}
      >
        {items.map((item) => (
          <li
            key={`${item.rank}-${item.name}`}
            className="leaderboard-row flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${rankTone(item.rank)}`}
            >
              {item.rank}
            </span>
            <StudentAvatar size={36} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {item.name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {item.className}
                {item.school ? ` · ${item.school}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-sm font-bold"
                style={{ color: "var(--theme-secondary)" }}
              >
                {item.days}
              </p>
              <p className="text-[10px] text-slate-500">{metricUnit}</p>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
