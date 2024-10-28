"use client";

import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import Table from "@/components/ui/table";
import Image from "next/image";
import React, { useCallback, useState } from "react";

interface IUser {
  name: string;
  email: string;
  phone: string;
  role: string;
  organization: string;
}

const Users = () => {
  const [page, setPage] = useState(1);

  const slicedTableData = useCallback(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    return TABLE_DATA.slice(start, end);
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
        <Table.Container>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}
              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {slicedTableData().map((item, bodyIndex) => {
              return <TableRow key={bodyIndex} user={item} />;
            })}
          </Table.Body>
        </Table.Container>

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

const TableRow = ({ user }: { user: IUser }) => {
  const { name, email, phone, role, organization } = user;
  return (
    <Table.Row>
      <Table.Data>{name}</Table.Data>
      <Table.Data>{email}</Table.Data>
      <Table.Data>{phone}</Table.Data>
      <Table.Data>{role}</Table.Data>
      <Table.Data>{organization}</Table.Data>
      <Table.Data>
        <button className="p-[3px]">
          <Image
            width={18}
            height={18}
            alt="pencil"
            src="/images/icons/pencil.svg"
          />
        </button>
      </Table.Data>
    </Table.Row>
  );
};

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
  {
    name: "Jane Smith",
    email: "jane_smith@example.com",
    phone: "+61 4567890123",
    role: "User",
    organization: "Amet Solutions",
  },
  {
    name: "Mike Johnson",
    email: "mike_j@example.com",
    phone: "+61 5678901234",
    role: "Readonly",
    organization: "Consectetur Studio",
  },
  {
    name: "Emily Davis",
    email: "emily_davis@example.com",
    phone: "+61 6789012345",
    role: "Suspended",
    organization: "Elit Innovators",
  },
  {
    name: "Robert Brown",
    email: "robert_brown@example.com",
    phone: "+61 7890123456",
    role: "User",
    organization: "Vestibulum Inc",
  },
  {
    name: "Sophia Green",
    email: "sophia_green@example.com",
    phone: "+61 8901234567",
    role: "Admin",
    organization: "Aliquam Corp",
  },
  {
    name: "James Wilson",
    email: "james_w@example.com",
    phone: "+61 9012345678",
    role: "Owner",
    organization: "Pharetra LLC",
  },
  {
    name: "Isabella Martinez",
    email: "isabella_m@example.com",
    phone: "+61 0123456789",
    role: "Readonly",
    organization: "Nunc Studios",
  },
  {
    name: "Ethan Lewis",
    email: "ethan_l@example.com",
    phone: "+61 1234567890",
    role: "Suspended",
    organization: "Egestas Company",
  },
];
