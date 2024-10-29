"use client";

import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import Table from "@/components/ui/table";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import UserDialogue from "./Dialogues/UserDialogue";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  role: string;
  organization: string;
}

const Users = () => {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"user" | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const slicedTableData = useCallback(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    return TABLE_DATA.slice(start, end);
  }, [page]);

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setModal("user");
  };

  return (
    <>
      <UserDialogue
        user={selectedUser}
        isVisible={modal === "user"}
        handleClose={() => setModal(null)}
      />
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
            <Button onClick={() => setModal("user")}>Add User</Button>
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
                const { name, email, phone, role, organization } = item;
                return (
                  <Table.Row key={bodyIndex}>
                    <Table.Data>{name}</Table.Data>
                    <Table.Data>{email}</Table.Data>
                    <Table.Data>{phone}</Table.Data>
                    <Table.Data>{role}</Table.Data>
                    <Table.Data>{organization}</Table.Data>
                    <Table.Data>
                      <button
                        type="button"
                        onClick={() => handleEditUser(item)}
                        className="p-[3px]"
                      >
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
    </>
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
];

const TABLE_DATA: IUser[] = [
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
