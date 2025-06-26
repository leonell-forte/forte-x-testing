import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { type ReactNode } from "react";
import { create } from "zustand";

import X from "@/assets/images/icons/close.svg?react";
import { useConfirmPrompt } from "@/components/ui/alert/confirm-prompt-v2";
import { cn } from "@/lib/utils";

export const MAP_SIZE_CLASS = {
  xs: "max-w-sm",
  sm: "max-w-[551px]",
  base: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-3xl",
  "3xl": "max-w-4xl",
};

export type TModalConfig = {
  component: React.ReactNode | null;
  size?: keyof typeof MAP_SIZE_CLASS;
  title?: ReactNode;
  panelClassName?: string;
  titleClassName?: string;
};

export type TModalState = {
  isOpen: boolean;
  showPromptOnClose: boolean;
  config?: TModalConfig;
  open: (config: TModalConfig) => void;
  setShowPromptOnClose: (val: boolean) => void;
  close: () => void;
};

export const useModal = create<TModalState>()((set) => ({
  isOpen: false,
  config: undefined,
  showPromptOnClose: false,
  open: (config) => set((state) => ({ ...state, isOpen: true, config })),
  setShowPromptOnClose: (value) =>
    set((state) => ({ ...state, showPromptOnClose: value })),
  close: () => set(() => ({ isOpen: false })),
}));

const ModalMarker = () => {
  const { isOpen, close, config, showPromptOnClose } = useModal();
  const { open: openConfirmPrompt } = useConfirmPrompt();
  const onClose = () => {
    if (showPromptOnClose) {
      openConfirmPrompt();
      return;
    }
    close();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-40 focus:outline-none"
        onClose={onClose}
        transition
      >
        <div
          className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80"
          aria-hidden="true"
        >
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel
              transition
              className={cn(
                "data-[closed]:transform-[scale(95%)] md:rounded-5 relative my-4 min-h-screen w-full bg-[#30F1FF1F] p-6 drop-shadow-sm backdrop-blur duration-300 ease-out data-[closed]:opacity-0 md:h-full md:min-h-fit md:p-14",
                MAP_SIZE_CLASS[config?.size || "base"],
                config?.panelClassName
              )}
            >
              <button
                type="button"
                onClick={onClose}
                className="group absolute right-6 top-6 ring-offset-1 focus:outline-2 focus:outline-white focus:ring-1 focus:ring-white"
                aria-label="Close modal"
              >
                <X
                  className="group-hover:fill-mint group-focus:fill-mint w-[14px] transition-all"
                  aria-hidden="true"
                />
              </button>

              {typeof config?.title !== "undefined" && (
                <DialogTitle
                  className={cn(
                    "text-[24px] font-semibold",
                    config?.titleClassName
                  )}
                >
                  {config?.title}
                </DialogTitle>
              )}

              <div className="mt-6">{config?.component}</div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ModalMarker;
