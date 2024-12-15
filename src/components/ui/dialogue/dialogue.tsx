"use client";

import classNames from "classnames";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import close from "assets/images/icons/close.svg";

import { useEscapeKey } from "lib/hooks";

import styles from "./styles.module.scss";

export interface IDialogueProps {
  children?: ReactNode;

  title?: string;

  isVisible?: boolean;

  handleClose?: () => void;

  center?: boolean;
}

const Dialogue = ({
  children,

  title,

  isVisible,

  handleClose,

  center,
}: IDialogueProps) => {
  useEscapeKey(handleClose!);

  return isVisible ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", duration: 0.4 }}
      className={classNames(
        "fixed left-0 top-0 z-50 !mt-0 flex h-screen w-screen items-start justify-center overflow-scroll bg-[#011217] bg-opacity-[90%] px-4 py-12",

        center && "items-center"
      )}
    >
      <div
        className={classNames(
          styles["dialogue-content"],

          title ? "p-10" : "px-10 pb-10"
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4"
        >
          <img alt="close" src={close} />
        </button>

        {title && <p className="text-[20px] font-semibold">{title}</p>}

        <div className="mt-12">{children}</div>
      </div>
    </motion.div>
  ) : (
    <></>
  );
};

export default Dialogue;
