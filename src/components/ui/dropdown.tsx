import { capitalize } from "@mui/material";
import classNames from "classnames";
import { motion } from "framer-motion";
import { InputHTMLAttributes, useMemo, useRef, useState } from "react";

import arrow from "assets/images/icons/chevron.svg";

import { useOutsideClick } from "lib/hooks";
import { cn } from "lib/utils";

import Checkbox from "./checkbox";
import SearchInput from "./search-input";
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

  small?: boolean;
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

  small,

  ...props
}: IDropdownProp) => {
  const [showList, setShowList] = useState(false);

  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setShowList(false));

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
        className={classNames(
          "relative w-full cursor-pointer rounded-lg border border-white px-3.5 py-2.5",

          className,
          error && "!border-alert"
          // showAsTags ? "p-3.5" : "px-3.5 py-2.5"
          // small ? "h-11" : "h-[50px]"
        )}
      >
        <button
          disabled={props.disabled || props?.readOnly}
          type="button"
          onClick={() => setShowList((prev) => !prev)}
          className={classNames(
            "relative flex h-full w-full items-center gap-2.5 outline-none"
          )}
        >
          {showAsTags && isMultiSelect ? (
            <div className="flex w-[80%] flex-1 flex-shrink flex-wrap gap-2 truncate text-ellipsis">
              {props.value?.length ? (
                (props.value as string[]).map((item, index) => {
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
                })
              ) : (
                <input
                  className="pointer-events-none w-[90%] truncate border-none bg-transparent font-medium outline-none placeholder:font-medium placeholder:text-white/50"
                  type="text"
                  {...props}
                />
              )}
            </div>
          ) : (
            <input
              type="text"
              className={classNames(
                "pointer-events-none w-[80%] flex-1 flex-shrink truncate text-ellipsis border-none bg-transparent font-medium outline-none placeholder:font-medium placeholder:text-white/50 disabled:text-white",

                error && "placeholder:!text-[#fff]/50"
              )}
              {...props}
              value={capitalize(displayValue || "")}
              readOnly
            />
          )}

          <img
            alt="arrow"
            src={arrow}
            className={classNames(
              "flex-shrink-0 transition-all",
              showList && "rotate-180"
            )}
          />
        </button>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={showList ? { opacity: 1 } : { opacity: 0, display: "none" }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          className="hide-scroll absolute left-0 top-[100%] z-[999] mt-1.5 max-h-[400px] w-full min-w-[300px] space-y-2 overflow-hidden overflow-y-scroll rounded-[4px] bg-white/90 p-3.5 shadow-md backdrop-blur-lg"
        >
          {enableSearch && (
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              dark
            />
          )}

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
