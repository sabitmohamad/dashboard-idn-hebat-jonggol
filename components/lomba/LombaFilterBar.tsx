"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, RotateCcw, X } from "lucide-react";
import type { LombaFilters } from "@/lib/lomba";
import {
  DEFAULT_LOMBA_FILTERS,
  JENJANG_OPTIONS,
  KELAS_OPTIONS,
  PELAKSANAAN_OPTIONS,
  SKALA_OPTIONS,
  STATUS_OPTIONS,
  TINGKAT_OPTIONS,
} from "@/lib/lomba";

interface LombaFilterBarProps {
  filters: LombaFilters;
  pekanOptions: string[];
  bulanOptions: string[];
  onChange: (next: LombaFilters) => void;
  onReset: () => void;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-amber-500/25 bg-slate-950/80 px-2.5 py-2 text-xs text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function countActiveFilters(filters: LombaFilters): number {
  return (Object.keys(DEFAULT_LOMBA_FILTERS) as (keyof LombaFilters)[]).filter(
    (key) => filters[key] !== DEFAULT_LOMBA_FILTERS[key]
  ).length;
}

export function LombaFilterBar({
  filters,
  pekanOptions,
  bulanOptions,
  onChange,
  onReset,
}: LombaFilterBarProps) {
  const [open, setOpen] = useState(false);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  const set = <K extends keyof LombaFilters>(key: K, value: LombaFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup filter"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer + side tab — when closed, only the tab peeks from the right */}
      <div
        className={`fixed top-0 right-0 z-40 flex h-full transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-[calc(100%-2.75rem)]"
        }`}
      >
        {/* Side tab peek button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="lomba-filter-panel"
          title={open ? "Tutup filter" : "Buka filter"}
          className="relative my-auto mr-0 flex h-28 w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-l-xl border border-r-0 border-amber-500/40 bg-slate-950/95 text-amber-300 shadow-[-6px_0_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-amber-500/15 hover:text-amber-200"
        >
          <Filter className="h-4 w-4" />
          {open ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
          <span
            className="text-[10px] font-bold tracking-[0.18em] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Filter
          </span>
          {activeCount > 0 ? (
            <span className="absolute top-1.5 left-1/2 flex h-5 min-w-5 -translate-x-1/2 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-950">
              {activeCount}
            </span>
          ) : null}
        </button>

        <aside
          id="lomba-filter-panel"
          className="flex h-full w-[min(20rem,calc(100vw-3.5rem))] flex-col border-l border-amber-500/25 bg-slate-950/95 shadow-[-12px_0_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:w-80"
        >
          <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
                Filter Multi-Kategori
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-600/50 p-1.5 text-slate-300 transition hover:border-amber-500/40 hover:text-amber-300"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="lomba-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <FilterSelect
              label="Tingkat"
              value={filters.tingkat}
              options={TINGKAT_OPTIONS}
              onChange={(v) => set("tingkat", v)}
            />
            <FilterSelect
              label="Kelas Spesifik"
              value={filters.kelasSpesifik}
              options={KELAS_OPTIONS}
              onChange={(v) => set("kelasSpesifik", v)}
            />
            <FilterSelect
              label="Skala Lomba"
              value={filters.tingkatLomba}
              options={SKALA_OPTIONS}
              onChange={(v) => set("tingkatLomba", v)}
            />
            <FilterSelect
              label="Status"
              value={filters.statusProgres}
              options={STATUS_OPTIONS}
              onChange={(v) => set("statusProgres", v)}
            />
            <FilterSelect
              label="Jenjang"
              value={filters.jenjangSekolah}
              options={JENJANG_OPTIONS}
              onChange={(v) => set("jenjangSekolah", v)}
            />
            <FilterSelect
              label="Pelaksanaan"
              value={filters.pelaksanaan}
              options={PELAKSANAAN_OPTIONS}
              onChange={(v) => set("pelaksanaan", v)}
            />
            <FilterSelect
              label="Pekan"
              value={filters.pekan}
              options={pekanOptions}
              onChange={(v) => set("pekan", v)}
            />
            <FilterSelect
              label="Bulan"
              value={filters.bulan}
              options={bulanOptions}
              onChange={(v) => set("bulan", v)}
            />
          </div>

          <div className="border-t border-amber-500/20 p-4">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2.5 text-xs font-medium text-slate-200 transition hover:border-amber-500/40 hover:text-amber-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filter
              {activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
