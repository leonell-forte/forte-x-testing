"use client";

import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import Table from "@/components/ui/table";
import Image from "next/image";
import React, { useCallback, useState } from "react";

const Users = () => {
  const [page, setPage] = useState(1);

  const slicedTableData = useCallback(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    return TABLE_DATA.slice(start, end).map((item) => ({
      ...item,
      action: (
        <button className="p-[3px]">
          <Image
            width={18}
            height={18}
            alt="pencil"
            src="/images/icons/pencil.svg"
          />
        </button>
      ),
    }));
  }, [page]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between w-full">
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
      <div className="space-y-[18px]">
        <Table headers={TABLE_HEADER} data={slicedTableData()} />

        <div className="flex justify-end">
          <Pagination
            page={page}
            onPageChange={(val) => setPage(val)}
            total={TABLE_DATA.length}
          />
        </div>
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
const TABLE_HEADER = [
  "User’s full name",
  "Email",
  "Phone",
  "Role",
  "Organization",
  "",
];

const TABLE_DATA = [
  {
    name: "Rosalyn Simon",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem Ipsum LLC",
  },
  {
    name: "John Doe",
    email: "john_doe@example.com",
    phone: "+61 3456789012",
    role: "Admin",
    organization: "Dolor Sit Corp",
  },
];
