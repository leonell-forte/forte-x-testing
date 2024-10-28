"use client";

import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import SearchInput from "@/components/ui/search-input";
import React from "react";

const Users = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[18px]">
        <p className="text-[20px]">Filter by</p>
        <Dropdown
          placeholder="Select filter"
          className="max-w-[211px]"
          options={filters}
        />
      </div>

      <div className="flex items-center gap-6">
        <SearchInput className="w-[286px]" />
        <Button onClick={() => {}}>Add User</Button>
      </div>
    </div>
  );
};

export default Users;

const filters = [
  {
    label: "Test",
    value: "test",
  },
];
