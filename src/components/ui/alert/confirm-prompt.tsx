import { motion } from "framer-motion";

import { useAppDispatch, useAppSelector, useEscapeKey } from "lib/hooks";
import { setPromptState } from "lib/slice/confirm-prompt";

import Button from "../button";
import styles from "./styles.module.scss";

export const useConfirmPrompt = () => {
  const dispatch = useAppDispatch();

  const { showPrompt } = useAppSelector((state) => state.confirmPrompt);

  const setShowPrompt = (val: boolean) => {
    dispatch(setPromptState(val));
  };

  return { showPrompt, setShowPrompt };
};

interface IConfirmPrompt {
  confirmLeave: () => void;
}

const ConfirmPrompt = ({ confirmLeave }: IConfirmPrompt) => {
  const { showPrompt, setShowPrompt } = useConfirmPrompt();

  useEscapeKey(() => setShowPrompt(false));

  if (!showPrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", duration: 0.4 }}
      className="fixed left-0 top-0 z-[999] flex h-screen w-screen items-center justify-center bg-[#011217] bg-opacity-[90%]"
    >
      <div className={styles["confirm-prompt"]}>
        <div className="space-y-3">
          <p className="heading">Are you sure you want to leave?</p>
          <p className="text-[14px]">
            You have unsaved changes. If you navigate away now, all unsaved data
            will be lost.
          </p>
        </div>

        <div className="flex gap-2">
          <Button buttonType="secondary" onClick={() => setShowPrompt(false)}>
            Cancel
          </Button>
          <Button onClick={confirmLeave}>OK</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmPrompt;
