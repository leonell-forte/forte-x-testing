import classNames from "classnames";

import Trend from "@/assets/images/icons/trend.svg?react";
import InfoTooltip from "@/components/ui/info-tooltip";

export type DataTextProps = {
  size?: "sm" | "lg";
  label: string;
  value: string | number;
  percentage?: number;
  trendLabel?: string;
  tooltip?: string;
};

const DataText = ({
  size = "lg",
  label,
  value,
  percentage,
  trendLabel = "from last month",
  tooltip,
}: DataTextProps) => {
  const isPositive = percentage !== undefined && percentage > 0;
  return (
    <div className="data-text-component">
      <div className="flex items-center gap-2">
        <p
          className={classNames(
            "print-wrap-text truncate font-light",
            size === "sm" ? "text-[16px]" : "text-[14px]"
          )}
        >
          {label}
        </p>
        {tooltip && <InfoTooltip tooltip={tooltip} size="sm" />}
      </div>
      <p
        className={classNames(
          "data-text-value font-semibold",
          size === "sm" ? "text-[24px]" : "text-[28px]"
        )}
      >
        {value}
      </p>
      {percentage !== undefined && (
        <div className="print-trend-container flex items-center gap-2">
          {!!percentage && (
            <div className="print-trend-icon flex h-4 w-4 items-center justify-center">
              <Trend
                className={classNames(
                  isPositive ? "fill-mint" : "rotate-180 fill-red-200",
                  "print-visible"
                )}
                width="16"
                height="16"
                style={{ minWidth: "16px", minHeight: "16px" }}
              />
            </div>
          )}
          <p
            className={classNames(
              "print-wrap-text truncate font-light",
              isPositive || !percentage ? "text-mint" : "text-red-200"
            )}
          >
            {percentage.toFixed(2)}%{" "}
            <span className="print-wrap-text text-white/50">{trendLabel}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DataText;
