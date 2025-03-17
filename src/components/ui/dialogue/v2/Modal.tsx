import { Dialog, DialogPanel } from "@headlessui/react";
import React from "react";
import { AiOutlineClose as X } from "react-icons/ai";
import { create } from "zustand";

import { cn } from "lib/utils";

import styles from "../styles.module.scss";

export const MAP_SIZE_CLASS = {
  xs: "max-w-sm",
  sm: "max-w-md",
  base: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-3xl",
};

type TModalConfig = {
  component: React.ReactNode | null;
  size?: keyof typeof MAP_SIZE_CLASS;
  title?: string;
};

type TModalState = {
  isOpen: boolean;
  config?: TModalConfig;
  open: (config: TModalConfig) => void;
  close: () => void;
};

export const useModal = create<TModalState>()((set) => ({
  isOpen: false,
  config: undefined,
  open: (config: TModalConfig) => set(() => ({ isOpen: true, config })),
  close: () => set(() => ({ isOpen: false })),
}));

const ModalMarker = () => {
  const { isOpen, close, config } = useModal();
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-40 focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cn(
              "data-[closed]:transform-[scale(95%)] w-full rounded-lg duration-300 ease-out data-[closed]:opacity-0",
              styles["dialogue-content"]
            )}
          >
            {typeof config?.title !== "undefined" ? (
              <div
                className={cn(
                  "flex items-center justify-between rounded-t-lg p-6"
                )}
              >
                <div className="text-lg font-semibold">{config?.title}</div>
                <button type="button" onClick={close} className="group">
                  <X className="h-auto w-5 transition-all group-hover:fill-mint" />
                </button>
              </div>
            ) : null}
            <div className="p-6">{config?.component}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalMarker;
