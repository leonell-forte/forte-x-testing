import classNames from "classnames";
import { TableHTMLAttributes, useRef } from "react";

import Spinner from "./spinner/spinner";

interface ITableProp extends TableHTMLAttributes<HTMLTableElement> {}

interface ITableRowProps extends TableHTMLAttributes<HTMLTableRowElement> {}

interface ITableHeadProps extends TableHTMLAttributes<HTMLHeadElement> {}

interface ITableContainerProp extends ITableProp {
  isEmpty?: boolean;

  isLoading?: boolean;
}

interface ITableCellProps extends TableHTMLAttributes<HTMLTableCellElement> {}

const Table = {
  Container: ({
    children,

    isEmpty,

    isLoading,

    ...props
  }: ITableContainerProp) => {
    const tableRef = useRef<HTMLDivElement>(null);

    return (
      <div className={classNames("w-full pb-8", props.className)}>
        <div ref={tableRef} className="hide-scroll relative w-full">
          <table
            {...props}
            className="w-full overflow-hidden !rounded-t-[10px]"
          >
            {children}
          </table>

          {isEmpty && !isLoading && (
            <div className="mx-auto flex h-40 min-w-full items-center justify-center">
              <p>No data</p>
            </div>
          )}

          {isLoading && (
            <div className="flex h-40 w-full items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    );
  },

  Head: ({ children, ...props }: ITableHeadProps) => {
    return (
      <thead
        {...props}
        className={classNames(
          "truncate bg-white text-left text-[14px] font-medium",

          props.className
        )}
      >
        {children}
      </thead>
    );
  },

  Body: ({ children }: ITableProp) => {
    return <tbody>{children}</tbody>;
  },

  Row: ({ children, onClick }: ITableRowProps) => {
    return (
      <tr
        className={classNames(
          "w-full",
          onClick &&
            "cursor-pointer transition-all hover:bg-slate-50 hover:bg-opacity-5"
        )}
        onClick={onClick}
      >
        {children}
      </tr>
    );
  },

  Data: ({ children, className, ...props }: ITableCellProps) => {
    return (
      <td
        className={"h-[50px] max-w-[300px] border-b text-[14px] font-[300]"}
        {...props}
      >
        <div className={classNames(className, "truncate pl-[16px]")}>
          {children}
        </div>
      </td>
    );
  },

  Header: ({ children, ...props }: ITableCellProps) => {
    return (
      <th
        {...props}
        className={classNames(
          "h-[50px] truncate pl-[16px] font-[450] !text-black",
          props.className
        )}
      >
        {children}
      </th>
    );
  },
};

export default Table;
