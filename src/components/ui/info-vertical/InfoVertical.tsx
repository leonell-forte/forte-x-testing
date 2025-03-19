import React from "react";
import type { IconType } from "react-icons";

type Props = {
  label: string;
  isLoading?: boolean;
  type?: "normal" | "link";
  hrefLink?: string;
  leadingIcon?: IconType;
  children: React.ReactNode;
};

function InfoVertical({
  type = "normal",
  hrefLink,
  label,
  isLoading,
  children,
  leadingIcon: Icon,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="text-xs opacity-70">{label}</div>
      {isLoading ? (
        <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
      ) : (
        <>
          {type === "normal" ? (
            <span className="flex items-center space-x-2">
              {typeof Icon !== "undefined" ? <Icon /> : null}
              {children}
            </span>
          ) : (
            <a
              href={hrefLink}
              className="link flex items-center rounded-[0.25rem] py-[0.125rem] text-sm font-medium"
            >
              {typeof Icon !== "undefined" ? <Icon className="mr-1" /> : null}
              {children}
            </a>
          )}
        </>
      )}
    </div>
  );
}

export default InfoVertical;
