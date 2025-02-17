import classNames from "classnames";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";

import close from "assets/images/icons/close.svg";
import success from "assets/images/icons/success.svg";

import { useAlert } from "lib/hooks";
import { IAlert } from "lib/slice/alert";

import styles from "./styles.module.scss";

const Alert = () => {
  const { alert, setAlert } = useAlert();
  const { status, message, title }: IAlert = alert;

  const variants = (status: boolean) => {
    switch (status) {
      case true:
        return { x: 0, opacity: 1 };
      case false:
        return { x: 595, opacity: 0 };
    }
  };

  const handleClose = useCallback(() => {
    setAlert({ status: "", message: "", title: "" });
  }, [setAlert]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, handleClose]);

  return (
    <div
      className={classNames(
        "absolute right-0 top-4 z-[999] w-full max-w-[545px] overflow-hidden px-4 transition-all hover:scale-[1.01]",

        !status && "pointer-events-none"
      )}
    >
      <motion.div
        initial={variants(!!message)}
        animate={variants(!!message)}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className={styles.alert}
      >
        <div className="relative flex items-start gap-6 px-10 py-9">
          {status === "success" && <img src={success} alt="" />}
          <div className="space-y-2">
            {title && <p className="heading">{title}</p>}
            {message && <p className="text-[14px]">{message}</p>}
          </div>
          <button
            className="absolute right-3 top-3"
            onClick={(e) => {
              e.stopPropagation();

              handleClose();
            }}
          >
            <img src={close} alt="" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Alert;
