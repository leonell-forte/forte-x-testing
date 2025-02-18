import { Skeleton } from "@mui/material";
import classNames from "classnames";
import { HTMLAttributes, PropsWithChildren } from "react";

type Title = {
  title?: string;
};

type IProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  isLoading?: boolean;
};

type Details = {
  label: string;
  value?: string;
  capitalize?: boolean;
};

type Group = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  cols?: number;
};

const Cards = {
  Container: ({ className, isLoading, ...props }: IProps) => {
    if (isLoading)
      return (
        <div
          className={classNames(
            "grid grid-cols-1 gap-2.5 md:grid-cols-2",
            className
          )}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={150}
              className="rounded-[.5em]"
              sx={{
                backgroundColor: "#ffffff20",
              }}
            />
          ))}
        </div>
      );
    return (
      <div
        className={classNames(
          "grid grid-cols-1 gap-2.5 md:grid-cols-2",
          className
        )}
        {...props}
      >
        {props.children}
      </div>
    );
  },

  Card: ({ className, title, ...props }: IProps & Title) => {
    return (
      <div
        className={classNames(
          "relative animate-fadeIn overflow-hidden rounded-[.5em] bg-panel p-4 text-[14px] transition-all",
          className,
          props.onClick && "cursor-pointer hover:brightness-75"
        )}
        {...props}
      >
        <p className="mb-2 truncate text-[18px] font-bold capitalize">
          {title}
        </p>
        {props.children}
      </div>
    );
  },

  Group: ({ children, cols, className, ...props }: Group) => {
    return (
      <div
        className={classNames(
          "grid gap-2",
          cols && `grid-cols-1 sm:!grid-cols-${cols}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  },

  Details: ({ label, value, capitalize }: Details) => {
    return (
      <div>
        <p className="text-[12px] font-extralight text-gray-400">{label}</p>
        <p className={classNames("truncate", capitalize && "capitalize")}>
          {value || "-"}
        </p>
      </div>
    );
  },
};

export default Cards;
