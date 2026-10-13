"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Header } from "@/components/Header";
import { IdnLombaView } from "@/components/lomba/IdnLombaView";
import { IdnMengajarDashboard } from "@/components/mengajar/IdnMengajarDashboard";
import { IdnMenulisDashboard } from "@/components/menulis/IdnMenulisDashboard";
import { IdnSeminarDashboard } from "@/components/seminar/IdnSeminarDashboard";
import { IdnTabunganDashboard } from "@/components/tabungan/IdnTabunganDashboard";
import { IdnTalkingDashboard } from "@/components/talking/IdnTalkingDashboard";
import { SummaryView } from "@/components/SummaryView";
import {
  buildMengajarLeaderboard,
  computeMengajarStats,
} from "@/lib/mengajar";
import {
  bestAchievementFor,
  buildLeaderboard,
  computeLombaStats,
  getSpotlightStudent,
  groupLombaByStatus,
} from "@/lib/lomba";
import { computeMenulisStats, formatNum, formatPct } from "@/lib/menulis";
import { computeSeminarStats, formatPct as formatSeminarPct } from "@/lib/seminar";
import { MOCK_SUMMARY } from "@/lib/mock-data";
import { NAV_ITEMS } from "@/lib/nav";
import { getTheme, themeCssVars } from "@/lib/themes";
import type { LombaItem } from "@/src/data/mockLomba";
import { MOCK_LOMBA_DATA } from "@/src/data/mockLomba";
import {
  MOCK_MENGAJAR_PAYLOAD,
  type MengajarPayload,
} from "@/src/data/mockMengajar";
import {
  MOCK_MENULIS_PAYLOAD,
  type MenulisPayload,
} from "@/src/data/mockMenulis";
import {
  MOCK_TALKING_PAYLOAD,
  type TalkingPayload,
} from "@/src/data/mockTalking";
import {
  MOCK_SEMINAR_PAYLOAD,
  type SeminarPayload,
} from "@/src/data/mockSeminar";
import {
  EMPTY_TABUNGAN_PAYLOAD,
  type TabunganPayload,
} from "@/src/data/tabungan";
import type {
  MenuId,
  SummaryDashboardData,
  SummaryTopPerformer,
} from "@/lib/types";

const TV_SLIDE_MS = 10_000;
const TV_SLIDE_SECONDS = TV_SLIDE_MS / 1000;

function nextMenuId(current: MenuId): MenuId {
  const idx = NAV_ITEMS.findIndex((item) => item.id === current);
  const next = NAV_ITEMS[(idx + 1 + NAV_ITEMS.length) % NAV_ITEMS.length];
  return next.id;
}

function withMengajarSummary(
  base: SummaryDashboardData,
  mengajar: MengajarPayload
): SummaryDashboardData {
  const stats = computeMengajarStats(mengajar.rekap, mengajar.log);
  const top = buildMengajarLeaderboard(mengajar.rekap)[0];

  return {
    ...base,
    stats: base.stats.map((stat) =>
      stat.program === "mengajar"
        ? {
            ...stat,
            label: "Total Sesi Mengajar",
            value: stats.totalSesi,
            description: `${stats.totalSekolah} sekolah mitra · ${stats.totalPeserta.toLocaleString("id-ID")} peserta didik luar`,
          }
        : stat
    ),
    highlights: base.highlights.map((item) =>
      item.program === "IDN Mengajar" && top
        ? {
            ...item,
            title: `${top.nama.split(" ")[0]} · Top Pengajar`,
            value: String(top.totalMengajar),
          }
        : item
    ),
  };
}

function withMenulisSummary(
  base: SummaryDashboardData,
  menulis: MenulisPayload
): SummaryDashboardData {
  const stats = computeMenulisStats(menulis);
  const top = stats.topMenulis;

  return {
    ...base,
    stats: base.stats.map((stat) =>
      stat.program === "menulis"
        ? {
            ...stat,
            label: "Total Halaman Menulis",
            value: stats.totalPencapaianMenulis,
            description: `${formatPct(stats.persenMenulis)} dari target ${formatNum(stats.totalTargetMenulis)} hlm · ${formatNum(stats.totalPencapaianSertifikat)} sertifikat`,
          }
        : stat
    ),
    highlights: base.highlights.map((item) =>
      item.program === "IDN Menulis" && top
        ? {
            ...item,
            title: `Kelas ${top.kelas} · Top Menulis`,
            value: formatNum(top.pencapaian),
          }
        : item
    ),
  };
}

function withSeminarSummary(
  base: SummaryDashboardData,
  seminar: SeminarPayload
): SummaryDashboardData {
  const stats = computeSeminarStats(seminar.data);

  return {
    ...base,
    stats: base.stats.map((stat) =>
      stat.program === "seminar"
        ? {
            ...stat,
            label: "Rata-rata Ketercapaian Seminar",
            value: formatSeminarPct(stats.rataRata),
            description: `${stats.pekanSelesai} pekan selesai 100% · ${stats.totalPekan} pekan`,
          }
        : stat
    ),
  };
}

function withLombaSummary(
  base: SummaryDashboardData,
  lomba: LombaItem[]
): SummaryDashboardData {
  const stats = computeLombaStats(lomba);
  const groups = groupLombaByStatus(lomba);
  const leaderboard = buildLeaderboard(lomba);
  const top = getSpotlightStudent(leaderboard);

  const lombaPerformers: SummaryTopPerformer[] = leaderboard
    .slice(0, 3)
    .map((student) => {
      const best = bestAchievementFor(lomba, student.id);
      const highlight = best
        ? `Juara ${best.peringkat} · ${best.nama_lomba} (${best.tingkat_lomba}) · ${student.points} poin`
        : `${student.totalJuara} perolehan juara · ${student.points} poin`;
      return {
        id: `lomba-${student.id}`,
        name: student.name,
        className: student.className,
        categories: ["Lomba"],
        highlight,
      };
    });

  const baseOthers = (base.topPerformers ?? []).filter(
    (p) => !lombaPerformers.some((l) => l.name === p.name)
  );
  const merged = lombaPerformers.map((l) => {
    const other = base.topPerformers?.find((p) => p.name === l.name);
    if (!other) return l;
    return {
      ...l,
      categories: ["Lomba", ...other.categories.filter((c) => c !== "Lomba")],
      highlight: `${l.highlight} · ${other.highlight}`,
    };
  });

  return {
    ...base,
    stats: base.stats.map((stat) =>
      stat.program === "lomba"
        ? {
            ...stat,
            label: "Total Prestasi Lomba",
            value: stats.totalKejuaraan,
            description: `${groups.Pendaftaran.length} pendaftaran · ${groups.Pelaksanaan.length} pelaksanaan · ${groups.Selesai.length} selesai${top ? ` — dipimpin ${top.name}` : ""}`,
          }
        : stat
    ),
    highlights: base.highlights.map((item) =>
      item.program === "IDN Lomba"
        ? top
          ? {
              ...item,
              title: `${top.name.split(" ")[0]} · Top Juara`,
              value: String(top.totalJuara),
            }
          : { ...item, title: "Belum ada juara", value: "0" }
        : item
    ),
    topPerformers: [...merged, ...baseOthers],
  };
}

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState<MenuId>("summary");
  const [loading, setLoading] = useState(true);
  const [mengajarData, setMengajarData] =
    useState<MengajarPayload>(MOCK_MENGAJAR_PAYLOAD);
  const [lombaData, setLombaData] = useState<LombaItem[]>(MOCK_LOMBA_DATA);
  const [lombaLoading, setLombaLoading] = useState(true);
  const [lombaError, setLombaError] = useState<string | null>(null);
  const [lombaConnected, setLombaConnected] = useState(false);
  const [lombaSheet, setLombaSheet] = useState<string | null>(null);
  const [talkingData, setTalkingData] =
    useState<TalkingPayload>(MOCK_TALKING_PAYLOAD);
  const [talkingLoading, setTalkingLoading] = useState(true);
  const [menulisData, setMenulisData] =
    useState<MenulisPayload>(MOCK_MENULIS_PAYLOAD);
  const [menulisLoading, setMenulisLoading] = useState(true);
  const [tabunganData, setTabunganData] =
    useState<TabunganPayload>(EMPTY_TABUNGAN_PAYLOAD);
  const [tabunganLoading, setTabunganLoading] = useState(true);
  const [seminarData, setSeminarData] =
    useState<SeminarPayload>(MOCK_SEMINAR_PAYLOAD);
  const [seminarLoading, setSeminarLoading] = useState(true);
  const [tvMode, setTvMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMengajar() {
      setLoading(true);
      try {
        const res = await fetch("/api/mengajar", { cache: "no-store" });
        const json = (await res.json()) as MengajarPayload;
        if (cancelled) return;
        setMengajarData(json);
      } catch (err) {
        if (!cancelled) {
          setMengajarData({
            ...MOCK_MENGAJAR_PAYLOAD,
            message:
              err instanceof Error
                ? `Gagal memuat data IDN Mengajar (${err.message}).`
                : "Gagal memuat data IDN Mengajar. Menampilkan data contoh.",
          });
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
    let cancelled = false;

    async function loadTalking() {
      setTalkingLoading(true);
      try {
        const res = await fetch("/api/talking", { cache: "no-store" });
        const json = (await res.json()) as TalkingPayload;
        if (cancelled) return;
        setTalkingData(json);
      } catch (err) {
        if (!cancelled) {
          setTalkingData({
            ...MOCK_TALKING_PAYLOAD,
            message:
              err instanceof Error
                ? `Gagal memuat data IDN Talking (${err.message}).`
                : "Gagal memuat data IDN Talking. Menampilkan data contoh.",
          });
        }
      } finally {
        if (!cancelled) setTalkingLoading(false);
      }
    }

    loadTalking();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMenulis(initial = false) {
      if (initial) setMenulisLoading(true);
      try {
        const res = await fetch("/api/menulis", { cache: "no-store" });
        const json = (await res.json()) as MenulisPayload;
        if (cancelled) return;
        setMenulisData(json);
      } catch (err) {
        if (!cancelled && initial) {
          setMenulisData({
            ...MOCK_MENULIS_PAYLOAD,
            message:
              err instanceof Error
                ? `Gagal memuat data IDN Menulis (${err.message}).`
                : "Gagal memuat data IDN Menulis. Menampilkan data contoh.",
          });
        }
      } finally {
        if (!cancelled && initial) setMenulisLoading(false);
      }
    }

    void loadMenulis(true);
    const refreshId = setInterval(() => {
      void loadMenulis(false);
    }, 20_000);
    return () => {
      cancelled = true;
      clearInterval(refreshId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadTabungan() {
      setTabunganLoading(true);
      try {
        const res = await fetch("/api/tabungan", { cache: "no-store" });
        const json = (await res.json()) as TabunganPayload;
        if (cancelled) return;
        setTabunganData(json);
      } catch (err) {
        if (!cancelled) {
          setTabunganData({
            ...EMPTY_TABUNGAN_PAYLOAD,
            message:
              err instanceof Error
                ? `Gagal memuat data Tabungan Siswa (${err.message}).`
                : "Gagal memuat data Tabungan Siswa.",
          });
        }
      } finally {
        if (!cancelled) setTabunganLoading(false);
      }
    }

    loadTabungan();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSeminar() {
      setSeminarLoading(true);
      try {
        const res = await fetch("/api/seminar", { cache: "no-store" });
        const json = (await res.json()) as SeminarPayload;
        if (cancelled) return;
        setSeminarData(json);
      } catch (err) {
        if (!cancelled) {
          setSeminarData({
            ...MOCK_SEMINAR_PAYLOAD,
            message:
              err instanceof Error
                ? `Gagal memuat data IDN Seminar (${err.message}).`
                : "Gagal memuat data IDN Seminar. Menampilkan data contoh.",
          });
        }
      } finally {
        if (!cancelled) setSeminarLoading(false);
      }
    }

    loadSeminar();
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
    if (!tvMode) return;

    const start = performance.now();
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

  const summaryData = useMemo(
    () =>
      withLombaSummary(
        withSeminarSummary(
          withMenulisSummary(
            withMengajarSummary(MOCK_SUMMARY, mengajarData),
            menulisData
          ),
          seminarData
        ),
        lombaData
      ),
    [mengajarData, menulisData, seminarData, lombaData]
  );

  const theme = getTheme(activeMenu);
  const showLiveBadge =
    activeMenu === "summary"
      ? mengajarData.connected ||
        (lombaConnected && !lombaError) ||
        talkingData.connected ||
        menulisData.connected ||
        tabunganData.connected ||
        seminarData.connected
      : (activeMenu === "mengajar" && mengajarData.connected) ||
        (activeMenu === "lomba" && lombaConnected && !lombaError) ||
        (activeMenu === "talking" && talkingData.connected) ||
        (activeMenu === "menulis" && menulisData.connected) ||
        (activeMenu === "tabungan" && tabunganData.connected) ||
        (activeMenu === "seminar" && seminarData.connected);

  const syncing =
    !showLiveBadge &&
    ((activeMenu === "summary" &&
      (loading ||
        lombaLoading ||
        talkingLoading ||
        menulisLoading ||
        tabunganLoading ||
        seminarLoading)) ||
      (activeMenu === "mengajar" && loading) ||
      (activeMenu === "lomba" && lombaLoading) ||
      (activeMenu === "talking" && talkingLoading) ||
      (activeMenu === "menulis" && menulisLoading) ||
      (activeMenu === "tabungan" && tabunganLoading) ||
      (activeMenu === "seminar" && seminarLoading));

  return (
    <div
      className="dashboard-bg min-h-screen pb-8 text-white"
      data-theme={activeMenu}
      style={themeCssVars(theme)}
    >
      <Header
        connected={showLiveBadge}
        syncing={syncing}
        activeMenu={activeMenu}
        tvMode={tvMode}
        isFullscreen={isFullscreen}
        slideProgress={slideProgress}
        slideSeconds={TV_SLIDE_SECONDS}
        onToggleTvMode={toggleTvMode}
        onToggleFullscreen={toggleFullscreen}
      />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {(loading && activeMenu === "mengajar") ||
        (lombaLoading && activeMenu === "lomba") ||
        (talkingLoading && activeMenu === "talking") ||
        (menulisLoading && activeMenu === "menulis") ||
        (tabunganLoading && activeMenu === "tabungan") ||
        (seminarLoading && activeMenu === "seminar") ? (
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
                <SummaryView data={summaryData} />
              ) : activeMenu === "mengajar" ? (
                <IdnMengajarDashboard data={mengajarData} />
              ) : activeMenu === "lomba" ? (
                <IdnLombaView
                  data={lombaData}
                  connected={lombaConnected}
                  sheet={lombaSheet}
                  isLoading={false}
                  error={lombaError}
                />
              ) : activeMenu === "talking" ? (
                <IdnTalkingDashboard data={talkingData} />
              ) : activeMenu === "menulis" ? (
                <IdnMenulisDashboard data={menulisData} />
              ) : activeMenu === "tabungan" ? (
                <IdnTabunganDashboard data={tabunganData} />
              ) : activeMenu === "seminar" ? (
                <IdnSeminarDashboard data={seminarData} />
              ) : null}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <BottomNav active={activeMenu} onChange={handleManualNav} />
    </div>
  );
}
