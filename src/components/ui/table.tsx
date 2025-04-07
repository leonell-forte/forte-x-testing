import classNames from "classnames";
import { TableHTMLAttributes, useEffect, useRef, useState } from "react";

import { Tooltip } from "./tooltip/Tooltip";

interface ITableProp extends TableHTMLAttributes<HTMLTableElement> {}

interface ITableRowProps extends TableHTMLAttributes<HTMLTableRowElement> {}

interface ITableHeadProps extends TableHTMLAttributes<HTMLHeadElement> {}

interface ITableContainerProp extends ITableProp {
  isEmpty?: boolean;

  isLoading?: boolean;

  loadingConfig?: {
    rows: number;
    columns: number;
  };
}

const defaultLoadingConfig = {
  rows: 10,
  columns: 8,
};

interface ITableCellProps extends TableHTMLAttributes<HTMLTableCellElement> {}

const Table = {
  Container: ({
    children,

    isEmpty,

    isLoading,

    loadingConfig = defaultLoadingConfig,

    ...props
  }: ITableContainerProp) => {
    const tableRef = useRef<HTMLDivElement>(null);

    return (
      <div className={classNames("w-full pb-1", props.className)}>
        <div ref={tableRef} className="relative w-full">
          <table {...props} className="w-full">
            {children}
            {isLoading && (
              <tbody>
                {Array.from({ length: loadingConfig.rows }).map(
                  (_, rowIndex) => (
                    <tr
                      key={`row-${rowIndex}`}
                      className="border-b border-white/50 last:border-0"
                    >
                      {Array.from({ length: loadingConfig.columns }).map(
                        (_, colIndex) => (
                          <td
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="p-4"
                          >
                            <div
                              className={`h-6 animate-pulse rounded-md bg-white/30 ${
                                colIndex === 0
                                  ? "w-24"
                                  : colIndex % 2 === 0
                                    ? "w-1/2"
                                    : "w-full"
                              }`}
                            />
                          </td>
                        )
                      )}
                    </tr>
                  )
                )}
              </tbody>
            )}
          </table>

          {isEmpty && !isLoading && (
            <div className="mx-auto flex h-40 min-w-full items-center justify-center">
              <p>No data</p>
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
          "truncate border-b border-white/50 text-left",

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
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);

    useEffect(() => {
      const el = textRef.current;
      if (el) {
        setIsOverflowed(el.scrollWidth > el.clientWidth);
      }
    }, [children]);

    const content = (
      <div ref={textRef} className={classNames(className, "truncate px-6")}>
        {children}
      </div>
    );

    return (
      <td
        className="h-[50px] max-w-[300px] border-b border-white/50 text-base font-[300]"
        {...props}
      >
        {isOverflowed ? (
          <Tooltip title={children} placement="top">
            {content}
          </Tooltip>
        ) : (
          content
        )}
      </td>
    );
  },

  Header: ({ children, ...props }: ITableCellProps) => {
    return (
      <th
        {...props}
        className={classNames(
          "h-[50px] truncate px-6 text-base font-semibold text-white",
          props.className
        )}
      >
        {children}
      </th>
    );
  },
};

export default Table;
