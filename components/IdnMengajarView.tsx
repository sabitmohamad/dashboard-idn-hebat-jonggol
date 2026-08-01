import type { MengajarDashboardData } from "@/lib/types";
import { KpiBar } from "./KpiBar";
import { LeaderboardCard } from "./LeaderboardCard";
import { SekolahMitraCard } from "./SekolahMitraCard";
import { SpotlightCard } from "./SpotlightCard";
import { StatusChart } from "./StatusChart";

interface IdnMengajarViewProps {
  data: MengajarDashboardData;
}

export function IdnMengajarView({ data }: IdnMengajarViewProps) {
  return (
    <div className="space-y-4">
      <KpiBar metrics={data.kpis} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <SpotlightCard
            student={{
              ...data.spotlight,
              metricTitle: data.spotlight.metricTitle || "Major Flight Hours",
              metricUnit: data.spotlight.metricUnit || "hari",
            }}
          />
        </div>

        <div className="xl:col-span-5">
          <LeaderboardCard
            items={data.leaderboard}
            title="Top 10 Terbanyak"
            metricUnit="hari"
          />
        </div>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <StatusChart data={data.statusProgram} title="Status Program" />
          <SekolahMitraCard schools={data.partnerSchools} />
        </div>
      </div>
    </div>
  );
}
