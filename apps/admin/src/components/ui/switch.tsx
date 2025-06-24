"use client";

import classNames from "classnames";
import { motion } from "framer-motion";
import React from "react";

interface ISwitchProps {
  on?: boolean;
  handleSwitch?: () => void;
  disabled?: boolean;
}

const Switch = ({ on, disabled, handleSwitch }: ISwitchProps) => {
  return (
    <button
      onClick={handleSwitch}
      className={classNames(
        "relative flex h-3 w-[22px] items-center rounded-[30px] border-[1.3px] transition-all",
        on ? (disabled ? "bg-disabled" : "bg-mint") : "bg-transparent",
        disabled ? "border-disabled" : "border-mint"
      )}
    >
      <motion.div
        initial={on ? { left: 11 } : { left: 1 }}
        animate={on ? { left: 11 } : { left: 1 }}
        className={classNames(
          "absolute flex h-1 w-1 items-center justify-center rounded-full p-1"
        )}
      >
        <div
          className={classNames(
            "h-[7px] w-[7px] flex-shrink-0 rounded-full transition-all",

            on
              ? disabled
                ? "bg-white"
                : "bg-forest-green"
              : disabled
                ? "bg-disabled"
                : "bg-mint"
          )}
        ></div>
      </motion.div>
    </button>
  );
};

export default Switch;
