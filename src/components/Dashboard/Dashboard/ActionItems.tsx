import { useQuery } from "@tanstack/react-query";
import dashboardService from "api/dashboard";
import { omit } from "lodash";
import { useMemo } from "react";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";

import { ReactComponent as Pin } from "assets/images/icons/pin.svg";

import Card from "components/Dashboard/Dashboard/Card";

import TileHeader from "./TileHeader";
import {
  ACTION_ITEMS_LABELS,
  ACTION_ITEMS_LINKS,
  ActionItemsType,
} from "./types";
import { useDashboardState } from "./useDashboardState";

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
              <Link to={ACTION_ITEMS_LINKS[key as keyof ActionItemsType]}>
                <li
                  key={key}
                  className="action-item group flex h-[56px] items-center justify-between gap-8 border-b-[2px] border-panel"
                >
                  <span className="truncate font-semibold transition group-hover:text-mint">
                    {ACTION_ITEMS_LABELS[key as keyof ActionItemsType]}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="font-light transition group-hover:text-mint">
                      ({value})
                    </span>
                    <HiChevronRight className="hide-in-print h-auto w-6 fill-mint" />
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
