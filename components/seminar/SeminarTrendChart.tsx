"use client";

import { useSyncExternalStore } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { formatPct, type SeminarTrendPoint } from "@/lib/seminar";

interface SeminarTrendChartProps {
  data: SeminarTrendPoint[];
}

const subscribeNoop = () => () => {};

function barColor(value: number): string {
  if (value >= 99.5) return "#34d399";
  if (value >= 66) return "#facc15";
  return "#f87171";
}

export function SeminarTrendChart({ data }: SeminarTrendChartProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return (
    <GlassCard
      title="Tren Persentase Ketercapaian per Bulan"
      action={<TrendingUp className="h-4 w-4 text-sky-300" />}
      className="!p-4"
    >
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
          100%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-yellow-400" />
          Di bawah target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
          Jauh dari target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-indigo-300" />
          Tren Juli–Desember
        </span>
      </div>

      <div className="tv-chart h-72 w-full sm:h-80">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
              barCategoryGap="28%"
            >
              <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" />
              <XAxis
                dataKey="label"
                interval={0}
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                width={42}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(14,165,233,0.08)" }}
                formatter={(value, name) => [
                  formatPct(Number(value ?? 0)),
                  String(name),
                ]}
                labelFormatter={(_label, payload) => {
                  const point = payload?.[0]?.payload as SeminarTrendPoint | undefined;
                  if (!point) return "";
                  return `${point.bulan} · ${point.jumlahPekan} pekan`;
                }}
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.96)",
                  border: "1px solid rgba(14, 165, 233, 0.35)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
              />
              <Bar
                dataKey="rataRata"
                name="Rata-rata ketercapaian"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
                isAnimationActive={false}
              >
                {data.map((point) => (
                  <Cell key={point.bulan} fill={barColor(point.rataRata)} />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="rataRata"
                name="Tren"
                stroke="#a5b4fc"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#a5b4fc", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                legendType="none"
                tooltipType="none"
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full animate-pulse rounded-xl bg-white/5" />
        )}
      </div>
    </GlassCard>
  );
}
