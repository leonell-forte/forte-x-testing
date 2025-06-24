import { Skeleton } from "@mui/material";
import classNames from "classnames";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import InfoVertical from "./info-vertical/InfoVertical";

type Title = {
  title?: string;
};

type IProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  isLoading?: boolean;
};

type Details = {
  label: string;
  value?: ReactNode;
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
          "animate-fadeIn bg-panel relative overflow-hidden rounded-[.5em] p-6 text-[14px] transition-all",
          className,
          props.onClick && "cursor-pointer hover:brightness-75"
        )}
        {...props}
      >
        {title && (
          <p className="mb-4 truncate text-[18px] font-bold capitalize">
            {title}
          </p>
        )}
        {props.children}
      </div>
    );
  },

  Group: ({ children, cols, className, ...props }: Group) => {
    return (
      <div
        className={classNames(
          "grid gap-6",

          className
        )}
        style={{ gridTemplateColumns: `repeat(${cols || 1}, minmax(0, 1fr))` }}
        {...props}
      >
        {children}
      </div>
    );
  },

  Details: ({ label, value, capitalize }: Details) => {
    return (
      <InfoVertical label={label}>
        <p className={classNames("truncate", capitalize && "capitalize")}>
          {value || "-"}
        </p>
      </InfoVertical>
    );
  },
};

export default Cards;
