import React, { TableHTMLAttributes } from "react";
import Spinner from "./spinner/spinner";

interface ITableProp extends TableHTMLAttributes<HTMLTableElement> {}

interface ITableContainerProp extends ITableProp {
  isEmpty?: boolean;
  isLoading?: boolean;
}

const Table = {
  Container: ({ children, isEmpty, isLoading }: ITableContainerProp) => {
    return (
      <>
        <table className="w-full rounded-t-[8px] overflow-hidden">
          {children}
        </table>
        {isEmpty && !isLoading && (
          <div className="min-w-full flex items-center justify-center h-40 mx-auto">
            <p>No data</p>
          </div>
        )}
        {isLoading && (
          <div className="w-full h-40 flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </>
    );
  },

  Head: ({ children }: ITableProp) => {
    return (
      <thead className="text-left bg-white text-[14px] font-medium truncate">
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
