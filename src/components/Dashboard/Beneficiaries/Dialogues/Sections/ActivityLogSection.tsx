import React from "react";

const ActivityLog = () => {
  return (
    <div className="space-y-6">
      <p className="font-medium">Activity log</p>

      <ul className="pl-6">
        {Array.from({ length: 3 }).map((item, index) => {
          return (
            <li
              key={index}
              className="list-disc text-[14px]"
            >
              Is this their most up-to-date employment contract?
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ActivityLog;
