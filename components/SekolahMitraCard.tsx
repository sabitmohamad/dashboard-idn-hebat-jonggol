import { Building2, UsersRound } from "lucide-react";
import type { PartnerSchool } from "@/lib/types";
import { GlassCard } from "./GlassCard";

interface SekolahMitraCardProps {
  schools: PartnerSchool[];
}

function statusBadge(status: PartnerSchool["status"]): string {
  switch (status) {
    case "Aktif":
      return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    case "Persiapan":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    case "Selesai":
      return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  }
}

export function SekolahMitraCard({ schools }: SekolahMitraCardProps) {
  return (
    <GlassCard
      title="Sekolah Mitra"
      action={
        <Building2
          className="h-4 w-4"
          style={{ color: "var(--theme-primary)" }}
        />
      }
      className="h-full"
    >
      <div className="flex flex-col gap-3">
        {schools.map((school) => (
          <article
            key={school.name}
            className="side-panel-row rounded-xl border p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{school.name}</h3>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusBadge(school.status)}`}
              >
                {school.status}
              </span>
            </div>
            <div className="mt-2.5 flex items-start gap-2">
              <UsersRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              <p className="text-xs leading-relaxed text-slate-400">
                {school.team.length
                  ? school.team.join(" · ")
                  : "Tim belum ditetapkan"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </GlassCard>
  );
}
