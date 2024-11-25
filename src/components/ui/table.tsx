import React, { TableHTMLAttributes } from "react";
import Spinner from "./spinner/spinner";
import classNames from "classnames";

interface ITableProp extends TableHTMLAttributes<HTMLTableElement> {}

interface ITableHeadProps extends TableHTMLAttributes<HTMLHeadElement> {}

interface ITableContainerProp extends ITableProp {
  isEmpty?: boolean;

  isLoading?: boolean;
}

interface ITableCellProps extends TableHTMLAttributes<HTMLTableCellElement> {
  small?: boolean;
}

const Table = {
  Container: ({
    children,
    isEmpty,
    isLoading,
    ...props
  }: ITableContainerProp) => {
    return (
      <div className="w-full overflow-scroll pb-8">
        <table
          {...props}
          className="w-full rounded-t-[8px] overflow-hidden"
        >
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
      </div>
    );
  },

  Head: ({ children, ...props }: ITableHeadProps) => {
    return (
      <thead
        {...props}
        className="text-left bg-white text-[14px] font-medium truncate"
      >
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

  Data: ({ children, className, ...props }: ITableCellProps) => {
    return (
      <td
        {...props}
        className={classNames(
          "px-4 py-[19px] border-b max-w-[300px] truncate text-[14px]",
          className,
        )}
      >
        {children}
      </td>
    );
  },

  Header: ({ children, small, ...props }: ITableCellProps) => {
    return (
      <th
        {...props}
        className={classNames("text-black px-4 py-5", small && "!py-3")}
      >
        {children}
      </th>
    );
  },
};

export default Table;
