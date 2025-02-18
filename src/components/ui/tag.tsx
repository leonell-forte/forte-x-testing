import { MouseEvent } from "react";
import { HiX } from "react-icons/hi";

import { cn } from "lib/utils";

interface ITagProps {
  label?: string;

  dark?: boolean;

  handleRemove?: (e: MouseEvent<HTMLButtonElement>) => void;

  disabled?: boolean;
}

const Tag = ({ label, dark, handleRemove, disabled }: ITagProps) => {
  return (
    <div
      className={cn(
        "z-10 flex w-fit items-center gap-1.5 rounded-[4px] bg-opacity-[30%] px-2.5 py-0.5 text-xs",

        dark ? "bg-[#546F6A] transition hover:bg-forest-green" : "bg-white"
      )}
    >
      <span>{label}</span>

      {!disabled && (
        <button type="button" onClick={handleRemove}>
          <HiX />
        </button>
      )}
    </div>
  );
};

export default Tag;
