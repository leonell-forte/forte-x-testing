import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import dashboardService from "@/api/dashboard";
import { formatCurrency } from "@/lib/utils";

import MilestoneTile from "./MilestoneTile";
import { COLOR_PALETTE } from "./constant";
import {
  type MilestoneSegmentType,
  type SegmentType,
  milestoneLabelMap,
} from "./types";

const Milestones = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-milestones"],
    queryFn: () => dashboardService.getMilestones(),
  });

  const outcome = data?.outcome;

  const outcomeTicks = [
    {
      label: "Achieved",
      value: outcome?.noOfAcheivedMilestones || 0,
    },
    {
      label: "Open",
      value: outcome?.noOfInvoicedMilestones || 0,
    },
  ];

  const outcomeSegment = useMemo(() => {
    const data = { ...outcome };

    delete data.outcomeRate;
    delete data.deltaOutcomeRate;
    delete data.paymentsPending;
    delete data.deltaPaymentsPending;
    delete data.totalMilestones;

    return Object.entries(data).map(([key, value], index) => ({
      label: milestoneLabelMap[key as keyof MilestoneSegmentType],
      value,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    })) as SegmentType[];
  }, [outcome]);

  const threshold = data?.threshold;

  const thresholdTicks = [
    {
      label: "Achieved",
      value: threshold?.noOfAcheivedMilestones || 0,
    },
    {
      label: "Open",
      value: threshold?.noOfInvoicedMilestones || 0,
    },
  ];

  const thresholdSegment = useMemo(() => {
    const data = { ...threshold };

    delete data.outcomeRate;
    delete data.deltaOutcomeRate;
    delete data.paymentsPending;
    delete data.deltaPaymentsPending;
    delete data.totalMilestones;

    return Object.entries(data).map(([key, value], index) => ({
      label: milestoneLabelMap[key as keyof MilestoneSegmentType],
      value,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    })) as SegmentType[];
  }, [threshold]);

  return (
    <>
      <MilestoneTile
        title="Per outcome milestones"
        tooltip="Milestones tied to achieving outcomes per beneficiary"
        outcomeRates={{
          label: "OUTCOMES RATE (PERCENT)",
          value: (outcome?.outcomeRate || 0).toFixed(2) + "%",
          percentage: Number((outcome?.deltaOutcomeRate || 0).toFixed(2)),
          tooltip: "Percentage of Open milestones / Total number of milestones",
        }}
        paymentsPending={{
          label: "PAYMENTS PENDING",
          value: formatCurrency(outcome?.paymentsPending || 0),
          percentage: Number((outcome?.deltaPaymentsPending || 0).toFixed(2)),
          tooltip: "$ value of milestones achieved or invoiced but not paid",
        }}
        segments={outcomeSegment}
        ticks={outcomeTicks}
        total={outcome?.totalMilestones || 0}
        loading={isLoading}
      />
      <MilestoneTile
        title="Threshold milestones"
        tooltip="Milestone tied to achieving outcomes per % of total beneficiaries"
        outcomeRates={{
          label: "OUTCOMES RATE (PERCENT)",
          value: (threshold?.outcomeRate || 0).toFixed(2) + "%",
          percentage: Number((threshold?.deltaOutcomeRate || 0).toFixed(2)),
          tooltip: "Percentage of Open milestones / Total number of milestones",
        }}
        paymentsPending={{
          label: "PAYMENTS PENDING",
          value: formatCurrency(threshold?.paymentsPending || 0),
          percentage: Number((threshold?.deltaPaymentsPending || 0).toFixed(2)),
          tooltip: "$ value of milestones achieved or invoiced but not paid",
        }}
        segments={thresholdSegment}
        ticks={thresholdTicks}
        total={threshold?.totalMilestones || 0}
        loading={isLoading}
      />
    </>
  );
};

export default Milestones;
