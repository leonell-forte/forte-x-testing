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

  contentWidth?: string | number;

  leadingIcon?: React.ReactNode;
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

  contentWidth,

  leadingIcon,

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

  const onMultipleSelect = (
    value: string,
    e?: MouseEvent<HTMLButtonElement>
  ) => {
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
          <button
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowList(!showList);
              }
            }}
            disabled={props.disabled || props?.readOnly}
            type="button"
            tabIndex={props.disabled ? -1 : 0} // Add tabIndex
            className={classNames(
              "relative flex h-10 w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5",
              "focus:border-white focus:ring-1 focus:ring-white/90", // Add visible focus styles
              "transition-all duration-200", // Smooth transitions
              className,
              props.disabled
                ? "cursor-not-allowed border-white/30"
                : "border-white/30 hover:border-white"
            )}
            aria-haspopup="listbox"
            aria-expanded={showList}
            aria-controls="dropdown-list"
            aria-labelledby={`${props.id || "dropdown"}-label`}
          >
            {leadingIcon}
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
                  aria-label={props.placeholder || "Select option"}
                  aria-describedby={
                    helperText
                      ? `${props.id || "dropdown"}-helper-text`
                      : undefined
                  }
                  aria-invalid={error ? "true" : undefined}
                />
              </div>
            ) : (
              <input
                tabIndex={-1}
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
                "absolute right-2.5 h-auto w-[20px] flex-shrink-0 outline-none transition-all",
                showList && "rotate-180",
                props.disabled
                  ? "cursor-not-allowed fill-white/30"
                  : "fill-white"
              )}
              tabIndex={-1}
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          id="dropdown-list"
          role="listbox"
          aria-label={`${props.placeholder || "Options"} list`}
          onOpenAutoFocus={(e) => e.preventDefault()}
          {...(contentWidth && {
            style: {
              width: contentWidth,
            },
          })}
        >
          <div className="max-w-full text-black">
            {!!props.value?.length && isMultiSelect && showAsTags && (
              <div className="flex flex-wrap gap-2 border-b pb-4">
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
              </div>
            )}
            {loading ? (
              <div
                className="flex h-[100px] w-full items-center justify-center"
                role="status"
                aria-live="polite"
              >
                <Loader dark />
              </div>
            ) : filteredOptions.length === 0 ? (
              <div
                className="py-12 text-center text-sm text-black"
                role="status"
                aria-live="polite"
              >
                No results found.
              </div>
            ) : (
              filteredOptions.map((item, index) => {
                const { label, value } = item;
                const isSelected =
                  props?.value === label || props?.value === value;

                return isMultiSelect ? (
                  <button
                    key={index}
                    className="checkbox gap group flex max-w-full items-center overflow-hidden rounded-[8px] px-2.5 py-1.5 ring-mint transition-all hover:bg-neutral-300 focus:ring-1"
                    role="option"
                    aria-selected={props?.value?.includes(value)}
                    id={`${props.id || "dropdown"}-option-${index}`}
                    onClick={(e) => onMultipleSelect(value, e)}
                  >
                    <Checkbox
                      checked={props?.value?.includes(value)}
                      onChange={() => onMultipleSelect(value)}
                    />
                    <span className="w-full translate-x-[-15px] translate-y-[2px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-black transition duration-500">
                      {label}
                    </span>
                  </button>
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
                    role="option"
                    aria-selected={isSelected}
                    id={`${props.id || "dropdown"}-option-${index}`}
                  >
                    <li
                      className={cn(
                        "list-none truncate rounded-[8px] p-2 text-sm text-black ring-mint transition duration-500 focus:ring-1",
                        isSelected ? "bg-mint" : "hover:bg-neutral-300"
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
            <p
              className="line-clamp-1 text-[12px] font-medium text-alert"
              role="alert"
              aria-live="polite"
            >
              {helperText}
            </p>
          </div>
        )}
      </Popover>
    </div>
  );
};

export default Dropdown;
