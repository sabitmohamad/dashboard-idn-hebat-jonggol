import { CheckCircle2, Languages, Mic2, MessagesSquare } from "lucide-react";
import type { TalkingStats } from "@/lib/talking";
import { GlassCard } from "@/components/GlassCard";

interface TalkingStatCardsProps {
  stats: TalkingStats;
}

const CARDS = [
  {
    id: "podcast",
    label: "Total Sesi Podcast",
    key: "totalPodcast" as const,
    doneKey: "donePodcast" as const,
    hint: (done: number) => `${done} episode Done`,
    icon: Mic2,
    accent: "from-purple-500/20 to-fuchsia-600/5 text-purple-300 border-purple-500/30",
  },
  {
    id: "wtt",
    label: "Total Sesi WTT",
    key: "totalWtt" as const,
    doneKey: null,
    hint: () => "Weekly Talk terjadwal",
    icon: MessagesSquare,
    accent: "from-pink-500/20 to-rose-600/5 text-pink-300 border-pink-500/30",
  },
  {
    id: "wet",
    label: "Total Sesi WET",
    key: "totalWet" as const,
    doneKey: "doneWet" as const,
    hint: (done: number) => `${done} sesi Done`,
    icon: Languages,
    accent: "from-sky-500/20 to-indigo-600/5 text-sky-300 border-sky-500/30",
  },
] as const;

export function TalkingStatCards({ stats }: TalkingStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const done = card.doneKey ? stats[card.doneKey] : 0;
        return (
          <GlassCard key={card.id} hover className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-400">{card.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {stats[card.key].toLocaleString("id-ID")}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-500">
                  {card.doneKey ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  ) : null}
                  {card.hint(done)}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${card.accent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
