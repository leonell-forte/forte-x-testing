import { RefObject, TableHTMLAttributes } from "react";
import Spinner from "./spinner/spinner";
import classNames from "classnames";
import useScroll from "./horizontal-scroller/useScroll";

interface ITableProp extends TableHTMLAttributes<HTMLTableElement> {}

interface ITableHeadProps extends TableHTMLAttributes<HTMLHeadElement> {}

interface ITableContainerProp extends ITableProp {
  isEmpty?: boolean;

  isLoading?: boolean;

  ref?: RefObject<HTMLDivElement>;
}

interface ITableCellProps extends TableHTMLAttributes<HTMLTableCellElement> {
  small?: boolean;
}

const Table = {
  Container: ({
    children,

    isEmpty,

    isLoading,

    ref,

    ...props
  }: ITableContainerProp) => {
    const { scrollValue } = useScroll();

    return (
      <div
        style={{
          transform: `translateX(-${scrollValue}%)`,
        }}
        ref={ref}
        className="w-full pb-8 relative"
      >
        <table
          {...props}
          className="w-full rounded-t-[8px]"
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
        className={classNames(
          "text-left bg-white text-[14px] font-medium truncate",
          props.className,
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
          "px-4 py-[19px] border-b max-w-[300px] truncate text-[14px] overflow-visible",
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
        className={classNames("!text-black px-4 py-5", small && "!py-3")}
      >
        {children}
      </th>
    );
  },
};

export default Table;
