"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartSlice } from "@/lib/lomba";
import { CountUp, Reveal, staggerDelay, useTvMode } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";

interface LombaSkalaChartProps {
  data: ChartSlice[];
}

export function LombaSkalaChart({ data }: LombaSkalaChartProps) {
  const tv = useTvMode();
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <GlassCard title="Skala Kompetisi" className="h-full min-h-[240px]">
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Tidak ada data skala kompetisi.
        </p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center gap-4 sm:flex-row">
          <div className="lomba-chart-plot relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={64}
                  paddingAngle={3}
                  stroke="transparent"
                  isAnimationActive={!tv}
                  animationBegin={200}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => {
                    const num = Number(value) || 0;
                    const pct = total ? Math.round((num / total) * 100) : 0;
                    return [`${num} (${pct}%)`, String(name)];
                  }}
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    borderRadius: 12,
                    color: "#e2e8f0",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white tabular-nums">
                <CountUp value={total} delay={0.3} />
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase">
                Total
              </span>
            </div>
          </div>

          <ul className="flex w-full flex-col gap-2">
            {data.map((slice, index) => {
              const pct = total ? Math.round((slice.value / total) * 100) : 0;
              return (
                <Reveal
                  as="li"
                  key={slice.name}
                  interactive
                  variant="left"
                  delay={staggerDelay(index, 0.07, 0.35)}
                  className="chart-legend-row flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-xs text-slate-300">{slice.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    <CountUp
                      value={`${pct}%`}
                      duration={0.8}
                      delay={staggerDelay(index, 0.07, 0.45)}
                    />
                  </span>
                </Reveal>
              );
            })}
          </ul>
        </div>
      )}
    </GlassCard>
  );
}
