import type { KelasProgress, MenulisTab, ProgressTone } from "@/lib/menulis";
import { formatNum, formatPct, progressTone } from "@/lib/menulis";
import {
  AnimatedBar,
  CountUp,
  Reveal,
  staggerDelay,
} from "@/components/Animate";
import { GlassCard } from "@/components/GlassCard";

interface MenulisClassGridProps {
  rows: KelasProgress[];
  view: MenulisTab;
}

const TONE_BAR: Record<ProgressTone, string> = {
  green: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
  yellow: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]",
  red: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]",
};

const TONE_TEXT: Record<ProgressTone, string> = {
  green: "text-emerald-300",
  yellow: "text-amber-300",
  red: "text-rose-300",
};

function ProgressBlock({
  label,
  pencapaian,
  target,
  unit,
  persen,
  kekurangan,
  kekuranganLabel,
  delay = 0,
}: {
  label: string;
  pencapaian: number;
  target: number;
  unit: string;
  persen: number;
  kekurangan: number;
  kekuranganLabel: string;
  delay?: number;
}) {
  const tone = progressTone(persen);
  const tercapai = kekurangan <= 0 && target > 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          {label}
        </p>
        <p className={`text-sm font-bold tabular-nums ${TONE_TEXT[tone]}`}>
          <CountUp value={formatPct(persen)} duration={0.9} delay={delay} />
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-200 tabular-nums">
        <span className="font-semibold text-white">
          <CountUp value={formatNum(pencapaian)} duration={0.9} delay={delay} />
        </span>
        <span className="text-slate-500"> / {formatNum(target)} {unit}</span>
      </p>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
        <AnimatedBar
          percent={persen}
          delay={delay}
          className={`h-full rounded-full ${TONE_BAR[tone]}`}
        />
      </div>
      <div className="mt-2">
        {tercapai ? (
          <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
            Target tercapai
          </span>
        ) : (
          <span className="inline-flex rounded-full border border-rose-400/35 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
            Kekurangan {formatNum(Math.max(kekurangan, 0))} {kekuranganLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export function MenulisClassGrid({ rows, view }: MenulisClassGridProps) {
  const showMenulis = view === "all" || view === "menulis";
  const showSertifikat = view === "all" || view === "sertifikasi";

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Progress Kelas
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Ketercapaian dihitung dari pencapaian dibagi target.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-emerald-200">
            Hijau &gt; 75%
          </span>
          <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-amber-200">
            Kuning 50–75%
          </span>
          <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-1 text-rose-200">
            Merah &lt; 50%
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <GlassCard className="!p-6">
          <p className="text-center text-sm text-slate-400">
            Belum ada rekap kelas untuk tampilan ini.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {rows.map((row, index) => {
            const delay = staggerDelay(index, 0.06, 0.15);
            return (
              <Reveal key={row.kelas} delay={delay}>
                <GlassCard hover className="h-full !p-4">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-emerald-300/80 uppercase">
                    Kelas
                  </p>
                  <p className="mt-0.5 text-2xl font-bold tracking-tight text-white">
                    {row.kelas}
                  </p>
                  <div className={showMenulis && showSertifikat ? "mt-4 space-y-4" : "mt-4"}>
                    {showMenulis ? (
                      <ProgressBlock
                        label="Program Menulis"
                        pencapaian={row.pencapaianMenulis}
                        target={row.targetMenulis}
                        unit="hlm"
                        persen={row.persenMenulis}
                        kekurangan={row.kekuranganHalaman}
                        kekuranganLabel="hlm"
                        delay={delay + 0.2}
                      />
                    ) : null}
                    {showSertifikat ? (
                      <ProgressBlock
                        label="Program Sertifikasi"
                        pencapaian={row.pencapaianSertifikat}
                        target={row.targetSertifikat}
                        unit="sertifikat"
                        persen={row.persenSertifikat}
                        kekurangan={row.kekuranganSertifikat}
                        kekuranganLabel="sertifikat"
                        delay={delay + 0.3}
                      />
                    ) : null}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
