import React, { TableHTMLAttributes } from "react";

const Table = {
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

export default Table;
