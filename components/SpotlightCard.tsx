import { Clock3, Sparkles } from "lucide-react";
import type { SpotlightStudent } from "@/lib/types";
import { GlassCard } from "./GlassCard";
import { StudentAvatar } from "./StudentAvatar";

interface SpotlightCardProps {
  student: SpotlightStudent;
}

export function SpotlightCard({ student }: SpotlightCardProps) {
  const title = student.subtitle || "Spotlight Pengajar / Siswa";
  const metricTitle = student.metricTitle || "Major Flight Hours";
  const metricUnit = student.metricUnit || "hari";

  return (
    <GlassCard className="relative flex h-full flex-col overflow-hidden">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles
          className="h-4 w-4"
          style={{ color: "var(--theme-secondary)" }}
        />
        <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
          {title}
        </h2>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center py-6">
        <div className="spotlight-glow absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div
              className="absolute inset-0 scale-125 rounded-full blur-2xl"
              style={{
                backgroundColor: `rgba(var(--theme-primary-rgb), 0.22)`,
              }}
            />
            <StudentAvatar
              size={120}
              className="relative"
              style={{
                filter: `drop-shadow(0 0 30px rgba(var(--theme-primary-rgb), 0.45))`,
              }}
            />
          </div>

          <h3 className="mt-5 text-xl font-bold text-white">{student.name}</h3>
          <p className="mt-1 text-sm text-slate-300">{student.className}</p>
          <p
            className="mt-0.5 text-xs"
            style={{ color: "var(--theme-secondary)" }}
          >
            {student.school}
          </p>

          <div
            className="mt-6 flex items-center gap-3 rounded-2xl border px-5 py-3"
            style={{
              borderColor: `rgba(var(--theme-secondary-rgb), 0.3)`,
              backgroundColor: `rgba(var(--theme-secondary-rgb), 0.1)`,
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `rgba(var(--theme-secondary-rgb), 0.2)`,
              }}
            >
              <Clock3
                className="h-5 w-5"
                style={{ color: "var(--theme-secondary)" }}
              />
            </div>
            <div>
              <p
                className="text-[10px] font-semibold tracking-wider uppercase"
                style={{ color: `rgba(var(--theme-secondary-rgb), 0.85)` }}
              >
                {metricTitle}
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--theme-secondary)" }}
              >
                {student.flightHours}
                <span
                  className="ml-1 text-sm font-medium"
                  style={{ color: `rgba(var(--theme-secondary-rgb), 0.7)` }}
                >
                  {metricUnit}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
