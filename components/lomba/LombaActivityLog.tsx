import type { ActivityItem } from "@/lib/lomba";
import { GlassCard } from "@/components/GlassCard";

interface LombaActivityLogProps {
  items: ActivityItem[];
}

function statusBadge(item: ActivityItem): {
  label: string;
  className: string;
} {
  if (item.status === "Selesai") {
    const juara =
      item.peringkat !== "-" ? `Juara ${item.peringkat}` : "Selesai";
    return {
      label: juara,
      className:
        "border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-amber-500/15 text-emerald-200",
    };
  }
  if (item.status === "Pelaksanaan") {
    return {
      label: "Sedang Berlangsung",
      className: "border-sky-500/40 bg-sky-500/15 text-sky-200",
    };
  }
  return {
    label: "Pendaftaran",
    className: "border-yellow-500/40 bg-yellow-500/15 text-yellow-200",
  };
}

export function LombaActivityLog({ items }: LombaActivityLogProps) {
  return (
    <GlassCard title="Kejuaraan Terbaru" className="h-full">
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Belum ada aktivitas lomba.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const badge = statusBadge(item);
            return (
              <article
                key={item.id}
                className="side-panel-row rounded-xl border p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {item.namaLomba}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {item.namaSiswa}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {item.tingkatLomba} · {item.pelaksanaan} · {item.tanggal}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
