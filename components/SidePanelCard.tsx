import type { SidePanelItem } from "@/lib/types";
import { GlassCard } from "./GlassCard";

interface SidePanelCardProps {
  title: string;
  items: SidePanelItem[];
}

export function SidePanelCard({ title, items }: SidePanelCardProps) {
  return (
    <GlassCard title={title} className="h-full">
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <article key={`${item.title}-${item.subtitle}`} className="side-panel-row rounded-xl border p-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              {item.badge ? (
                <span
                  className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    borderColor: `rgba(var(--theme-primary-rgb), 0.35)`,
                    backgroundColor: `rgba(var(--theme-primary-rgb), 0.12)`,
                    color: "var(--theme-secondary)",
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              {item.subtitle}
            </p>
          </article>
        ))}
      </div>
    </GlassCard>
  );
}
