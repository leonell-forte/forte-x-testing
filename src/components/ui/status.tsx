import classNames from "classnames";
import { PropsWithChildren } from "react";

export type StatusVariant = "primary" | "danger" | "warning";

type PropTypes = PropsWithChildren & {
  variant?: StatusVariant;
};

const Status = ({ variant = "primary", children }: PropTypes) => {
  return (
    <div
      className={classNames(
        "flex h-6 w-fit items-center justify-center rounded-full px-4 text-[10px]",
        variants[variant as StatusVariant]
      )}
    >
      {children}
    </div>
  );
};

export default Status;

const variants = {
  primary: "text-green-300 bg-[#c3eeec]",
  danger: "bg-[#ead0d0] text-red-300",
  warning: "bg-orange-100 text-orange-500",
};
