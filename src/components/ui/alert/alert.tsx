import styles from "./styles.module.scss";
import close from "../../../assets/images/icons/close.svg";
import success from "../../../assets/images/icons/success.svg";
import { motion } from "framer-motion";
import { useAlert } from "../../../lib/hooks";
import { IAlert } from "../../../lib/slice/alert";
const Alert = () => {
  const { alert, setAlert } = useAlert();
  const { status, message, title }: IAlert = alert;

  const variants = (status: boolean) => {
    switch (status) {
      case true:
        return { x: 0 };
      case false:
        return { x: 595 };
    }
  };

  const handleClose = () => {
    setAlert({ status: "", message: "", title: "" });
  };

  return (
    <div className="absolute z-50 top-4 right-0 w-full max-w-[545px] px-4 hover:scale-[1.01] transition-all pointer-events-none">
      <motion.div
        initial={variants(!!message)}
        animate={variants(!!message)}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className={styles.alert}
      >
        <div className="relative  py-9 px-10 flex gap-6 items-start">
          {status === "success" && <img src={success} alt="" />}
          <div className="space-y-2">
            {title && <p className="font-semibold text-[20px]">{title}</p>}
            {message && <p className="text-[14px]">{message}</p>}
          </div>
          <button className="absolute top-3 right-3" onClick={handleClose}>
            <img src={close} alt="" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Alert;
