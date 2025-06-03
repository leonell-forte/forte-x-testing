import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import { format, formatDistanceToNow } from "date-fns";
import { isEmpty } from "lodash";

import { ActivityLog } from "lib/types/activity-logs";
import { Evidence } from "lib/types/evidence";

import Spinner from "components/ui/spinner/spinner";

interface IHistoryProps {
  beneficiaryId: number;
  evidenceId: number;
  evidenceData: Evidence;
}

const History = ({
  beneficiaryId,
  evidenceId,
  evidenceData,
}: IHistoryProps) => {
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

    const changes = log.changes
      .map((item) => {
        const updatedAt = new Date(log.createdAt);

        const date = `${format(updatedAt, "dd LLL yyyy")}`;

        const time = getTime(updatedAt);
        switch (item.propertyName.toLowerCase()) {
          case "description":
            return ` Evidence description was updated by ${firstName} ${lastName} at ${time} on ${date}.`;
          case "status":
            return `Status was updated from ${item.oldValue} to ${item.newValue}`;
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
    <div>
      {!data?.length ? (
        <p className="text-[14px]">No activities at the moment</p>
      ) : (
        <ul className="space-y-8">
          {data?.map((item) => {
            const { user } = item;
            const { firstName, lastName } = user;
            const changes = renderChangeMessage(item);

            return changes?.map((message, msgIndex) => (
              <li key={msgIndex} className="flex gap-4">
                <div className="h-4 w-4 rounded-full bg-mint"></div>

                <div className="space-y-2">
                  <p className="font-semibold leading-[100%]">{message}</p>
                  <p className="text-[12px] font-light text-neutral-600">
                    {firstName} {lastName} •{" "}
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </li>
            ));
          })}
          {/* <li className="list-disc text-[14px]">
            Evidence was uploaded by {data[data.length - 1].user.firstName}{" "}
            {data[data.length - 1].user.lastName} at{" "}
            {getTime(new Date(data[data.length - 1].createdAt))} at{" "}
            {formatDate(data[data.length - 1].createdAt, "dd LLL yyyy")}
          </li> */}
          <li className="flex gap-4">
            <div className="h-4 w-4 rounded-full bg-mint"></div>

            <div className="space-y-2">
              <p className="font-semibold leading-[100%]">
                {evidenceData.file.filename} was uploaded
              </p>
              <p className="text-[12px] font-light text-neutral-600">
                {evidenceData.updatedBy.firstName}{" "}
                {evidenceData.updatedBy.lastName} •{" "}
                {formatDistanceToNow(new Date(evidenceData.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

export default History;
