import { useQuery } from "@tanstack/react-query";
import dashboardService from "api/dashboard";
import { formatDate } from "date-fns";
import { useMemo } from "react";

import Card from "components/Dashboard/Dashboard/Card";
import SegmentedProgressBar from "components/ui/charts/SegmentedProgressBar";

import { showContractMilestoneProgressModal } from "./ContractMilestoneProgressModal";
import TileHeader from "./TileHeader";
import { ContractProgress, SegmentType } from "./types";
import { useDashboardState } from "./useDashboardState";

const ContractMilestoneProgress = () => {
  const { project } = useDashboardState();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-contract-progress", project?.value],
    queryFn: () => dashboardService.getContractProgress(project?.value || ""),
    enabled: !!project,
  });

  const projects = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      segment: [
        {
          label: item.contractName,
          value: item.noOfCompletedMilestones,
          color: "#fff",
        },
      ],
      ...item,
    }));
  }, [data]);

  return (
    <Card variant="outline" isLoading={isLoading} className="space-y-10">
      <TileHeader
        title="Contracts milestone progress"
        tooltip="% of completion in achieving all milestones per contract"
      />

      <ContractMilestoneContent projects={projects.slice(0, 3)} />

      {projects.length > 3 && (
        <button
          onClick={() => showContractMilestoneProgressModal(projects)}
          className="text-mint underline transition hover:text-brand-700"
        >
          + {projects.length - 3} more
        </button>
      )}
    </Card>
  );
};

export default ContractMilestoneProgress;

export const ContractMilestoneContent = ({
  projects,
}: {
  projects: (ContractProgress & { segment: SegmentType[] })[];
}) => {
  return (
    <div className="mt-10 space-y-10">
      {projects.map((item: any, index: any) => {
        const ticks = [
          {
            label: `Start date : ${formatDate(item.startDate, "dd-LL-yyyy")}`,
          },
          {
            label: `End date : ${formatDate(item.endDate, "dd-LL-yyyy")}`,
          },
        ];
        return (
          <SegmentedProgressBar
            key={index}
            label={
              <p>
                {item.contractName}{" "}
                <span className="text-[10px]">({item.providerName})</span>
              </p>
            }
            segments={item.segment}
            total={item.noOfMilestones}
            progress={
              (item.noOfCompletedMilestones / item.noOfMilestones || 0) * 100 +
              "%"
            }
            ticks={ticks}
            nonSegmented
            noTooltip
          />
        );
      })}
    </div>
  );
};
