"use client";

import classNames from "classnames";
import { ReactNode, useRef } from "react";

import close from "assets/images/icons/close.svg";

import { useEscapeKey, useOutsideClick } from "lib/hooks";

import ConfirmPrompt, { useConfirmPrompt } from "../alert/confirm-prompt";
import styles from "./styles.module.scss";

export interface IDialogueProps {
  children?: ReactNode;

  title?: string;

  isVisible?: boolean;

  handleClose?: () => void;

  center?: boolean;

  confirmBeforeLeave?: boolean;

  canFullScreen?: boolean;

  hideClose?: boolean;
}

const Dialogue = ({
  children,

  title,

  isVisible,

  handleClose,

  center,

  confirmBeforeLeave,

  canFullScreen = true,

  hideClose,
}: IDialogueProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { setShowPrompt } = useConfirmPrompt();

  const closeDialogue = () => {
    if (confirmBeforeLeave) {
      setShowPrompt(true);
      return;
    }
    handleClose?.();
  };

  useEscapeKey(!hideClose ? closeDialogue : undefined);

  useOutsideClick(containerRef, () => {
    if (!hideClose) closeDialogue?.();
  });

  return isVisible ? (
    <>
      <ConfirmPrompt
        confirmLeave={() => {
          setShowPrompt(false);
          handleClose?.();
        }}
      />
      <div
        className={classNames(
          "fixed left-0 top-0 z-40 !mt-0 flex h-screen w-screen items-start justify-center overflow-y-auto bg-[#011217] bg-opacity-[90%] px-0 py-0 md:px-4 md:py-12",

          center && "items-center"
        )}
      >
        <div
          ref={containerRef}
          className={classNames(
            styles["dialogue-content"],

            title ? "p-10" : "px-10 pb-10",
            canFullScreen
              ? "min-h-screen rounded-none md:min-h-max md:rounded-lg"
              : "mx-4 h-auto rounded-lg md:mx-0"
          )}
        >
          {!hideClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeDialogue?.();
              }}
              className="absolute right-4 top-4"
            >
              <img alt="close" src={close} />
            </button>
          )}

          {title && <p className="text-[20px] font-semibold">{title}</p>}

          <div className="mt-12">{children}</div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Dialogue;
