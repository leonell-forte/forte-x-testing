import Dropdown from "@/components/ui/dropdown";
import React from "react";

const UsersPage = () => {
  const options = [
    {
      label: "project",
      value: "project",
    },
    {
      label: "status",
      value: "status",
    },
    {
      label: "project",
      value: "project",
    },
    {
      label: "project",
      value: "project",
    },
    {
      label: "project",
      value: "project",
    },
    {
      label: "project",
      value: "project",
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[18px]">
          <p>Filter by</p>
          <Dropdown placeholder="Select Filter" className="w-[211px]" />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
