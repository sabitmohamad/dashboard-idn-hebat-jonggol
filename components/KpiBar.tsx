import {
  Activity,
  Award,
  BadgeCheck,
  BookMarked,
  BookOpen,
  CalendarDays,
  FileText,
  Flag,
  Headphones,
  Heart,
  Layers,
  Medal,
  Mic,
  PenLine,
  Radio,
  School,
  ScrollText,
  Smile,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { KpiMetric } from "@/lib/types";
import { GlassCard } from "./GlassCard";

const ICONS: Record<KpiMetric["icon"], LucideIcon> = {
  school: School,
  activity: Activity,
  calendar: CalendarDays,
  users: Users,
  trophy: Trophy,
  medal: Medal,
  flag: Flag,
  fileText: FileText,
  badgeCheck: BadgeCheck,
  bookOpen: BookOpen,
  pen: PenLine,
  mic: Mic,
  headphones: Headphones,
  radio: Radio,
  video: Video,
  heart: Heart,
  star: Star,
  smile: Smile,
  award: Award,
  book: BookMarked,
  target: Target,
  scroll: ScrollText,
  sparkles: Sparkles,
  layers: Layers,
};

const ACCENT: Record<KpiMetric["accent"], string> = {
  blue: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30",
  cyan: "from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/30",
  indigo:
    "from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30",
  amber: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30",
  orange:
    "from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/30",
  red: "from-red-500/20 to-red-600/5 text-red-400 border-red-500/30",
  emerald:
    "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30",
  mint: "from-emerald-300/20 to-teal-500/5 text-emerald-300 border-emerald-300/30",
  purple:
    "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30",
  pink: "from-pink-500/20 to-pink-600/5 text-pink-400 border-pink-500/30",
  teal: "from-teal-500/20 to-teal-600/5 text-teal-400 border-teal-500/30",
  green: "from-green-500/20 to-green-600/5 text-green-400 border-green-500/30",
  royal: "from-blue-600/20 to-blue-700/5 text-blue-400 border-blue-600/30",
  violet:
    "from-violet-500/20 to-violet-600/5 text-violet-400 border-violet-500/30",
  rainbow:
    "from-indigo-500/20 via-fuchsia-500/10 to-amber-500/10 text-indigo-300 border-indigo-400/30",
};

interface KpiBarProps {
  metrics: KpiMetric[];
}

export function KpiBar({ metrics }: KpiBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {metrics.map((m) => {
        const Icon = ICONS[m.icon];
        return (
          <GlassCard key={m.id} hover className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-400">{m.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {m.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${ACCENT[m.accent]}`}
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
