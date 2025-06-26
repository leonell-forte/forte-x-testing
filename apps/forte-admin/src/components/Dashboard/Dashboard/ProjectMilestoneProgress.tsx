import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/api/dashboard";
import { useMemo } from "react";

import Card from "@/components/Dashboard/Dashboard/Card";
import {
  Carousel,
  CarouselPagination,
  CarouselSlide,
  CarouselSlides,
} from "@/components/ui/carousel";
import Legend from "@/components/ui/charts/Legend";
import SegmentedProgressBar from "@/components/ui/charts/SegmentedProgressBar";

import TileHeader from "@/components/Dashboard/Dashboard/TileHeader";
import { COLOR_PALETTE } from "@/components/Dashboard/Dashboard/constant";
import { useDashboardState } from "@/components/Dashboard/Dashboard/useDashboardState";
import type { JSX } from "react";

function formatThresholdText(
  approved: number,
  threshold: number,
  total: number
): string {
  const percentApproved = Math.round((approved / total) * 100);
  const percentThreshold = Math.round((threshold / total) * 100);
  return `${percentApproved}% of ${percentThreshold > 100 ? 100 : percentThreshold}%`;
}

const ProjectMilestoneProgress = () => {
  const { project } = useDashboardState();
  const { data, isLoading } = useQuery({
    queryKey: ["milestone-progress-contract", project?.value],
    queryFn: () =>
      dashboardService.getProgressMilestoneProgress(project?.value || ""),
    enabled: !!project,
  });

  const slides = useMemo(
    () =>
      data?.map((item, index) => {
        return (
          <div key={index} className="space-y-10">
            <TileHeader
              title={`${item.contractName} milestones`}
              tooltip="Specific contract’s % of completion per milestone that needs to be achieved"
            />

            <div className="!mb-4 space-y-[40px]">
              {item.milestones.map((milestone, index) => {
                const outcomeSegments = [
                  {
                    label: "Achieved",
                    value: milestone.noOfAchievedMilestones,
                    color: COLOR_PALETTE[0],
                  },
                  {
                    label: "Invoiced",
                    value: milestone.noOfInvoicedMilestones,
                    color: COLOR_PALETTE[1],
                  },
                  {
                    label: "Paid",
                    value: milestone.noOfPaidMilestones,
                    color: COLOR_PALETTE[5],
                  },
                ];
                const config =
                  milestone.type === "outcome"
                    ? {
                        progress: `${milestone.noOfPaidMilestones} / ${milestone.noOfSameMilestones}`,
                        total: milestone.noOfSameMilestones,
                        segments: outcomeSegments,
                        nonSegmented:
                          outcomeSegments.filter(
                            (segment) => segment.value === 0
                          ).length >= 2,
                      }
                    : {
                        segments: [
                          {
                            label: "Beneficiaries with approved evidences",
                            value: milestone.noOfApprovedEvidences,
                            color:
                              COLOR_PALETTE[
                                Math.floor(
                                  Math.random() * (COLOR_PALETTE.length - 1)
                                )
                              ],
                          },
                        ],
                        nonSegmented: true,
                        progress: formatThresholdText(
                          milestone.noOfApprovedEvidences,
                          milestone.threshold,
                          item.targetNoOfBenefeciaries
                        ),
                        total: item.targetNoOfBenefeciaries,
                        threshold: milestone.threshold,
                      };
                return (
                  <SegmentedProgressBar
                    key={index}
                    label={
                      <p>
                        <span className="uppercase">
                          {milestone.outcomeName || "No outcome name"}
                        </span>{" "}
                        <span className="text-[10px]">({milestone.type})</span>
                      </p>
                    }
                    {...config}
                  />
                );
              })}
            </div>
          </div>
        );
      }) || [],
    [data]
  );

  const legends = [
    {
      label: "Achieved",
      color: COLOR_PALETTE[0],
    },
    {
      label: "Invoiced",
      color: COLOR_PALETTE[1],
    },
    {
      label: "Paid",
      color: COLOR_PALETTE[5],
    },
  ];

  return (
    <Card variant="outline" isLoading={isLoading}>
      <div className="h-full">
        <Carousel className="flex h-full flex-col justify-between">
          <div className="space-y-8">
            <CarouselSlides>
              {slides.map((slide: JSX.Element, index: number) => (
                <CarouselSlide key={index}>{slide}</CarouselSlide>
              ))}
            </CarouselSlides>
            <Legend segments={legends} />
          </div>
          <CarouselPagination total={slides.length} />
        </Carousel>
      </div>
    </Card>
  );
};

export default ProjectMilestoneProgress;
