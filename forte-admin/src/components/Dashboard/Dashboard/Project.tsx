import { useQuery } from "@tanstack/react-query";
import dashboardService from "api/dashboard";
import React from "react";

import Legend from "components/ui/charts/Legend";
import PieChart from "components/ui/charts/PieChart";
import Spinner from "components/ui/spinner/spinner";

import DataText from "./DataText";
import TileHeader from "./TileHeader";
import { COLOR_PALETTE } from "./constant";

const Project = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-projects"],
    queryFn: () => dashboardService.getProjects(),
  });

  const segments = [
    {
      value: data?.noOfActiveProjects || 0,
      color: COLOR_PALETTE[0],
      label: "Active",
    },
    {
      value: data?.noOfCompletedProjects || 0,
      color: COLOR_PALETTE[1],
      label: "Active",
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
      <TileHeader title="Project" />
      <div className="space-y-6">
        <div className="pb-1 pt-3">
          <DataText
            label="# OF PROJECTS"
            value={data?.totalProjects || 0}
            size="sm"
            percentage={Number((data?.deltaProjects || 0).toFixed(2))}
          />
        </div>
        <PieChart segments={segments} />
        <Legend segments={segments} />
      </div>
    </div>
  );
};

export default Project;
