"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import type { ProgramSlice } from "@/lib/talking";
import { GlassCard } from "@/components/GlassCard";

interface TalkingProgramChartProps {
  data: ProgramSlice[];
}

export function TalkingProgramChart({ data }: TalkingProgramChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <GlassCard
      title="Distribusi Program"
      action={<PieIcon className="h-4 w-4 text-fuchsia-400" />}
      className="!p-4"
    >
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Belum ada sesi talking.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="tv-chart h-44 w-full sm:h-48 sm:w-1/2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    stroke="rgba(15,23,42,0.8)"
                    isAnimationActive={false}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => {
                      const n = Number(value);
                      const pct = total ? Math.round((n / total) * 100) : 0;
                      return [`${n} sesi (${pct}%)`, "Jumlah"];
                    }}
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(168, 85, 247, 0.35)",
                      borderRadius: 12,
                      color: "#e2e8f0",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#fff", fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <ul className="flex w-full flex-col gap-2 sm:w-1/2">
            {data.map((slice) => (
              <li
                key={slice.name}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                <span className="inline-flex items-center gap-2 text-slate-200">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: slice.color }}
                  />
                  {slice.name}
                </span>
                <span className="font-semibold text-white">{slice.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlassCard>
  );
}
