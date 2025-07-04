import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyText?: string;
  className?: string;
  search?: string;
  onSearchChange?: (search: string) => void;
  localSearch?: boolean;
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  loading = false,
  emptyText = "No results found.",
  className,
  search,
  onSearchChange,
  localSearch = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalSearch, setInternalSearch] = React.useState("");
  const showSearch =
    typeof search === "string" && typeof onSearchChange === "function"
      ? true
      : localSearch;

  const searchValue = localSearch ? internalSearch : search || "";
  const handleSearchChange = localSearch
    ? setInternalSearch
    : onSearchChange || (() => {});

  const filteredOptions =
    showSearch && localSearch
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "form-input",
            "flex items-center justify-between",
            selectedOption?.label
              ? "text-primary-foreground"
              : "text-muted-foreground",
            "data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px]",
            className
          )}
          disabled={loading}
        >
          {selectedOption?.label || placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          {showSearch && (
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={handleSearchChange}
            />
          )}
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              emptyText
            )}
          </CommandEmpty>
          <CommandGroup>
            {(showSearch && localSearch ? filteredOptions : options).map(
              (option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-1 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
