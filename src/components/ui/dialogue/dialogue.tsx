"use client";

import { ReactNode } from "react";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { useEscapeKey } from "../../../lib/hooks";
import close from "../../../assets/images/icons/close.svg";
import classNames from "classnames";

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
        "w-screen overflow-scroll py-12 px-4 h-screen flex items-start justify-center bg-[#011217] fixed bg-opacity-[90%] top-0 left-0 z-50",
        center && "items-center",
      )}
    >
      <div
        className={classNames(
          styles["dialogue-content"],
          title ? "p-10" : "px-10 pb-10",
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4"
        >
          <img
            alt="close"
            src={close}
          />
        </button>

        {title && <p className="font-semibold text-[20px]">{title}</p>}

        <div className="mt-12">{children}</div>
      </div>
    </motion.div>
  ) : (
    <></>
  );
};

export default Dialogue;
