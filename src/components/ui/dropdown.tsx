import { capitalize } from "@mui/material";
import classNames from "classnames";
import { motion } from "framer-motion";
import { InputHTMLAttributes, useMemo, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

import { useOutsideClick } from "lib/hooks";
import { cn } from "lib/utils";

import Checkbox from "./checkbox";
import Loader from "./spinner/spinner";
import Tag from "./tag";

export interface IOption {
  label: string;

  value: string;
}

interface IDropdownProp extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;

  options: IOption[];

  value?: string | string[];

  handleSelect?: (value: string | string[]) => void;

  isMultiSelect?: boolean;

  loading?: boolean;

  error?: boolean;

  helperText?: string;

  showAsTags?: boolean;

  enableSearch?: boolean;

  tooltip?: string;
}

const Dropdown = ({
  className,

  options,

  handleSelect,

  isMultiSelect,

  loading,

  error,

  helperText,

  showAsTags,

  enableSearch,

  tooltip,

  ...props
}: IDropdownProp) => {
  const [focused, setFocused] = useState(false);

  const [showList, setShowList] = useState(false);

  const [search, setSearch] = useState("");

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isHovered, setIsHovered] = useState(false);

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    setFocused(false);
    setShowList(false);
  });

  const displayValue =
    isMultiSelect && Array.isArray(props.value)
      ? props.value.length
        ? `${props.value.length} selected`
        : ""
      : (props.value as string);

  const optionList = useMemo(
    () =>
      options.filter((item) =>
        item.label?.toLowerCase().includes(search?.toLowerCase())
      ),

    [search, options]
  );

  return (
    <div
      className={classNames(
        "relative w-full",

        className
      )}
    >
      <div
        ref={dropdownRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        className={classNames(
          "relative w-full cursor-pointer rounded-lg border px-3.5 py-2.5",

          className,
          props.disabled ? "border-disabled" : "border-white"
        )}
      >
        <div className="relative">
          <button
            disabled={props.disabled || props?.readOnly}
            type="button"
            onClick={() => {
              setShowList(true);
              setFocused(true);
            }}
            className={classNames(
              "relative flex h-full w-full items-center gap-2.5 outline-none"
            )}
          >
            {showAsTags && isMultiSelect ? (
              <div className="flex w-[80%] flex-1 flex-shrink flex-wrap gap-2 truncate text-ellipsis">
                {(props.value as string[]).map((item, index) => {
                  const label = options?.find(
                    (option) => option.value === item
                  )?.label;

                  return (
                    <Tag
                      disabled={props.disabled}
                      dark
                      handleRemove={(e) => {
                        e.stopPropagation();

                        handleSelect!(
                          (props.value as string[]).filter(
                            (val) => val !== item
                          )
                        );
                      }}
                      key={index}
                      label={label}
                    />
                  );
                })}
                <input
                  type="text"
                  className={classNames(
                    "w-[80%] flex-1 flex-shrink truncate text-ellipsis border-none bg-transparent font-medium outline-none placeholder:font-medium placeholder:text-white/50 disabled:text-white",

                    error && "placeholder:!text-[#fff]/50"
                  )}
                  {...props}
                  value={
                    focused && enableSearch
                      ? search
                      : capitalize(displayValue || "")
                  }
                  onChange={(e) => setSearch(e.target.value)}
                  readOnly={!enableSearch}
                />
              </div>
            ) : (
              <input
                type="text"
                className={classNames(
                  "w-[80%] flex-1 flex-shrink truncate text-ellipsis border-none bg-transparent font-medium outline-none placeholder:font-medium placeholder:text-white/50 disabled:text-white",

                  error && "placeholder:!text-[#fff]/50"
                )}
                {...props}
                value={
                  focused && enableSearch
                    ? search
                    : capitalize(displayValue || "")
                }
                onChange={(e) => setSearch(e.target.value)}
                readOnly={!enableSearch}
              />
            )}

            <HiChevronDown
              className={classNames(
                "h-auto w-[20px] flex-shrink-0 transition-all",
                showList && "rotate-180",
                props.disabled ? "fill-disabled" : "fill-white"
              )}
            />
          </button>
          {tooltip && isHovered && props.disabled && (
            <div
              className="absolute z-[1000] rounded-md bg-slate-500/40 p-2"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y - 40}px`,
              }}
            >
              <p className="flex-shrink-0 whitespace-nowrap text-[10px]">
                {tooltip}
              </p>
            </div>
          )}
        </div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={showList ? { opacity: 1 } : { opacity: 0, display: "none" }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          className="hide-scroll absolute left-0 top-[100%] z-[999] mt-1.5 max-h-[400px] w-full min-w-[300px] space-y-2 overflow-hidden overflow-y-scroll rounded-[4px] bg-white/90 p-3.5 shadow-md backdrop-blur-lg"
        >
          <div>
            {loading ? (
              <div className="flex h-[100px] w-full items-center justify-center">
                <Loader dark />
              </div>
            ) : (
              optionList.map((item, index) => {
                const { label, value } = item;
                const isSelected =
                  props?.value === label || props?.value === value;

                return isMultiSelect ? (
                  <div key={index} className="px-2.5 py-1.5">
                    <Checkbox
                      labelClass="text-[14px]"
                      checked={props?.value?.includes(value)}
                      onChange={() => {
                        let newValue;

                        if (props.value?.includes(value)) {
                          newValue = (props.value as string[]).filter(
                            (item) => item !== value
                          );
                        } else {
                          newValue = [...(props.value as string[]), value];
                        }

                        handleSelect!(newValue);
                        setSearch("");
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

                      setFocused(false);
                    }}
                    key={index}
                    className="w-full text-left"
                  >
                    <li
                      className={cn(
                        "truncate rounded-[8px] p-2 text-sm text-black transition duration-500",
                        isSelected ? "bg-mint" : "hover:text-mint"
                      )}
                    >
                      {label}
                    </li>
                  </button>
                );
              })
            )}
          </div>
        </motion.ul>
      </div>

      {helperText && (
        <div className="absolute pl-4">
          <p className="line-clamp-1 text-[12px] font-medium text-alert">
            {helperText}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
