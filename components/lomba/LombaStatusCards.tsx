import { CheckCircle2, ClipboardList, PlayCircle, type LucideIcon } from "lucide-react";
import type { StatusProgres } from "@/src/data/mockLomba";
import {
  STATUS_ORDER,
  type LombaStatusEntry,
  type LombaStatusGroups,
} from "@/lib/lomba";
import { GlassCard } from "@/components/GlassCard";

interface LombaStatusCardsProps {
  groups: LombaStatusGroups;
}

const STATUS_META: Record<
  StatusProgres,
  {
    title: string;
    hint: string;
    empty: string;
    icon: LucideIcon;
    iconTone: string;
    countTone: string;
    badgeTone: string;
  }
> = {
  Pendaftaran: {
    title: "Lomba Dalam Pendaftaran",
    hint: "Siswa sedang mendaftar",
    empty: "Tidak ada lomba dalam pendaftaran.",
    icon: ClipboardList,
    iconTone: "border-yellow-500/30 from-yellow-500/20 to-yellow-600/5 text-yellow-300",
    countTone: "text-yellow-300",
    badgeTone: "border-yellow-500/40 bg-yellow-500/15 text-yellow-200",
  },
  Pelaksanaan: {
    title: "Lomba Dalam Pelaksanaan",
    hint: "Sedang berlangsung",
    empty: "Tidak ada lomba yang sedang berlangsung.",
    icon: PlayCircle,
    iconTone: "border-sky-500/30 from-sky-500/20 to-sky-600/5 text-sky-300",
    countTone: "text-sky-300",
    badgeTone: "border-sky-500/40 bg-sky-500/15 text-sky-200",
  },
  Selesai: {
    title: "Lomba Selesai",
    hint: "Hasil & perolehan juara",
    empty: "Belum ada lomba yang selesai.",
    icon: CheckCircle2,
    iconTone: "border-emerald-500/30 from-emerald-500/20 to-emerald-600/5 text-emerald-300",
    countTone: "text-emerald-300",
    badgeTone:
      "border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-amber-500/15 text-emerald-200",
  },
};

function peringkatLabel(peringkat: string): string | null {
  if (/^\d+$/.test(peringkat)) return `Juara ${peringkat}`;
  if (peringkat && peringkat !== "-") return peringkat;
  return null;
}

function entryBadge(status: StatusProgres, entry: LombaStatusEntry): string {
  if (status === "Selesai") {
    return peringkatLabel(entry.peringkat) ?? "Partisipasi";
  }
  return entry.tingkatLomba;
}

function pesertaText(status: StatusProgres, entry: LombaStatusEntry): string {
  return entry.peserta
    .map((p) =>
      status === "Selesai" && /^\d+$/.test(p.peringkat)
        ? `${p.name} (Juara ${p.peringkat})`
        : p.name
    )
    .join(", ");
}

export function LombaStatusCards({ groups }: LombaStatusCardsProps) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        const Icon = meta.icon;
        const items = groups[status];

        return (
          <GlassCard
            key={status}
            className="flex h-full min-h-[220px] flex-col !p-4 md:min-h-0"
          >
            <div className="mb-3 flex shrink-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-xs font-semibold tracking-wide text-white uppercase sm:text-sm">
                  {meta.title}
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-500">{meta.hint}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`text-2xl font-bold leading-none ${meta.countTone}`}>
                  {items.length}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br ${meta.iconTone}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </div>

            {items.length === 0 ? (
              <p className="flex flex-1 items-center justify-center py-4 text-center text-xs text-slate-400">
                {meta.empty}
              </p>
            ) : (
              <ul className="lomba-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {items.map((entry) => (
                  <li
                    key={entry.id}
                    className="side-panel-row shrink-0 rounded-xl border px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 text-[13px] leading-snug font-semibold text-white">
                        {entry.namaLomba}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta.badgeTone}`}
                      >
                        {entryBadge(status, entry)}
                      </span>
                    </div>
                    {entry.peserta.length > 0 ? (
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                        {pesertaText(status, entry)}
                      </p>
                    ) : null}
                    <p className="mt-0.5 truncate text-[10px] text-slate-500">
                      {[
                        status === "Selesai" ? entry.tingkatLomba : null,
                        entry.jenis,
                        entry.pelaksanaan,
                        entry.tanggal,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
