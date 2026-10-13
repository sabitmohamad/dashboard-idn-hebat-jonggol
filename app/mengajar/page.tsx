import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, School } from "lucide-react";
import { IdnMengajarDashboard } from "@/components/mengajar/IdnMengajarDashboard";
import { getTheme, themeCssVars } from "@/lib/themes";
import {
  MOCK_MENGAJAR_PAYLOAD,
  type MengajarPayload,
} from "@/src/data/mockMengajar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IDN Mengajar",
};

// googleapis fails inside page renders ("ArrayBuffer is not detachable"),
// so Sheets access stays in the /api/mengajar route handler.
async function loadMengajar(): Promise<MengajarPayload> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const res = await fetch(`${proto}://${host}/api/mengajar`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as MengajarPayload;
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown error";
    return {
      ...MOCK_MENGAJAR_PAYLOAD,
      message: `Gagal memuat data IDN Mengajar (${reason}). Menampilkan data contoh.`,
    };
  }
}

export default async function MengajarPage() {
  const data = await loadMengajar();

  return (
    <div
      className="dashboard-bg min-h-screen bg-slate-950 pb-10 text-white"
      data-theme="mengajar"
      style={themeCssVars(getTheme("mengajar"))}
    >
      <header className="glass-card sticky top-0 z-40 rounded-none border-x-0 border-t-0 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/40 bg-gradient-to-br from-blue-500/35 to-cyan-500/15 text-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.45)]">
              <School className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan-400/90 sm:text-xs">
                DASHBOARD PRESTASI SISWA SMP IDN JONGGOL
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                IDN Mengajar
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
        <IdnMengajarDashboard data={data} />
      </main>
    </div>
  );
}
