"use client";

import { useSyncExternalStore } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useTvMode } from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";
import {
  formatRupiah,
  formatRupiahCompact,
  type TabunganTrendPoint,
} from "@/lib/tabungan";

interface TabunganTrendChartProps {
  data: TabunganTrendPoint[];
}

const subscribeNoop = () => () => {};

export function TabunganTrendChart({ data }: TabunganTrendChartProps) {
  const tv = useTvMode();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  return (
    <GlassCard
      title="Tren Total Tabungan per Bulan"
      action={<TrendingUp className="h-4 w-4 text-yellow-300" />}
      className="!p-4"
    >
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-yellow-400" />
          Setoran per bulan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-lime-400" />
          Akumulasi
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
              <defs>
                <linearGradient id="tabunganBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" />
              <XAxis
                dataKey="bulan"
                interval={0}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                width={56}
                tickFormatter={(v) => formatRupiahCompact(Number(v))}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(250,204,21,0.08)" }}
                formatter={(value, name) => [
                  formatRupiah(Number(value ?? 0)),
                  String(name),
                ]}
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.96)",
                  border: "1px solid rgba(250, 204, 21, 0.35)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
              />
              <Bar
                dataKey="perBulan"
                name="Setoran per bulan"
                fill="url(#tabunganBar)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
                isAnimationActive={!tv}
                animationBegin={200}
                animationDuration={900}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="akumulasi"
                name="Akumulasi"
                stroke="#A3E635"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#A3E635", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={!tv}
                animationBegin={600}
                animationDuration={1100}
                animationEasing="ease-out"
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
