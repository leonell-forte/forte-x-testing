import classNames from "classnames";
import { TableHTMLAttributes, useEffect, useRef, useState } from "react";

import search from "@/assets/images/search.png";
import { cn } from "@/lib/utils";

import { Tooltip } from "./tooltip/Tooltip";

interface ITableProp extends TableHTMLAttributes<HTMLTableElement> {}

interface ITableRowProps extends TableHTMLAttributes<HTMLTableRowElement> {
  ariaLabel?: string;
}

interface ITableHeadProps extends TableHTMLAttributes<HTMLHeadElement> {}

interface ITableContainerProp extends ITableProp {
  isLoading?: boolean;

  loadingConfig?: {
    rows: number;
    columns: number;
  };

  emptyConfig?: {
    title?: string;
    description?: string;
    status: boolean;
  };
}

const defaultLoadingConfig = {
  rows: 10,
  columns: 8,
};

interface ITableCellProps extends TableHTMLAttributes<HTMLTableCellElement> {
  cellClassName?: string;
}

const Table = {
  Container: ({
    children,

    emptyConfig,

    isLoading,

    loadingConfig = defaultLoadingConfig,

    ...props
  }: ITableContainerProp) => {
    const tableRef = useRef<HTMLDivElement>(null);

    if (emptyConfig?.status && !isLoading) {
      return (
        <div
          className="mx-auto space-y-2 py-12 text-center"
          role="alert"
          aria-label="No data available"
        >
          <img
            src={search}
            alt="No data illustration"
            loading="lazy"
            className="mx-auto max-w-[200px]"
          />
          <p
            className="text-[20px] font-semibold"
            role="heading"
            aria-level={2}
          >
            {emptyConfig?.title || "No data yet"}
          </p>
          {emptyConfig.description && (
            <p
              className="mx-auto max-w-[200px] font-light"
              aria-description={emptyConfig.description}
            >
              {emptyConfig?.description}
            </p>
          )}
        </div>
      );
    }

    return (
      <div
        className={classNames("w-full pb-1", props.className)}
        role="region"
        aria-label="Data table container"
      >
        <div ref={tableRef} className="relative w-full">
          <table
            {...props}
            className="w-full"
            role="table"
            aria-busy={isLoading}
            aria-label={props["aria-label"] || "Data table"}
          >
            {children}
            {isLoading && (
              <tbody>
                {Array.from({ length: loadingConfig.rows }).map(
                  (_, rowIndex) => (
                    <tr
                      key={`row-${rowIndex}`}
                      className="border-b border-white/50 last:border-0"
                      role="row"
                      aria-label="Loading row"
                    >
                      {Array.from({ length: loadingConfig.columns }).map(
                        (_, colIndex) => (
                          <td
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="p-4"
                            role="cell"
                            aria-label="Loading cell"
                          >
                            <div
                              className={`h-6 animate-pulse rounded-md bg-white/30 ${
                                colIndex === 0
                                  ? "w-24"
                                  : colIndex % 2 === 0
                                    ? "w-1/2"
                                    : "w-full"
                              }`}
                              role="presentation"
                              aria-hidden="true"
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
        aria-label="Table header"
      >
        {children}
      </thead>
    );
  },

  Body: ({ children }: ITableProp) => {
    return <tbody aria-label="Table body">{children}</tbody>;
  },

  Row: ({ children, onClick, ariaLabel }: ITableRowProps) => {
    return (
      <tr
        className={classNames(
          "w-full",
          onClick &&
            "cursor-pointer transition-all hover:bg-slate-50 hover:bg-opacity-5 focus:outline-1 focus:outline-white"
        )}
        onClick={onClick}
        role="row"
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (
            onClick &&
            (e.key === "Enter" || e.key === " ") &&
            !((e.target as HTMLElement).tagName === "BUTTON")
          ) {
            e.preventDefault();
            onClick(e as any);
          }
        }}
        aria-label={`${ariaLabel || "Table"} row`}
      >
        {children}
      </tr>
    );
  },

  Data: ({ children, className, cellClassName, ...props }: ITableCellProps) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);

    useEffect(() => {
      const el = textRef.current;
      if (el) {
        setIsOverflowed(el.scrollWidth > el.clientWidth);
      }
    }, [children]);

    const content = (
      <div
        ref={textRef}
        className={classNames(className, "truncate px-6")}
        role="presentation"
      >
        {children}
      </div>
    );

    return (
      <td
        className={cn(
          "h-[50px] max-w-[300px] border-b border-white/50 text-base font-[300]",
          cellClassName
        )}
        {...props}
        role="cell"
        aria-label={typeof children === "string" ? children : undefined}
        title={
          isOverflowed
            ? typeof children === "string"
              ? children
              : ""
            : undefined
        }
      >
        {isOverflowed ? (
          <Tooltip
            title={children}
            placement="top"
            aria-hidden="true" // Hide tooltip from screen readers as content is already accessible
          >
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
        role="columnheader"
        scope="col"
        aria-label={typeof children === "string" ? children : undefined}
      >
        <span className="flex items-center justify-start">{children}</span>
      </th>
    );
  },
};

export default Table;
