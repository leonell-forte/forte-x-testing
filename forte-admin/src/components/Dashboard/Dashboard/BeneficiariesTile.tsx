import { useQuery } from "@tanstack/react-query";
import dashboardService from "api/dashboard";
import { useMemo } from "react";

import { formatCurrency } from "lib/utils";

import Card from "components/Dashboard/Dashboard/Card";
import Legend from "components/ui/charts/Legend";
import SegmentedProgressBar from "components/ui/charts/SegmentedProgressBar";

import DataText from "./DataText";
import TileHeader from "./TileHeader";
import { COLOR_PALETTE } from "./constant";
import { BeneficiaryStats, SegmentType, beneficiaryLabelMap } from "./types";
import { useDashboardState } from "./useDashboardState";

const BeneficiariesTile = () => {
  const { project } = useDashboardState();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-beneficiaries", project?.value],
    queryFn: async () =>
      dashboardService.getBeneficiaries(project?.value || ""),
  });

  const segments = useMemo(() => {
    if (!data) return [];

    let dataToMap = { ...data } as BeneficiaryStats;

    delete dataToMap.costPerBeneficiary;
    delete dataToMap.totalBeneficiaryCount;
    delete dataToMap.deltaBeneficiaryCount;

    return Object.entries(dataToMap).map(([key, value], index) => ({
      label:
        beneficiaryLabelMap[
          key as keyof Omit<
            BeneficiaryStats,
            | "totalBeneficiaryCount"
            | "deltaBeneficiaryCount"
            | "costPerBeneficiary"
          >
        ],
      value,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    })) satisfies SegmentType[];
  }, [data]);

  const ticks = useMemo(
    () => [
      {
        label: "Pending",
        value: data?.noOfPendingEvidenceCollectionBeneficiary || 0,
      },
      {
        label: "Successful",
        value: data?.noOfSuccessfulBeneficiary || 0,
      },
      {
        label: "Total beneficiaries",
        value: data?.totalBeneficiaryCount || 0,
      },
    ],
    [data]
  );

  return (
    <Card isLoading={isLoading} variant="outline" className="space-y-3">
      <TileHeader title="Beneficiaries" />

      <div className="data-text-component wrapper grid grid-cols-2 divide-x divide-panel/10">
        <div className="pb-1 pr-2 pt-3">
          <DataText
            size="sm"
            label="# OF BENEFICIARIES"
            value={data?.totalBeneficiaryCount || 0}
            percentage={data?.deltaBeneficiaryCount || 0}
          />
        </div>

        <div className="pb-1 pl-6 pr-2 pt-3">
          <DataText
            size="sm"
            label="COST PER BENEFICIARY"
            tooltip="The average cost of paid/ invoiced/ achieved milestones per beneficiary"
            value={formatCurrency(data?.costPerBeneficiary || 0)}
            percentage={0}
          />
        </div>
      </div>

      <SegmentedProgressBar
        segments={segments}
        ticks={ticks}
        total={data?.totalBeneficiaryCount || 0}
      />
      <Legend segments={segments} />
    </Card>
  );
};

export default BeneficiariesTile;
