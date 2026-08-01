import type { ProgramDashboardData } from "@/lib/types";
import { KpiBar } from "./KpiBar";
import { LeaderboardCard } from "./LeaderboardCard";
import { SidePanelCard } from "./SidePanelCard";
import { SpotlightCard } from "./SpotlightCard";
import { StatusChart } from "./StatusChart";

interface ProgramViewProps {
  data: ProgramDashboardData;
}

export function ProgramView({ data }: ProgramViewProps) {
  return (
    <div className="space-y-4">
      <KpiBar metrics={data.kpis} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <SpotlightCard student={data.spotlight} />
        </div>

        <div className="xl:col-span-5">
          <LeaderboardCard
            items={data.leaderboard}
            title={data.leaderboardTitle}
            metricUnit={data.metricUnit}
          />
        </div>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <StatusChart data={data.chart} title={data.chartTitle} />
          {data.sidePanel ? (
            <SidePanelCard
              title={data.sidePanel.title}
              items={data.sidePanel.items}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
