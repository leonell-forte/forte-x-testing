import classNames from "classnames";
import { TableHTMLAttributes, useRef } from "react";

import { ScrollArea, ScrollBar } from "./scroll-area/ScrollArea";
import Spinner from "./spinner/spinner";

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
    const tableRef = useRef<HTMLDivElement>(null);

    return (
      <ScrollArea className="w-full pb-8" type="auto">
        <div ref={tableRef} className="hide-scroll relative w-full">
          <table {...props} className="w-full overflow-hidden !rounded-t-[8px]">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
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

  Row: ({ children }: ITableProp) => {
    return <tr className="w-full">{children}</tr>;
  },

  Data: ({ children, className, small, ...props }: ITableCellProps) => {
    return (
      <td
        {...props}
        className={classNames(
          "h-[56px] max-w-[300px] overflow-visible truncate border-b px-8 text-[14px]",

          small && "!h-[52px] !px-4 !py-2",

          className
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
        className={classNames(
          "px-12 py-5 !text-black",
          small && "!h-[52px] !px-4 !py-2",
          props.className
        )}
      >
        {children}
      </th>
    );
  },
};

export default Table;
