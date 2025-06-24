import { useQuery } from "@tanstack/react-query";
import { omit } from "lodash";
import { useMemo } from "react";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";

import dashboardService from "@/api/dashboard";
import Pin from "@/assets/images/icons/pin.svg?react";
import Card from "@/components/Dashboard/Dashboard/Card";
import TileHeader from "@/components/Dashboard/Dashboard/TileHeader";
import type { ActionItemsType } from "@/components/Dashboard/Dashboard/types";
import {
  ACTION_ITEMS_LABELS,
  ACTION_ITEMS_LINKS,
} from "@/components/Dashboard/Dashboard/types";
import { useDashboardState } from "@/components/Dashboard/Dashboard/useDashboardState";

const ActionItems = () => {
  const { project } = useDashboardState();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-action-items", project?.value],
    queryFn: () => dashboardService.getActionItems(project?.value),
  });

  const actionItems = useMemo(() => {
    if (project?.value)
      return omit(data || {}, ["draftContracts", "evidencesPending"]);
    return data;
  }, [data, project?.value]);

  return (
    <Card className="space-y-4" isLoading={isLoading}>
      <TileHeader
        title="Action items"
        icon={
          <Pin
            fill="white"
            width="24"
            height="24"
            className="print-visible-icon"
          />
        }
      />

      <ul className="action-items-list mt-10">
        {actionItems &&
          Object.entries(actionItems as ActionItemsType).map(([key, value]) => {
            return (
              <Link
                key={key}
                to={ACTION_ITEMS_LINKS[key as keyof ActionItemsType]}
              >
                <li
                  key={key}
                  className="action-item border-panel group flex h-[56px] items-center justify-between gap-8 border-b-[2px]"
                >
                  <span className="group-hover:text-mint truncate font-semibold transition">
                    {ACTION_ITEMS_LABELS[key as keyof ActionItemsType]}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="group-hover:text-mint font-light transition">
                      ({value})
                    </span>
                    <HiChevronRight className="hide-in-print fill-mint h-auto w-6" />
                  </div>
                </li>
              </Link>
            );
          })}
      </ul>
    </Card>
  );
};

export default ActionItems;
