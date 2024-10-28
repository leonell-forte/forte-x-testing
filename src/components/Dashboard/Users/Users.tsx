"use client";

import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import SearchInput from "@/components/ui/search-input";
import Table from "@/components/ui/table";
import Image from "next/image";
import React from "react";

const Users = () => {
  return (
    <div className="space-y-1.5">
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
      <div>
        <Table.Container>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, index) => {
                return <Table.Header key={index}>{key}</Table.Header>;
              })}
              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {TABLE_DATA.map((item, index) => {
              const { name, email, phone, role, organization } = item;
              return (
                <Table.Row key={index}>
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
            })}
          </Table.Body>
        </Table.Container>
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
];

const TABLE_DATA = [
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
  {
    name: "Rosalyn Simon ",
    email: "rosalyn_simon@gmail.com",
    phone: "+61 2345678902",
    role: "Owner",
    organization: "Lorem ipsum Lorem ipsum",
  },
];
