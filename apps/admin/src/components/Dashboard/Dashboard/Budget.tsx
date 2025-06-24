import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";
import { useMemo } from "react";

import dashboardService from "@/api/dashboard";
import DollarSuitcase from "@/assets/images/icons/dollar-suitcase.svg?react";
import Card from "@/components/Dashboard/Dashboard/Card";
import DataText from "@/components/Dashboard/Dashboard/DataText";
import TileHeader from "@/components/Dashboard/Dashboard/TileHeader";
import { COLOR_PALETTE } from "@/components/Dashboard/Dashboard/constant";
import type { SegmentType } from "@/components/Dashboard/Dashboard/types";
import { useDashboardState } from "@/components/Dashboard/Dashboard/useDashboardState";
import Legend from "@/components/ui/charts/Legend";
import SegmentedProgressBar from "@/components/ui/charts/SegmentedProgressBar";
import { formatCurrency } from "@/lib/utils";

export default function Budget() {
  const { project } = useDashboardState();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-budget", project?.value],
    queryFn: async () => dashboardService.getBudget(project?.value || ""),
  });

  const segments = useMemo(() => {
    const raw = project?.value ? data?.contracts : data?.projects;
    return (
      raw?.map(
        (
          item: { name: string; budget: string; spent: string },
          index: number
        ) => ({
          value: Number(get(item, project?.value ? "spent" : "budget")),
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
          label: item.name,
        })
      ) || []
    );
  }, [data, project?.value]) as SegmentType[];

  const total = data?.totalBudget || 0;

  const ticks = [
    {
      label: "Total spent",
      value: formatCurrency(
        Number(data?.totalSpent) ? Number(data?.totalSpent) : 0
      ),
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
          total={total}
          nonSegmented={
            segments.filter((segment: { value: number }) => segment.value > 0)
              .length === 1
          }
        />
        <div className="budget-legend px-[45px] pb-[12px] lg:pb-[32px]">
          <Legend segments={segments} max={6} />
        </div>
      </div>
    </Card>
  );
}
