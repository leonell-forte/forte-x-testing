import classNames from "classnames";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline";
  isLoading?: boolean;
};

export default function Card({
  children,
  variant = "default",
  isLoading,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={classNames(
        "dashboard-card rounded-5 min-h-[300px] px-8 py-6",
        variant === "default"
          ? "bg-[#30F1FF1F] bg-opacity-15 backdrop-blur"
          : "border-panel border bg-transparent",
        props.className,
        isLoading &&
          "animate-pulse !bg-[#30F1FF1F] !bg-opacity-15 !backdrop-blur"
      )}
    >
      {!isLoading ? children : null}
    </div>
  );
}
