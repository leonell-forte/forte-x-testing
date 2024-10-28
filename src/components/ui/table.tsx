import React, { TableHTMLAttributes } from "react";

interface ITableProp extends TableHTMLAttributes<HTMLTableElement> {}

const Table = {
  Container: ({ children }: ITableProp) => {
    return (
      <table className="w-full rounded-t-[8px] overflow-hidden">
        {children}
      </table>
    );
  },

  Head: ({ children }: ITableProp) => {
    return (
      <thead className="text-left bg-white text-[14px] font-medium ">
        {children}
      </thead>
    );
  },

  Body: ({ children }: ITableProp) => {
    return <tbody>{children}</tbody>;
  },

  Row: ({ children }: ITableProp) => {
    return <tr className="w-full">{children}</tr>;
  },

  Data: ({ children }: ITableProp) => {
    return (
      <td className="px-4 py-[19px] border-b max-w-[200px] truncate text-[14px]">
        {children}
      </td>
    );
  },

  Header: ({ children }: ITableProp) => {
    return <th className="text-black px-4 py-6">{children}</th>;
  },
};

export default Table;
