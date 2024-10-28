import React, { ReactNode, TableHTMLAttributes } from "react";

const TableComponent = {
  Container: ({ children }: TableHTMLAttributes<HTMLTableElement>) => {
    return (
      <table className="w-full rounded-t-[8px] overflow-hidden">
        {children}
      </table>
    );
  },

  Head: ({ children }: TableHTMLAttributes<HTMLTableElement>) => {
    return (
      <thead className="text-left bg-white text-[14px] font-medium ">
        {children}
      </thead>
    );
  },

  Body: ({ children }: TableHTMLAttributes<HTMLTableElement>) => {
    return <tbody>{children}</tbody>;
  },

  Row: ({ children }: TableHTMLAttributes<HTMLTableElement>) => {
    return <tr className="w-full">{children}</tr>;
  },

  Data: ({ children }: TableHTMLAttributes<HTMLTableElement>) => {
    return (
      <td className="px-4 py-[19px] border-b max-w-[200px] truncate text-[14px]">
        {children}
      </td>
    );
  },

  Header: ({ children }: TableHTMLAttributes<HTMLTableElement>) => {
    return <th className="text-black px-4 py-6">{children}</th>;
  },
};

interface ITableProps {
  headers: string[];
  data: Record<string, string | ReactNode>[];
}

const Table = ({ headers, data }: ITableProps) => {
  return (
    <TableComponent.Container>
      <TableComponent.Head>
        <TableComponent.Row>
          {headers.map((key: string, headerIndex: number) => {
            return (
              <TableComponent.Header key={headerIndex}>
                {key}
              </TableComponent.Header>
            );
          })}
        </TableComponent.Row>
      </TableComponent.Head>
      <TableComponent.Body>
        {data.map(
          (obj: Record<string, string | ReactNode>, bodyIndex: number) => {
            return (
              <TableComponent.Row key={bodyIndex}>
                {Object.keys(obj).map((key, index) => {
                  return (
                    <TableComponent.Data key={index}>
                      {obj[key]}
                    </TableComponent.Data>
                  );
                })}
              </TableComponent.Row>
            );
          }
        )}
      </TableComponent.Body>
    </TableComponent.Container>
  );
};

export default Table;
