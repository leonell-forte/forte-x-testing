"use client";

import React, { ReactNode, useEffect } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEscapeKey } from "@/lib/hooks";

export interface IDialogueProps {
  children?: ReactNode;
  title?: string;
  isVisible?: boolean;
  handleClose?: () => void;
}

const Dialogue = ({
  children,
  title,
  isVisible,
  handleClose,
}: IDialogueProps) => {
  useEscapeKey(handleClose!);
  return (
    isVisible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="w-screen h-screen flex items-center justify-center bg-[#011217] fixed bg-opacity-[90%] top-0 left-0 z-50"
      >
        <div className={styles["dialogue-content"]}>
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4"
          >
            <Image
              width={14}
              height={14}
              alt="close"
              src="/images/icons/close.svg"
            />
          </button>
          <p className="font-semibold text-[20px]">{title}</p>
          <div className="mt-2.5">{children}</div>
        </div>
      </motion.div>
    )
  );
};

export default Dialogue;
