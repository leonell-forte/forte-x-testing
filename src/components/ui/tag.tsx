import { MouseEvent } from "react";
import close from "../../assets/images/icons/close.svg";
import classNames from "classnames";

interface ITagProps {
  label?: string;

  dark?: boolean;

  handleRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Tag = ({ label, dark, handleRemove }: ITagProps) => {
  return (
    <div
      className={classNames(
        "rounded-[4px] bg-white bg-opacity-[30%] h-8 px-2.5 flex items-center w-fit gap-2.5 z-20",
        dark && "!bg-forest-green",
      )}
    >
      <span>{label}</span>

      <button
        type="button"
        onClick={handleRemove}
      >
        <img
          alt="close"
          src={close}
        />
      </button>
    </div>
  );
};

export default Tag;
