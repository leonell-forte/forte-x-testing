import classNames from "classnames";
import { MouseEvent } from "react";

import close from "assets/images/icons/close.svg";

interface ITagProps {
  label?: string;

  dark?: boolean;

  handleRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Tag = ({ label, dark, handleRemove }: ITagProps) => {
  return (
    <div
      className={classNames(
        "z-10 flex h-8 w-fit items-center gap-2.5 rounded-[4px] bg-white bg-opacity-[30%] px-2.5",

        dark && "!bg-forest-green"
      )}
    >
      <span>{label}</span>

      <button type="button" onClick={handleRemove}>
        <img alt="close" src={close} />
      </button>
    </div>
  );
};

export default Tag;
