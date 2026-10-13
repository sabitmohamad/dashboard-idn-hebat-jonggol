"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Globe, MapPin } from "lucide-react";
import type { ChartSlice } from "@/lib/lomba";
import { CountUp, Reveal, useTvMode } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";

interface LombaJenjangChartProps {
  data: ChartSlice[];
  online: number;
  offline: number;
}

export function LombaJenjangChart({
  data,
  online,
  offline,
}: LombaJenjangChartProps) {
  const tv = useTvMode();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const chartData = data.map((d) => ({
    ...d,
    pct: total ? Math.round((d.value / total) * 100) : 0,
  }));

  return (
    <GlassCard title="Jenjang Sekolah Target" className="h-full min-h-[220px]">
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Tidak ada data jenjang sekolah.
        </p>
      ) : (
        <>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value, _name, item) => {
                    const pct = (item?.payload as { pct?: number } | undefined)?.pct ?? 0;
                    return [`${value} lomba (${pct}%)`, "Jumlah"];
                  }}
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    borderRadius: 12,
                    color: "#e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                  isAnimationActive={!tv}
                  animationBegin={250}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Reveal
              as="span"
              interactive
              variant="scale"
              delay={0.5}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300"
            >
              <Globe className="h-3 w-3" />
              Online <CountUp value={online} duration={0.7} delay={0.6} />
            </Reveal>
            <Reveal
              as="span"
              interactive
              variant="scale"
              delay={0.58}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300"
            >
              <MapPin className="h-3 w-3" />
              Offline <CountUp value={offline} duration={0.7} delay={0.68} />
            </Reveal>
          </div>
        </>
      )}
    </GlassCard>
  );
}
