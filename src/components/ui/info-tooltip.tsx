import classNames from "classnames";
import { motion } from "framer-motion";

import { Tooltip } from "./tooltip/Tooltip";

type Props = {
  tooltip: string;
  size?: "sm" | "lg";
};

const InfoTooltip = ({ tooltip, size = "sm" }: Props) => {
  return (
    <Tooltip title={tooltip} placement="top">
      <motion.div
        className={classNames([
          "info-tooltip-icon flex h-4 w-4 cursor-default items-center justify-center rounded-full border-[#8aa9b0] text-[10px] font-bold text-[#8aa9b0]",
          size === "sm"
            ? "h-4 w-4 border"
            : "h-[26.7px] w-[26.7px] border-2 text-[18px]",
        ])}
      >
        i
      </motion.div>
    </Tooltip>
  );
};

export default InfoTooltip;
