import { capitalize } from "@mui/material";
import classNames from "classnames";
import { motion } from "framer-motion";
import { InputHTMLAttributes, useMemo, useRef, useState } from "react";

import arrow from "assets/images/icons/chevron.svg";

import { useOutsideClick } from "lib/hooks";

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

  noHelperText?: boolean;

  showAsTags?: boolean;

  enableSearch?: boolean;
}

const Dropdown = ({
  className,

  options,

  handleSelect,

  isMultiSelect,

  loading,

  error,

  helperText,

  noHelperText,

  showAsTags,

  enableSearch,

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
        item.label.toLowerCase().includes(search.toLowerCase())
      ),

    [search, options]
  );

  return (
    <div
      className={classNames(
        "relative w-full",

        className,

        !noHelperText && "pb-5"
      )}
    >
      <div
        ref={dropdownRef}
        className={classNames(
          "relative h-[50px] w-full cursor-pointer rounded-[8px] border border-white",

          className,
          error && "!border-alert",
          showAsTags && "!h-fit"
        )}
      >
        <button
          disabled={props.disabled}
          type="button"
          onClick={() => setShowList((prev) => !prev)}
          className={classNames(
            "relative flex h-full min-h-[50px] w-full items-center justify-between px-4 outline-none",

            showAsTags && "!items-start py-[9px]"
          )}
        >
          {showAsTags && isMultiSelect ? (
            <div className="flex max-w-[95%] flex-wrap gap-2">
              {props.value?.length ? (
                (props.value as string[]).map((item, index) => {
                  const label = options?.find(
                    (option) => option.value === item
                  )?.label;

                  return (
                    <Tag
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
                  className="pointer-events-none mt-1 w-[90%] border-none bg-transparent outline-none placeholder:text-white/50"
                  type="text"
                  {...props}
                />
              )}
            </div>
          ) : (
            <input
              type="text"
              className={classNames(
                "pointer-events-none w-[90%] border-none bg-transparent outline-none placeholder:text-white/50 disabled:text-white",

                error && "placeholder:!text-[#fff]/50"
              )}
              {...props}
              value={capitalize(displayValue || "")}
              readOnly
            />
          )}

          <div className="absolute right-3 top-[22px]">
            <img alt="arrow" src={arrow} />
          </div>
        </button>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={showList ? { opacity: 1 } : { opacity: 0, display: "none" }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          className="hide-scroll absolute left-0 top-[100%] z-20 max-h-[400px] w-full min-w-[300px] space-y-2 overflow-hidden overflow-y-scroll rounded-[4px] bg-white/90 p-2.5 shadow-md"
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

                return isMultiSelect ? (
                  <div key={index} className="px-2.5 py-1.5">
                    <Checkbox
                      labelClass="text-[16px] font-medium"
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
                    <li className="truncate rounded-[8px] px-4 py-3 font-medium text-black transition-all hover:bg-mint">
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
