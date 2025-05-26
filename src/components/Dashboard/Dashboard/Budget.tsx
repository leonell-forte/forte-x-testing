import { useQuery } from "@tanstack/react-query";
import dashboardService from "api/dashboard";
import { get } from "lodash";
import { useMemo } from "react";

import { ReactComponent as DollarSuitcase } from "assets/images/icons/dollar-suitcase.svg";

import { formatCurrency } from "lib/utils";

import Card from "components/Dashboard/Dashboard/Card";
import Legend from "components/ui/charts/Legend";
import SegmentedProgressBar from "components/ui/charts/SegmentedProgressBar";

import DataText from "./DataText";
import TileHeader from "./TileHeader";
import { COLOR_PALETTE } from "./constant";
import { SegmentType } from "./types";
import { useDashboardState } from "./useDashboardState";

export default function Budget() {
  const { project } = useDashboardState();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-budget", project?.value],
    queryFn: async () => dashboardService.getBudget(project?.value || ""),
  });

  const segments = useMemo(() => {
    const raw = project?.value ? data?.contracts : data?.projects;
    return (
      raw?.map((item, index) => ({
        value: Number(get(item, project?.value ? "spent" : "budget")),
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        label: item.name,
      })) || []
    );
  }, [data, project?.value]) satisfies SegmentType[];

  const ticks = [
    {
      label: "Total spent",
      value: formatCurrency(data?.totalSpent ? Number(data?.totalSpent) : 0),
    },
    {
      label: "Total budget",
      value: formatCurrency(data?.totalBudget || 0),
    },
  ];

  const title = `${project ? project.label : "Overall"} budget`;

  return (
    <Card isLoading={isLoading}>
      <TileHeader
        title={title}
        icon={
          <DollarSuitcase
            fill="white"
            width="24"
            height="24"
            className="print-visible-icon"
          />
        }
      />

      <div className="budget-content mt-10 space-y-6">
        <div className="budget-remaining">
          <DataText
            size="sm"
            label="Budget Remaining"
            value={formatCurrency(data?.remainingBudget || 0)}
          />
        </div>

        <SegmentedProgressBar
          segments={segments}
          ticks={ticks}
          total={data?.totalBudget || 0}
          nonSegmented={
            segments.filter((segment) => segment.value > 0).length === 1
          }
        />
        <div className="budget-legend px-[45px] pb-[12px] lg:pb-[32px]">
          <Legend segments={segments} max={6} />
        </div>
      </div>
    </Card>
  );
}
