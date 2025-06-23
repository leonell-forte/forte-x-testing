import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useRef } from "react";

import { ReactComponent as X } from "assets/images/icons/close.svg";

import { useAppDispatch, useAppSelector } from "lib/hooks";
import { TPrompt, setConfig, setShow } from "lib/slice/custom-prompt";
import { cn } from "lib/utils";

import Button from "../button";

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
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const { show, close, config } = useCustomPrompt();
  return (
    <Dialog
      open={show}
      onClose={close}
      as="div"
      initialFocus={initialFocusRef}
      className="relative z-[100] focus:outline-none"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      transition
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80"
        aria-hidden="true"
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cn(
              "data-[closed]:transform-[scale(95%)] relative h-screen w-full max-w-2xl bg-[#30F1FF1F] p-6 drop-shadow-sm backdrop-blur duration-300 ease-out data-[closed]:opacity-0 md:my-12 md:h-full md:rounded-lg md:p-14"
            )}
          >
            {/* Header */}
            <div className="w-full space-y-3 text-left">
              <DialogTitle id="dialog-title" className="heading">
                {config.title}
              </DialogTitle>
              {config.subText && (
                <Description id="dialog-description" className="text-[14px]">
                  {config.subText}
                </Description>
              )}
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="group absolute right-6 top-6 ring-offset-1 focus:outline-2 focus:outline-white focus:ring-1 focus:ring-white"
              aria-label="Close dialog"
            >
              <X
                className="h-auto w-[14px] transition-all group-hover:fill-mint group-focus:fill-mint"
                aria-hidden="true"
              />
            </button>

            {/* Action buttons */}
            <div
              className="ml-auto mt-8 flex justify-end gap-2"
              role="group"
              aria-label="Dialog actions"
            >
              <Button
                ref={initialFocusRef}
                buttonType="secondary"
                onClick={() => (config.onNo ? config.onNo() : close())}
                aria-label={config.noLabel}
              >
                {config.noLabel}
              </Button>
              <Button
                onClick={() => {
                  config.onYes();
                  close();
                }}
                aria-label={config.yesLabel}
              >
                {config.yesLabel}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomPrompt;
