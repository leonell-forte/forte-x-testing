import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/api/dashboard";

import Legend from "@/components/ui/charts/Legend";
import PieChart from "@/components/ui/charts/PieChart";
import Spinner from "@/components/ui/spinner/spinner";

import DataText from "@/components/Dashboard/Dashboard/DataText";
import TileHeader from "@/components/Dashboard/Dashboard/TileHeader";
import { COLOR_PALETTE } from "@/components/Dashboard/Dashboard/constant";

const Contract = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-contracts"],
    queryFn: () => dashboardService.getContracts(),
  });

  const segments = [
    {
      value: data?.noOfDraftContracts || 0,
      color: COLOR_PALETTE[0],
      label: "Draft",
    },
    {
      value: data?.noOfSignedontracts || 0,
      color: COLOR_PALETTE[1],
      label: "Signed",
    },
    {
      value: data?.noOfCancelledContracts || 0,
      color: COLOR_PALETTE[2],
      label: "Cancelled",
    },
  ];

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-3">
      <TileHeader title="Contracts" />
      <div className="space-y-6">
        <div className="pb-1 pt-3">
          <DataText
            label="# OF CONTRACTS"
            value={data?.totalContracts || 0}
            size="sm"
            percentage={Number((data?.deltaContracts || 0).toFixed(2))}
          />
        </div>
        <PieChart segments={segments} total={data?.totalContracts} />
        <Legend segments={segments} />
      </div>
    </div>
  );
};

export default Contract;
