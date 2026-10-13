"use client";

import { motion } from "framer-motion";
import { Medal, Sparkles } from "lucide-react";
import type { StudentAchievement } from "@/lib/lomba";
import { CountUp, Reveal, staggerDelay, useTvMode } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";
import { StudentAvatar } from "@/components/StudentAvatar";

interface LombaSpotlightProps {
  student: StudentAchievement | null;
}

export function LombaSpotlight({ student }: LombaSpotlightProps) {
  const tv = useTvMode();

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
          <motion.div
            key={student.id}
            className="relative"
            initial={tv ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={tv ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.15 }}
          >
            <div className="absolute inset-0 scale-125 rounded-full bg-amber-500/20 blur-2xl" />
            <div className="float-slow">
              <StudentAvatar
                size={96}
                className="relative"
                style={{
                  filter: "drop-shadow(0 0 24px rgba(245, 158, 11, 0.45))",
                }}
              />
            </div>
          </motion.div>

          <Reveal
            as="p"
            delay={0.3}
            className="mt-3 text-center text-lg font-bold text-white sm:text-xl"
          >
            {student.name}
          </Reveal>
          <Reveal as="p" delay={0.38} className="mt-0.5 text-sm text-slate-300">
            {student.className}
          </Reveal>
          <Reveal as="p" delay={0.46} className="mt-0.5 text-xs text-amber-300/90">
            <CountUp value={student.totalJuara} duration={0.8} delay={0.6} />{" "}
            perolehan juara ·{" "}
            <CountUp value={student.points} duration={0.8} delay={0.6} /> poin
          </Reveal>

          <Reveal
            delay={0.54}
            variant="scale"
            className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-200"
          >
            <Medal className="h-3.5 w-3.5 shrink-0" />
            Peringkat terbanyak di filter aktif
          </Reveal>
        </div>

        <div className="relative z-20 mt-4 w-full shrink-0">
          <div className="grid w-full grid-cols-3 gap-2">
            {badges.map((b, index) => (
              <Reveal
                key={b.label}
                variant="scale"
                delay={staggerDelay(index, 0.08, 0.6)}
                whileHover={tv ? undefined : { y: -3, scale: 1.04 }}
                className={`rounded-xl border px-1.5 py-1.5 text-center sm:px-2 sm:py-2 ${b.tone}`}
              >
                <p className="text-sm leading-none sm:text-base">{b.emoji}</p>
                <p className="mt-1 text-base font-bold tabular-nums sm:text-lg">
                  <CountUp
                    value={b.count}
                    duration={0.7}
                    delay={staggerDelay(index, 0.08, 0.75)}
                  />
                </p>
                <p className="text-[9px] tracking-wide uppercase opacity-80">
                  {b.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
