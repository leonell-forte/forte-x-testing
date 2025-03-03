import { motion } from "framer-motion";
import { AiOutlineClose as X } from "react-icons/ai";

import { useAppDispatch, useAppSelector, useEscapeKey } from "lib/hooks";
import { TPrompt, setConfig, setShow } from "lib/slice/custom-prompt";
import { cn } from "lib/utils";

import Button from "../button";
import styles from "./styles.module.scss";

export const useCustomPrompt = () => {
  const dispatch = useAppDispatch();

  const { show, config } = useAppSelector((state) => state.customPrompt);

  const open = (config: TPrompt["config"]) => {
    dispatch(setShow(true));
    dispatch(setConfig(config));
  };

  const close = () => dispatch(setShow(false));
  return { show, open, close, config };
};

const CustomPrompt = () => {
  const { show, close, config } = useCustomPrompt();

  useEscapeKey(close);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", duration: 0.4 }}
      className="fixed left-0 top-0 z-[999] flex h-screen w-screen items-center justify-center bg-[#011217] bg-opacity-[90%]"
      role="dialog"
    >
      <div className={cn(styles["confirm-prompt"], "!max-w-screen-md")}>
        <div className="space-y-3 text-left">
          <p className="heading">{config.title}</p>
          {config.subText && <p className="text-[14px]">{config.subText}</p>}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          className="group absolute right-4 top-4"
        >
          <X className="h-auto w-5 transition-all group-hover:fill-mint" />
        </button>

        <div className="ml-auto flex justify-end gap-2">
          <Button
            buttonType="secondary"
            onClick={() => (config.onNo ? config.onNo() : close())}
          >
            {config.noLabel}
          </Button>
          <Button
            onClick={() => {
              config.onYes();
              close();
            }}
          >
            {config.yesLabel}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomPrompt;
