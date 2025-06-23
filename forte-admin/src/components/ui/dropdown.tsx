import { capitalize } from "@mui/material";
import classNames from "classnames";
import React from "react";
import {
  InputHTMLAttributes,
  KeyboardEvent,
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
  const popoverRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
    setFocusedOptionIndex(-1);
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

  // Only reset focused option index when search changes (not when options change)
  useEffect(() => {
    if (filterOptions && search) {
      setFocusedOptionIndex(-1);
    }
  }, [search, filterOptions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showList) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setShowList(true);
        setFocusedOptionIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isSearchFocused) {
          setFocusedOptionIndex((prev) => {
            const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
            return nextIndex;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isSearchFocused) {
          setFocusedOptionIndex((prev) => {
            const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
            return nextIndex;
          });
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          focusedOptionIndex >= 0 &&
          focusedOptionIndex < filteredOptions.length
        ) {
          const selectedOption = filteredOptions[focusedOptionIndex];
          if (isMultiSelect) {
            onMultipleSelect(selectedOption.value);
          } else {
            handleSelect!(selectedOption.value);
            setShowList(false);
            setSearch("");
          }
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowList(false);
        setFocused(false);
        setFocusedOptionIndex(-1);
        break;
      case "Tab":
        if (enableSearch && focused) {
          // Tab from input to popover
          e.preventDefault();
          setFocusedOptionIndex(0);
          popoverRef.current?.focus();
        }
        break;
    }
  };

  // Handle input-specific keyboard events
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && enableSearch && showList) {
      e.preventDefault();
      setFocusedOptionIndex(0);
      popoverRef.current?.focus();
    }
    if (e.key === "Escape") {
      setShowList(false);
      setFocused(false);
      setFocusedOptionIndex(-1);
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (focusedOptionIndex >= 0 && showList && filteredOptions.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        const optionElement = document.getElementById(
          `${props.id || "dropdown"}-option-${focusedOptionIndex}`
        );
        if (optionElement) {
          optionElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }, 0);
    }
  }, [focusedOptionIndex, showList, props.id, filteredOptions.length]);

  return (
    <div ref={dropdownRef} className={classNames("relative w-full", className)}>
      <Popover
        open={showList}
        onOpenChange={(open) => {
          if ((focused && showList) || props.disabled) return;
          setShowList(open);
          if (!open) {
            setFocusedOptionIndex(-1);
          }
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
            onKeyDown={handleKeyDown}
            disabled={props.disabled || props?.readOnly}
            type="button"
            tabIndex={props.disabled ? -1 : 0}
            className={classNames(
              "relative flex h-10 w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5",
              "focus:border-white focus:ring-1 focus:ring-white/90",
              "transition-all duration-200",
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
                    setIsSearchFocused(false);
                  }}
                  onFocus={() => {
                    setShowList(true);
                    setFocused(true);
                    setIsSearchFocused(true);
                  }}
                  onKeyDown={handleInputKeyDown}
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
                    setIsSearchFocused(false);
                  },
                  onFocus: () => {
                    setShowList(true);
                    setFocused(true);
                    setIsSearchFocused(true);
                  },
                  onKeyDown: handleInputKeyDown,
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
          ref={popoverRef}
          id="dropdown-list"
          role="listbox"
          tabIndex={-1}
          aria-label={`${props.placeholder || "Options"} list`}
          aria-activedescendant={
            focusedOptionIndex >= 0
              ? `${props.id || "dropdown"}-option-${focusedOptionIndex}`
              : undefined
          }
          onOpenAutoFocus={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
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
                const isFocused = index === focusedOptionIndex;

                return isMultiSelect ? (
                  <button
                    key={index}
                    className={cn(
                      "checkbox gap group flex max-w-full items-center overflow-hidden rounded-[8px] px-2.5 py-1.5 ring-mint transition-all hover:bg-neutral-300 focus:ring-1",
                      isFocused && "bg-neutral-300 ring-1"
                    )}
                    role="option"
                    aria-selected={props?.value?.includes(value)}
                    id={`${props.id || "dropdown"}-option-${index}`}
                    onClick={(e) => onMultipleSelect(value, e)}
                    tabIndex={-1}
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
                    tabIndex={-1}
                  >
                    <li
                      className={cn(
                        "list-none truncate rounded-[8px] p-2 text-sm text-black ring-mint transition duration-500 focus:ring-1",
                        isSelected ? "bg-mint" : "hover:bg-neutral-300",
                        isFocused && "bg-neutral-300 ring-1"
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
