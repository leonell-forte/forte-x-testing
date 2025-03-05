import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import { format } from "date-fns";

import {
  ActivityLog,
  ChangeValue,
  EvidenceChanges,
} from "lib/types/activity-logs";

import Spinner from "components/ui/spinner/spinner";

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

  const renderChangeMessage = (log: ActivityLog) => {
    if (!log.changes) return null;
    const { user } = log;

    const { firstName, lastName } = user;

    const changes = Object.entries(log.changes)
      .map((item) => {
        const updatedAt = new Date(log.changes.updatedAt?.newValue as string);

        const date = `${format(updatedAt, "dd LLL yyyy")}`;

        const time =
          updatedAt.getHours() +
          ":" +
          updatedAt.getMinutes() +
          " " +
          (updatedAt.getHours() >= 12 ? "PM" : "AM");

        const [key, value] = item as [keyof EvidenceChanges, ChangeValue];
        if (!value || !value.newValue) return null;

        switch (key) {
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
      {data?.length === 1 ? (
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
        </ul>
      )}
    </div>
  );
};

export default ActivityLogSection;
