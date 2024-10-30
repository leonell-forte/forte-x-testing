"use client";

import Pagination from "../../components/ui/pagination";
import Table from "../../components/ui/table";
import { useState } from "react";

const TableComponent = () => {
  const [page, setPage] = useState(1);

  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        Table Component
      </p>
      <div className="flex flex-col gap-4">
        <Table.Container>
          <Table.Head>
            <Table.Row>
              <Table.Header>Header</Table.Header>
              <Table.Header>Header</Table.Header>
              <Table.Header>Header</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Data>Data</Table.Data>
              <Table.Data>Data</Table.Data>
              <Table.Data>Data</Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>Data</Table.Data>
              <Table.Data>Data</Table.Data>
              <Table.Data>Data</Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Container>
        <div className="flex justify-end">
          <Pagination
            page={page}
            onPageChange={(val) => setPage(val)}
            total={30}
          />
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
