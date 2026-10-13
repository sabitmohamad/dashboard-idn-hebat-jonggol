import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";
import { IdnTabunganDashboard } from "@/components/tabungan/IdnTabunganDashboard";
import { getTheme, themeCssVars } from "@/lib/themes";
import {
  EMPTY_TABUNGAN_PAYLOAD,
  type TabunganPayload,
} from "@/src/data/tabungan";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tabungan Siswa",
};

// googleapis fails inside page renders ("ArrayBuffer is not detachable"),
// so Sheets access stays in the /api/tabungan route handler.
async function loadTabungan(): Promise<TabunganPayload> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const res = await fetch(`${proto}://${host}/api/tabungan`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as TabunganPayload;
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown error";
    return {
      ...EMPTY_TABUNGAN_PAYLOAD,
      message: `Gagal memuat data Tabungan Siswa (${reason}).`,
    };
  }
}

export default async function TabunganPage() {
  const data = await loadTabungan();

  return (
    <div
      className="dashboard-bg min-h-screen bg-slate-950 pb-10 text-white"
      data-theme="tabungan"
      style={themeCssVars(getTheme("tabungan"))}
    >
      <header className="glass-card sticky top-0 z-40 rounded-none border-x-0 border-t-0 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/40 bg-gradient-to-br from-yellow-500/35 to-lime-400/15 text-yellow-300 shadow-[0_0_18px_rgba(234,179,8,0.45)]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-yellow-400/90 sm:text-xs">
                DASHBOARD PRESTASI SISWA SMP IDN JONGGOL
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Tabungan Siswa
              </h1>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-white/25 hover:bg-white/5 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <IdnTabunganDashboard data={data} />
      </main>
    </div>
  );
}
