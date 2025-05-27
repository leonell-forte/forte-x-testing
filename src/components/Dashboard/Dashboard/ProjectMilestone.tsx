import { useQuery } from "@tanstack/react-query";
import dashboardService from "api/dashboard";

import Legend from "components/ui/charts/Legend";
import PieChart from "components/ui/charts/PieChart";

import DataText from "./DataText";
import TileHeader from "./TileHeader";
import { COLOR_PALETTE } from "./constant";
import { useDashboardState } from "./useDashboardState";

const ProjectMilestone = () => {
  const { project } = useDashboardState();
  const { data } = useQuery({
    queryKey: ["dashboard-project-milestone", project?.value],
    queryFn: () => dashboardService.getProjectMilestone(project?.value),
    enabled: !!project,
  });

  const segments = [
    {
      value: data?.noOfAcheivedMilestones || 0,
      color: COLOR_PALETTE[0],
      label: "Achieved",
    },
    {
      value: data?.noOfInvoicedMilestones || 0,
      color: COLOR_PALETTE[1],
      label: "Invoiced",
    },
    {
      value: data?.noOfPaidMilestones || 0,
      color: COLOR_PALETTE[2],
      label: "Paid",
    },
  ];

  return (
    <div className="space-y-3">
      <TileHeader title="Milestones" />
      <div className="space-y-6">
        <div className="pb-1 pt-3">
          <DataText
            label="# OF MILESTONES"
            value={data?.totalMilestones || 0}
            size="sm"
            percentage={Number((data?.deltaMilestones || 0).toFixed(2))}
          />
        </div>
        <PieChart segments={segments} total={data?.totalMilestones} />
        <Legend segments={segments} />
      </div>
    </div>
  );
};

export default ProjectMilestone;
