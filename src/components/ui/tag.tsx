import { MouseEvent } from "react";
import close from "../../assets/images/icons/close.svg";

interface ITagProps {
  label?: string;
  handleRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Tag = ({ label, handleRemove }: ITagProps) => {
  return (
    <div className="rounded-[4px] bg-white bg-opacity-[30%] h-8 px-2.5 flex items-center w-fit gap-2.5 z-20">
      <span>{label}</span>
      <button
        type="button"
        onClick={handleRemove}
        className="flex-shrink-0"
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
