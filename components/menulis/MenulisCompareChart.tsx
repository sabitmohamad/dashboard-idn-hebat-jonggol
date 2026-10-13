"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { MenulisChartPoint } from "@/lib/menulis";
import { formatNum, percent, formatPct } from "@/lib/menulis";
import { GlassCard } from "@/components/GlassCard";

interface MenulisCompareChartProps {
  data: MenulisChartPoint[];
  title: string;
  unit: string;
  pencapaianColor: string;
}

export function MenulisCompareChart({
  data,
  title,
  unit,
  pencapaianColor,
}: MenulisCompareChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <GlassCard
      title={title}
      action={<BarChart3 className="h-4 w-4 text-emerald-400" />}
      className="!p-4"
    >
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: pencapaianColor }}
          />
          Pencapaian
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-500" />
          Target
        </span>
      </div>

      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Belum ada data kelas.
        </p>
      ) : (
        <div className="h-72 w-full sm:h-80">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                barCategoryGap="22%"
                barGap={3}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(148,163,184,0.12)"
                />
                <XAxis
                  dataKey="kelas"
                  interval={0}
                  angle={-32}
                  textAnchor="end"
                  height={52}
                  tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  width={40}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(16,185,129,0.08)" }}
                  formatter={(value, name) => {
                    const n = Number(value ?? 0);
                    return [`${formatNum(n)} ${unit}`, String(name)];
                  }}
                  labelFormatter={(label, payload) => {
                    const point = payload?.[0]?.payload as
                      | MenulisChartPoint
                      | undefined;
                    const pct = point
                      ? formatPct(percent(point.pencapaian, point.target))
                      : "";
                    return pct ? `Kelas ${label} · ${pct}` : `Kelas ${label}`;
                  }}
                  contentStyle={{
                    background: "rgba(2, 6, 23, 0.96)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    borderRadius: 12,
                    color: "#e2e8f0",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#fff", fontWeight: 600 }}
                />
                <Bar
                  dataKey="pencapaian"
                  name="Pencapaian"
                  fill={pencapaianColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={26}
                />
                <Bar
                  dataKey="target"
                  name="Target"
                  fill="#475569"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full animate-pulse rounded-xl bg-white/5" />
          )}
        </div>
      )}
    </GlassCard>
  );
}
