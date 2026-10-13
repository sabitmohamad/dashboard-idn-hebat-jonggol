"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, Radio, School, Users } from "lucide-react";
import type { LogMengajar } from "@/src/data/mockMengajar";
import { splitNamaSiswa } from "@/lib/mengajar";
import { GlassCard } from "@/components/GlassCard";

interface MengajarActivityLogProps {
  items: LogMengajar[];
}

export function MengajarActivityLog({ items }: MengajarActivityLogProps) {
  const [bulan, setBulan] = useState("Semua");
  const [expanded, setExpanded] = useState<string | null>(null);

  const bulanOptions = useMemo(() => {
    const seen: string[] = [];
    for (const item of items) {
      if (item.bulan && !seen.includes(item.bulan)) seen.push(item.bulan);
    }
    return ["Semua", ...seen];
  }, [items]);

  const visible = useMemo(
    () => (bulan === "Semua" ? items : items.filter((i) => i.bulan === bulan)),
    [items, bulan]
  );

  return (
    <GlassCard
      title="Log Aktivitas Terbaru"
      action={
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-cyan-300 uppercase">
          <Radio className="h-3 w-3" />
          Live Feed
        </span>
      }
      className="!p-4"
    >
      {bulanOptions.length > 2 ? (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {bulanOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setBulan(opt)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                bulan === opt
                  ? "border-blue-400/50 bg-blue-500/20 text-white"
                  : "border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Belum ada kegiatan mengajar.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {visible.map((item, index) => {
            const key = `${item.no}-${index}`;
            const names = splitNamaSiswa(item.namaSiswa);
            const isOpen = expanded === key;
            const shown = isOpen ? names : names.slice(0, 3);

            return (
              <article
                key={key}
                className="side-panel-row rounded-xl border p-3 transition-colors hover:!border-blue-400/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <School className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                      <span className="truncate">{item.namaSekolah || "—"}</span>
                    </h3>
                    <p className="mt-0.5 text-xs text-cyan-200/90">{item.materi}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                    <Users className="h-3 w-3" />
                    {item.jumlahPeserta} peserta
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-slate-300">
                    <CalendarDays className="h-2.5 w-2.5" />
                    {item.tanggal || "—"}
                  </span>
                  {item.bulan ? (
                    <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 font-medium text-indigo-200">
                      {item.bulan}
                      {item.pekan ? ` · Pekan ${item.pekan}` : ""}
                    </span>
                  ) : null}
                </div>

                {names.length > 0 ? (
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {shown.map((name) => (
                      <span
                        key={name}
                        className="rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300"
                      >
                        {name}
                      </span>
                    ))}
                    {names.length > 3 ? (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : key)}
                        className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-blue-300 hover:text-blue-200"
                      >
                        {isOpen ? "Ringkas" : `+${names.length - 3} lainnya`}
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
