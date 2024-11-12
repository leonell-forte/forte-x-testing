import classNames from "classnames";
import { InputHTMLAttributes, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "../../lib/hooks";
import arrow from "../../assets/images/icons/arrow.svg";
import Checkbox from "./checkbox";
import Loader from "./spinner/spinner";

interface IOption {
  label: string;
  value: string;
}

interface IDropdownProp extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  options: IOption[];
  value?: string | string[];
  handleSelect?: (value: string) => void;
  isArray?: boolean;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
}

const Dropdown = ({
  className,
  options,
  handleSelect,
  isArray,
  loading,
  error,
  helperText,
  ...props
}: IDropdownProp) => {
  const [showList, setShowList] = useState(false);

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setShowList(false));

  return (
    <div className={classNames("w-full", className)}>
      <div
        ref={dropdownRef}
        className={classNames(
          "relative h-[56px] w-full rounded-[8px] border border-white px-4 flex items-center justify-between",
          className,
          error && "!border-[#e61a1a]",
          props.disabled && "border-[#787878] text-[#333c3d]"
        )}
      >
        <input
          type="text"
          className={classNames(
            "bg-transparent border-none outline-none w-[90%] placeholder:text-white/50 capitalize",
            error && "placeholder:!text-[#e61a1a]/50"
          )}
          {...props}
          value={
            isArray
              ? props.value?.length
                ? `${props.value?.length} selected`
                : ""
              : props.value
          }
          readOnly
        />
        {!props.disabled && (
          <button
            disabled={props.disabled}
            type="button"
            onClick={() => setShowList((prev) => !prev)}
            className="px-1.5"
          >
            <img alt="arrow" src={arrow} />
          </button>
        )}

        <motion.ul
          initial={{ opacity: 0 }}
          animate={showList ? { opacity: 1 } : { opacity: 0, display: "none" }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          className="absolute top-16 left-0 rounded-[4px] bg-white w-full overflow-hidden shadow-md z-10"
        >
          {loading ? (
            <div className="w-full h-[100px] flex items-center justify-center">
              <Loader dark />
            </div>
          ) : (
            options.map((item, index) => {
              const { label, value } = item;
              return isArray ? (
                <div key={index} className="pl-2">
                  <Checkbox
                    checked={props?.value?.includes(value)}
                    onChange={() => {
                      handleSelect!(value);
                    }}
                    dark
                    label={label}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleSelect!(value);
                    setShowList(false);
                  }}
                  key={index}
                  className="w-full text-left"
                >
                  <li className="text-black py-1.5 px-2.5 hover:bg-grey transition-all">
                    {label}
                  </li>
                </button>
              );
            })
          )}
        </motion.ul>
      </div>
      {helperText && (
        <div className="pl-4 pt-1">
          <p className="text-[#e61a1a] text-[12px]">{helperText}</p>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
