import { Dialog, DialogPanel } from "@headlessui/react";
import { create } from "zustand";

import { cn } from "@/lib/utils";

import Button from "../button";
import { useModal } from "../dialogue/v2/Modal";

type TConfirmPrompt = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useConfirmPrompt = create<TConfirmPrompt>()((set) => ({
  isOpen: false,
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
}));

const ConfirmPromptV2 = () => {
  const { isOpen, close } = useConfirmPrompt();
  const { close: closeParent } = useModal();

  const confirmLeave = () => {
    close();
    closeParent();
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-[100] focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className={cn(
              "data-[closed]:transform-[scale(95%)] relative h-screen w-full max-w-2xl space-y-4 bg-[#30F1FF1F] p-6 drop-shadow-sm backdrop-blur duration-300 ease-out data-[closed]:opacity-0 md:my-12 md:h-full md:rounded-lg md:p-14"
            )}
          >
            <div className="space-y-3">
              <p className="heading">Are you sure you want to leave?</p>
              <p className="text-[14px]">
                You have unsaved changes. If you navigate away now, all unsaved
                data will be lost.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button buttonType="secondary" onClick={close}>
                Cancel
              </Button>
              <Button onClick={confirmLeave}>Leave</Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmPromptV2;
