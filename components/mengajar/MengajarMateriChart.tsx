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
import { BookOpen } from "lucide-react";
import type { MateriSlice } from "@/lib/mengajar";
import { GlassCard } from "@/components/GlassCard";

interface MengajarMateriChartProps {
  data: MateriSlice[];
}

function shorten(label: string, max = 28): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export function MengajarMateriChart({ data }: MengajarMateriChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <GlassCard
      title="Top Materi Mengajar"
      action={<BookOpen className="h-4 w-4 text-cyan-400" />}
      className="!p-4"
    >
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Belum ada data materi.
        </p>
      ) : (
        <div style={{ height: Math.max(140, data.length * 38) }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={190}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                tickFormatter={(v: string) => shorten(v)}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                formatter={(value) => {
                  const n = Number(value);
                  const pct = total ? Math.round((n / total) * 100) : 0;
                  return [`${n} sesi (${pct}%)`, "Diajarkan"];
                }}
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(59, 130, 246, 0.35)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22} isAnimationActive={false}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
