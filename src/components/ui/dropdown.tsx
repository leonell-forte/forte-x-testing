import { capitalize } from "@mui/material";
import classNames from "classnames";
import {
  InputHTMLAttributes,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HiChevronDown } from "react-icons/hi";

import { useOutsideClick } from "lib/hooks";
import { cn } from "lib/utils";

import Checkbox from "./checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./popover/Popover";
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

  filterOptions?: boolean;
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

  filterOptions,

  ...props
}: IDropdownProp) => {
  const dropdownRef = useRef(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [focused, setFocused] = useState(false);

  const [showList, setShowList] = useState(false);

  const [search, setSearch] = useState("");

  const displayValue =
    isMultiSelect && Array.isArray(props.value)
      ? props.value.length
        ? `${props.value.length} selected`
        : ""
      : (props.value as string);

  const onMultipleSelect = (value: string, e?: MouseEvent<HTMLDivElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let newValue;

    if (props.value?.includes(value)) {
      newValue = (props.value as string[]).filter((item) => item !== value);
    } else {
      newValue = [...(props.value as string[]), value];
    }

    handleSelect!(newValue);
    setSearch("");
  };

  useOutsideClick(dropdownRef, () => {
    setShowList(false);
    setFocused(false);
  });

  useEffect(() => {
    if (showList && enableSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showList, enableSearch]);

  const filteredOptions = useMemo(() => {
    if (filterOptions) {
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }
    return options;
  }, [options, search, filterOptions]);

  return (
    <div
      ref={dropdownRef}
      className={classNames(
        "relative w-full",

        className
      )}
    >
      <Popover
        open={showList}
        onOpenChange={(open) => {
          if ((focused && showList) || props.disabled) return;
          setShowList(open);
        }}
      >
        <PopoverTrigger
          asChild
          className={cn(
            props.disabled && "cursor-not-allowed",
            props.disabled || (props.readOnly && "pointer-events-none")
          )}
        >
          <div
            className={classNames(
              "relative w-full rounded-lg border px-3.5 py-2.5",
              className,
              props.disabled
                ? "cursor-not-allowed border-disabled"
                : "border-white"
            )}
          >
            <div className="relative">
              <button
                disabled={props.disabled || props?.readOnly}
                type="button"
                className={classNames(
                  "relative flex h-full w-full items-center gap-2.5 outline-none"
                )}
              >
                {showAsTags && isMultiSelect ? (
                  <div className="flex w-full flex-1 flex-shrink flex-wrap gap-2 truncate text-ellipsis pr-8">
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
                        "w-full flex-1 flex-shrink truncate text-ellipsis whitespace-nowrap border-none bg-transparent pr-8 font-medium outline-none placeholder:font-medium placeholder:text-white/50 disabled:text-white",

                        error && "placeholder:!text-[#fff]/50",

                        props.disabled && "!cursor-not-allowed"
                      )}
                      {...props}
                      ref={inputRef}
                      value={
                        focused && enableSearch
                          ? search
                          : capitalize(displayValue || "")
                      }
                      onBlur={() => {
                        setFocused(false);
                      }}
                      onFocus={() => {
                        setShowList(true);
                        setFocused(true);
                      }}
                      onChange={(e) => {
                        props.onChange?.(e);
                        setSearch(e.target.value);
                      }}
                      readOnly={!enableSearch || props?.readOnly}
                      disabled={props.disabled}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    className={classNames(
                      "w-full truncate text-ellipsis border-none bg-transparent pr-8 font-medium outline-none placeholder:font-medium placeholder:text-white/50 disabled:text-white",

                      error && "placeholder:!text-[#fff]/50",

                      props.disabled && "!cursor-not-allowed"
                    )}
                    {...props}
                    ref={inputRef}
                    value={
                      focused && enableSearch
                        ? search
                        : capitalize(displayValue || "")
                    }
                    {...(enableSearch && {
                      onBlur: () => {
                        setFocused(false);
                      },
                      onFocus: () => {
                        setShowList(true);
                        setFocused(true);
                      },
                    })}
                    onChange={(e) => {
                      props.onChange?.(e);
                      setSearch(e.target.value);
                    }}
                    readOnly={!enableSearch || props?.readOnly}
                  />
                )}
                <HiChevronDown
                  className={classNames(
                    "absolute right-0 h-auto w-[20px] flex-shrink-0 transition-all",
                    showList && "rotate-180",
                    props.disabled
                      ? "cursor-not-allowed fill-disabled"
                      : "fill-white"
                  )}
                />
              </button>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="max-w-full">
            {loading ? (
              <div className="flex h-[100px] w-full items-center justify-center">
                <Loader dark />
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="text-center text-sm text-black">
                No results found.
              </div>
            ) : (
              filteredOptions.map((item, index) => {
                const { label, value } = item;
                const isSelected =
                  props?.value === label || props?.value === value;

                return isMultiSelect ? (
                  <div
                    key={index}
                    className="checkbox gap group flex max-w-full items-center overflow-hidden rounded-[8px] px-2.5 py-1.5 transition-all hover:bg-neutral-300 hover:[&>svg]:rotate-180"
                    role="button"
                    onClick={(e) => onMultipleSelect(value, e)}
                  >
                    <Checkbox
                      checked={props?.value?.includes(value)}
                      onChange={() => onMultipleSelect(value)}
                    />
                    <span className="w-full translate-x-[-15px] translate-y-[2px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-black transition duration-500">
                      {label}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect!(value);
                      setShowList(false);
                      setSearch("");
                    }}
                    key={index}
                    className="w-full text-left"
                  >
                    <li
                      className={cn(
                        "list-none truncate rounded-[8px] p-2 text-sm text-black transition duration-500",
                        isSelected ? "bg-mint" : "hover:bg-mint"
                      )}
                    >
                      {label}
                    </li>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
        {helperText && (
          <div className="absolute pl-4">
            <p className="line-clamp-1 text-[12px] font-medium text-alert">
              {helperText}
            </p>
          </div>
        )}
      </Popover>
    </div>
  );
};

export default Dropdown;
