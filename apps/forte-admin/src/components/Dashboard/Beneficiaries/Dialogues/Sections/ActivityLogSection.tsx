import { useQuery } from "@tanstack/react-query";
import evidenceService from "@/api/evidence";
import { format } from "date-fns";
import { isEmpty } from "lodash";

import type { ActivityLog } from "@/lib/types/activity-logs";
import { formatDate } from "@/lib/utils";

import Spinner from "@/components/ui/spinner/spinner";

interface IActivityLogProps {
  beneficiaryId: number;
  evidenceId: number;
}

const ActivityLogSection = ({
  beneficiaryId,
  evidenceId,
}: IActivityLogProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs", beneficiaryId, evidenceId],
    queryFn: () => evidenceService.getActivityLogs(beneficiaryId, evidenceId),
  });

  const getTime = (date: Date) => {
    const time =
      date.getHours() +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      " " +
      (date.getHours() >= 12 ? "PM" : "AM");

    return time;
  };

  const renderChangeMessage = (log: ActivityLog) => {
    if (isEmpty(log.changes)) return null;
    const { user } = log;

    const { firstName, lastName } = user;

    const changes = Object.entries(log.changes)
      .map(([key]) => {
        const updatedAt = new Date(log.createdAt as string);

        const date = `${format(updatedAt, "dd LLL yyyy")}`;

        const time = getTime(updatedAt);

        switch (key.toLowerCase()) {
          case "description":
            return ` Evidence description was updated by ${firstName} ${lastName} at ${time} on ${date}.`;
          case "status":
            return `Evidence status was updated by ${firstName} ${lastName} at ${time} on ${date}`;
          case "outcome.name":
            return `Evidence outcome was updated by ${firstName} ${lastName} at ${time} on ${date}`;
          case "file.filename":
            return `Evidence was replaced by ${firstName} ${lastName} at ${time} on ${date}`;
          default:
            return null;
        }
      })
      .filter(Boolean);

    return changes;
  };

  if (isLoading)
    return (
      <div className="flex h-24 w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <p className="font-medium">Activity log</p>
      {!data?.length ? (
        <p className="text-[14px]">No activities at the moment</p>
      ) : (
        <ul className="pl-6">
          {data?.map((item, index) => {
            const changes = renderChangeMessage(item);

            return changes?.map((message, msgIndex) => (
              <li
                key={`${index}-${msgIndex}`}
                className="list-disc text-[14px]"
              >
                {message}
              </li>
            ));
          })}
          <li className="list-disc text-[14px]">
            Evidence was uploaded by {data[data.length - 1].user.firstName}{" "}
            {data[data.length - 1].user.lastName} at{" "}
            {getTime(new Date(data[data.length - 1].createdAt))} at{" "}
            {formatDate(data[data.length - 1].createdAt, "dd LLL yyyy")}
          </li>
        </ul>
      )}
    </div>
  );
};

export default ActivityLogSection;
