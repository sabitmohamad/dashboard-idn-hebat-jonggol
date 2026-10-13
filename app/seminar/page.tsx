import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Presentation } from "lucide-react";
import { IdnSeminarDashboard } from "@/components/seminar/IdnSeminarDashboard";
import { getTheme, themeCssVars } from "@/lib/themes";
import {
  MOCK_SEMINAR_PAYLOAD,
  type SeminarPayload,
} from "@/src/data/mockSeminar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IDN Seminar",
};

async function loadSeminar(): Promise<SeminarPayload> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const res = await fetch(`${proto}://${host}/api/seminar`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as SeminarPayload;
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown error";
    return {
      ...MOCK_SEMINAR_PAYLOAD,
      message: `Gagal memuat data IDN Seminar (${reason}). Menampilkan data contoh.`,
    };
  }
}

export default async function SeminarPage() {
  const data = await loadSeminar();

  return (
    <div
      className="dashboard-bg min-h-screen bg-slate-950 pb-10 text-white"
      data-theme="seminar"
      style={themeCssVars(getTheme("seminar"))}
    >
      <header className="glass-card sticky top-0 z-40 rounded-none border-x-0 border-t-0 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/40 bg-gradient-to-br from-sky-500/35 to-indigo-500/15 text-sky-300 shadow-[0_0_18px_rgba(14,165,233,0.45)]">
              <Presentation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-400/90 sm:text-xs">
                DASHBOARD PRESTASI SISWA SMP IDN JONGGOL
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                IDN Seminar
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
        <IdnSeminarDashboard data={data} />
      </main>
    </div>
  );
}
