import { Dialog, DialogPanel } from "@headlessui/react";
import React from "react";
import { AiOutlineClose as X } from "react-icons/ai";
import { create } from "zustand";

import { cn } from "lib/utils";

export const MAP_SIZE_CLASS = {
  xs: "max-w-sm",
  sm: "max-w-[551px]",
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
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className={cn(
              "data-[closed]:transform-[scale(95%)] relative min-h-screen w-full bg-[#30F1FF1F] p-6 drop-shadow-sm backdrop-blur duration-300 ease-out data-[closed]:opacity-0 md:h-full md:min-h-fit md:rounded-lg md:p-14",
              MAP_SIZE_CLASS[config?.size || "base"]
            )}
          >
            <button
              type="button"
              onClick={close}
              className="group absolute right-6 top-6"
            >
              <X className="h-auto w-4 transition-all group-hover:fill-mint" />
            </button>
            {typeof config?.title !== "undefined" && (
              <div className="text-xl font-semibold">{config?.title}</div>
            )}

            <div className="mt-6">{config?.component}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalMarker;
