import classNames from "classnames";
import { PropsWithChildren } from "react";

export type StatusVariant = keyof typeof variants;

type PropTypes = PropsWithChildren & {
  variant?: StatusVariant;
};

const Status = ({ variant = "primary", children }: PropTypes) => {
  return (
    <div
      className={classNames(
        "flex h-6 w-fit items-center justify-center rounded-full px-4 text-[10px] capitalize",
        variants[variant as StatusVariant]
      )}
    >
      {children}
    </div>
  );
};

export default Status;

const variants = {
  primary: "text-[#173E76] bg-[#C2D6F3]",
  danger: "bg-[#ead0d0] text-red-500",
  warning: "text-[#655D21] bg-[#ECE7C5]",
  success: "bg-[#C3EEEC] text-[#1D6965]",
  neutral: "bg-[#17262D4D] text-white ",
};
