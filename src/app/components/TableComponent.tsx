"use client";

import Pagination from "@/components/ui/pagination";
import Table from "@/components/ui/table";
import Image from "next/image";
import React, { useCallback, useState } from "react";

const TableComponent = () => {
  const [page, setPage] = useState(1);

  const slicedTableData = useCallback(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    return TABLE_DATA.slice(start, end);
  }, [page]);
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        Table Component
      </p>
      <div className="flex flex-col gap-4">
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

export default TableComponent;

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
];
