"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusSlice } from "@/lib/types";
import { GlassCard } from "./GlassCard";

interface StatusChartProps {
  data: StatusSlice[];
  title?: string;
}

export function StatusChart({
  data,
  title = "Status Program",
}: StatusChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <GlassCard title={title} className="h-full">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
                stroke="transparent"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(var(--theme-primary-rgb), 0.35)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{total}</span>
            <span className="text-[10px] tracking-wider text-slate-400 uppercase">
              Total
            </span>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-2.5">
          {data.map((slice) => (
            <li
              key={slice.name}
              className="chart-legend-row flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-xs text-slate-300">{slice.name}</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {slice.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
