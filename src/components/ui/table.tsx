import classNames from "classnames";
import { TableHTMLAttributes, useRef } from "react";

import useScroll from "./horizontal-scroller/useScroll";
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

    useScroll({ container: tableRef });

    return (
      <div
        ref={tableRef}
        className="hide-scroll relative w-full overflow-scroll pb-8"
      >
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

  Data: ({ children, className, ...props }: ITableCellProps) => {
    return (
      <td
        {...props}
        className={classNames(
          "h-[56px] max-w-[300px] overflow-visible truncate border-b px-8 text-[14px]",

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
        className={classNames("px-8 py-5 !text-black", small && "!py-3")}
      >
        {children}
      </th>
    );
  },
};

export default Table;
