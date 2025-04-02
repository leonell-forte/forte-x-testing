import { Dialog, DialogPanel } from "@headlessui/react";
import { AiOutlineClose as X } from "react-icons/ai";

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
  const { show, close, config } = useCustomPrompt();
  return (
    <Dialog
      open={show}
      as="div"
      className="relative z-[100] focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center">
          {" "}
          <DialogPanel
            transition
            className={cn(
              "data-[closed]:transform-[scale(95%)] relative h-screen w-full max-w-2xl bg-[#30F1FF1F] p-6 drop-shadow-sm backdrop-blur duration-300 ease-out data-[closed]:opacity-0 md:my-12 md:h-full md:rounded-lg md:p-14"
            )}
          >
            <div className="w-full space-y-3 text-left">
              <p className="heading">{config.title}</p>
              {config.subText && (
                <p className="text-[14px]">{config.subText}</p>
              )}
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
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomPrompt;
