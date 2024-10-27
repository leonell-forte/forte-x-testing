"use client";

import classNames from "classnames";
import React from "react";
import { motion } from "framer-motion";

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
        "relative w-[22px] h-3 rounded-[30px] flex items-center transition-all border-[1.3px]",
        on ? (disabled ? "bg-disabled" : "bg-mint") : "bg-transparent",
        disabled ? "border-disabled" : "border-mint"
      )}
    >
      <motion.div
        initial={on ? { left: 11 } : { left: 1 }}
        animate={on ? { left: 11 } : { left: 1 }}
        className={classNames(
          "absolute w-1 h-1 rounded-full p-1 flex items-center justify-center"
        )}
      >
        <div
          className={classNames(
            "flex-shrink-0 w-[7px] h-[7px] rounded-full transition-all",
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
