"use client";

import { NAV_ITEMS } from "@/lib/nav";
import { getTheme } from "@/lib/themes";
import type { MenuId } from "@/lib/types";

/** Compact labels so equal-width tabs stay balanced on TV / desktop. */
const NAV_LABELS: Record<MenuId, { full: string; short: string }> = {
  summary: { full: "Summary", short: "Summary" },
  mengajar: { full: "IDN Mengajar", short: "Mengajar" },
  lomba: { full: "IDN Lomba", short: "Lomba" },
  menulis: { full: "IDN Menulis & Sertifikasi", short: "Menulis" },
  talking: { full: "IDN Talking", short: "Talking" },
  karakter: { full: "IDN Karakter", short: "Karakter" },
  tahfidz: { full: "IDN Tahfidz", short: "Tahfidz" },
};

interface BottomNavProps {
  active: MenuId;
  onChange: (id: MenuId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const activeTheme = getTheme(active);

  return (
    <nav
      aria-label="Navigasi program"
      className="group/nav pointer-events-none fixed inset-x-0 bottom-0 z-50"
    >
      {/* Invisible hit area so users can hover near the bottom edge */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 h-6" />

      <div className="pointer-events-none px-3 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div
            className="pointer-events-auto mx-auto flex w-full translate-y-[calc(100%+1.25rem)] items-stretch justify-center gap-1.5 rounded-2xl p-2 opacity-0 shadow-lg transition-all duration-300 ease-out group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 glass-card"
            style={{
              borderColor: `rgba(${activeTheme.primaryRgb}, 0.35)`,
              boxShadow: `0 -8px 40px rgba(${activeTheme.primaryRgb}, 0.18)`,
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === active;
              const theme = getTheme(item.id);
              const labels = NAV_LABELS[item.id];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange(item.id)}
                  title={labels.full}
                  className={`flex min-w-0 flex-1 basis-0 items-center justify-center rounded-xl px-1.5 py-2.5 text-center text-[10px] font-semibold transition-all duration-300 sm:px-2 sm:text-xs md:text-sm ${
                    isActive
                      ? "text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                          boxShadow: `0 4px 20px rgba(${theme.primaryRgb}, 0.5)`,
                        }
                      : undefined
                  }
                >
                  <span className="block truncate leading-tight lg:hidden">
                    {labels.short}
                  </span>
                  <span className="hidden truncate leading-tight lg:block">
                    {labels.full}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
