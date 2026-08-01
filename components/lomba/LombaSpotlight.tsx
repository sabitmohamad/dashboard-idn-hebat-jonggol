import { Medal, Sparkles } from "lucide-react";
import type { StudentAchievement } from "@/lib/lomba";
import { GlassCard } from "@/components/GlassCard";
import { StudentAvatar } from "@/components/StudentAvatar";

interface LombaSpotlightProps {
  student: StudentAchievement | null;
}

export function LombaSpotlight({ student }: LombaSpotlightProps) {
  if (!student) {
    return (
      <GlassCard className="flex h-full items-center justify-center !p-3">
        <p className="text-sm text-slate-400">
          Belum ada siswa berprestasi pada filter ini.
        </p>
      </GlassCard>
    );
  }

  const badges = [
    {
      label: "Juara 1",
      count: student.juara1,
      emoji: "🥇",
      tone: "text-amber-300 border-amber-400/40 bg-amber-500/10",
    },
    {
      label: "Juara 2",
      count: student.juara2,
      emoji: "🥈",
      tone: "text-slate-200 border-slate-300/40 bg-slate-400/10",
    },
    {
      label: "Juara 3",
      count: student.juara3,
      emoji: "🥉",
      tone: "text-orange-300 border-orange-500/40 bg-orange-600/10",
    },
  ];

  return (
    <GlassCard className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden !p-3">
      <div className="mb-2 flex shrink-0 items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <h2 className="text-xs font-semibold tracking-wide text-white uppercase sm:text-sm">
          Spotlight Siswa Berprestasi
        </h2>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-between">
        <div className="spotlight-glow absolute inset-0" />

        <div className="relative z-10 flex flex-col items-center pt-1">
          <div className="relative">
            <div className="absolute inset-0 scale-125 rounded-full bg-amber-500/20 blur-2xl" />
            <StudentAvatar
              size={96}
              className="relative"
              style={{
                filter: "drop-shadow(0 0 24px rgba(245, 158, 11, 0.45))",
              }}
            />
          </div>

          <h3 className="mt-3 text-center text-lg font-bold text-white sm:text-xl">
            {student.name}
          </h3>
          <p className="mt-0.5 text-sm text-slate-300">{student.className}</p>
          <p className="mt-0.5 text-xs text-amber-300/90">
            {student.totalJuara} perolehan juara · {student.points} poin
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-200">
            <Medal className="h-3.5 w-3.5 shrink-0" />
            Peringkat terbanyak di filter aktif
          </div>
        </div>

        <div className="relative z-20 mb-12 w-full shrink-0 pt-3">
          <div className="grid w-full grid-cols-3 gap-2">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`rounded-xl border px-1.5 py-1.5 text-center sm:px-2 sm:py-2 ${b.tone}`}
              >
                <p className="text-sm leading-none sm:text-base">{b.emoji}</p>
                <p className="mt-1 text-base font-bold sm:text-lg">{b.count}</p>
                <p className="text-[9px] tracking-wide uppercase opacity-80">
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
