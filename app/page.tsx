"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Header } from "@/components/Header";
import { IdnMengajarView } from "@/components/IdnMengajarView";
import { IdnLombaView } from "@/components/lomba/IdnLombaView";
import { ProgramView } from "@/components/ProgramView";
import { SummaryView } from "@/components/SummaryView";
import {
  FALLBACK_MENGAJAR_DATA,
  mapSheetsToMengajar,
} from "@/lib/map-sheets";
import {
  getProgramMock,
  MOCK_SUMMARY,
  SHEET_TAB_CANDIDATES,
} from "@/lib/mock-data";
import { NAV_ITEMS } from "@/lib/nav";
import { getTheme, themeCssVars } from "@/lib/themes";
import type { LombaItem } from "@/src/data/mockLomba";
import { MOCK_LOMBA_DATA } from "@/src/data/mockLomba";
import type { MengajarDashboardData, MenuId, SheetRow } from "@/lib/types";

type ProgramMenuId = Exclude<MenuId, "summary" | "mengajar" | "lomba">;

const TV_SLIDE_MS = 10_000;
const TV_SLIDE_SECONDS = TV_SLIDE_MS / 1000;

async function fetchSheetRows(
  tabCandidates: string[]
): Promise<{ rows: SheetRow[]; sheet: string | null } | null> {
  for (const tab of tabCandidates) {
    try {
      const res = await fetch(`/api/sheets?tab=${encodeURIComponent(tab)}`);
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 404) continue;
        throw new Error(json.error || json.message || "Gagal memuat data");
      }

      const rows = (json.data ?? []) as SheetRow[];
      if (rows.length > 0) {
        return { rows, sheet: (json.sheet as string) ?? tab };
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes("404")) {
        throw err;
      }
    }
  }
  return null;
}

function nextMenuId(current: MenuId): MenuId {
  const idx = NAV_ITEMS.findIndex((item) => item.id === current);
  const next = NAV_ITEMS[(idx + 1 + NAV_ITEMS.length) % NAV_ITEMS.length];
  return next.id;
}

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState<MenuId>("summary");
  const [loading, setLoading] = useState(true);
  const [mengajarData, setMengajarData] =
    useState<MengajarDashboardData>(FALLBACK_MENGAJAR_DATA);
  const [error, setError] = useState<string | null>(null);
  const [lombaData, setLombaData] = useState<LombaItem[]>(MOCK_LOMBA_DATA);
  const [lombaLoading, setLombaLoading] = useState(true);
  const [lombaError, setLombaError] = useState<string | null>(null);
  const [lombaConnected, setLombaConnected] = useState(false);
  const [lombaSheet, setLombaSheet] = useState<string | null>(null);
  const [tvMode, setTvMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMengajar() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchSheetRows(SHEET_TAB_CANDIDATES.mengajar);
        if (cancelled) return;

        if (!result) {
          setMengajarData({ ...FALLBACK_MENGAJAR_DATA, connected: false });
        } else {
          setMengajarData(mapSheetsToMengajar(result.rows));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan");
          setMengajarData({ ...FALLBACK_MENGAJAR_DATA, connected: false });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMengajar();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadLomba() {
      setLombaLoading(true);
      setLombaError(null);
      try {
        const res = await fetch("/api/lomba", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;

        const rows = (json.data ?? []) as LombaItem[];
        setLombaData(rows.length > 0 ? rows : MOCK_LOMBA_DATA);
        setLombaConnected(Boolean(json.connected));
        setLombaSheet((json.sheet as string | null) ?? null);

        if (!json.connected && json.message) {
          setLombaError(String(json.message));
        }
      } catch (err) {
        if (!cancelled) {
          setLombaError(
            err instanceof Error
              ? err.message
              : "Gagal memuat data IDN Lomba"
          );
          setLombaData(MOCK_LOMBA_DATA);
          setLombaConnected(false);
          setLombaSheet(null);
        }
      } finally {
        if (!cancelled) setLombaLoading(false);
      }
    }

    loadLomba();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    syncFullscreen();
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  // TV auto-play carousel: 10s per tab, with progress 0→1
  useEffect(() => {
    if (!tvMode) {
      setSlideProgress(0);
      return;
    }

    let start = performance.now();
    let raf = 0;
    let advanced = false;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / TV_SLIDE_MS, 1);
      setSlideProgress(progress);

      if (progress >= 1 && !advanced) {
        advanced = true;
        setActiveMenu((current) => nextMenuId(current));
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tvMode, activeMenu]);

  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Browser may block without gesture or unsupported on some TVs
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void exitFullscreen();
    } else {
      void enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  const toggleTvMode = useCallback(() => {
    setTvMode((prev) => {
      const next = !prev;
      if (next) {
        void enterFullscreen();
      }
      return next;
    });
    setSlideProgress(0);
  }, [enterFullscreen]);

  const handleManualNav = useCallback((id: MenuId) => {
    setTvMode(false);
    setSlideProgress(0);
    setActiveMenu(id);
  }, []);

  const theme = getTheme(activeMenu);
  const showLiveBadge =
    (activeMenu === "mengajar" && mengajarData.connected && !error) ||
    (activeMenu === "lomba" && lombaConnected && !lombaError);

  const isProgramMenu =
    activeMenu !== "summary" &&
    activeMenu !== "mengajar" &&
    activeMenu !== "lomba";

  return (
    <div
      className="dashboard-bg min-h-screen pb-8 text-white"
      data-theme={activeMenu}
      style={themeCssVars(theme)}
    >
      <Header
        connected={showLiveBadge}
        activeMenu={activeMenu}
        tvMode={tvMode}
        isFullscreen={isFullscreen}
        slideProgress={slideProgress}
        slideSeconds={TV_SLIDE_SECONDS}
        onToggleTvMode={toggleTvMode}
        onToggleFullscreen={toggleFullscreen}
      />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {error && activeMenu === "mengajar" && !tvMode && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Tidak dapat terhubung ke Google Sheets ({error}). Menampilkan data
            cadangan roster IDN.
          </div>
        )}

        {isProgramMenu && !tvMode && (
          <div
            className="mb-4 rounded-xl border px-4 py-2.5 text-xs sm:text-sm"
            style={{
              borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
              backgroundColor: `rgba(${theme.primaryRgb}, 0.1)`,
              color: "var(--theme-secondary)",
            }}
          >
            Menampilkan roster siswa IDN untuk{" "}
            <span className="font-semibold text-white">{theme.label}</span>
            {" "}(tab Sheets masih agregat / belum berisi nama siswa).
          </div>
        )}

        {(loading && activeMenu === "mengajar") ||
        (lombaLoading && activeMenu === "lomba") ? (
          <DashboardSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, x: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -22, filter: "blur(6px)" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeMenu === "summary" ? (
                <SummaryView data={MOCK_SUMMARY} />
              ) : activeMenu === "mengajar" ? (
                <IdnMengajarView data={mengajarData} />
              ) : activeMenu === "lomba" ? (
                <IdnLombaView
                  data={lombaData}
                  connected={lombaConnected}
                  sheet={lombaSheet}
                  isLoading={false}
                  error={lombaError}
                />
              ) : (
                <ProgramView
                  data={getProgramMock(activeMenu as ProgramMenuId)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <BottomNav active={activeMenu} onChange={handleManualNav} />
    </div>
  );
}
