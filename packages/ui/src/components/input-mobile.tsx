import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  type CountryIso2,
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";

import { Command, CommandGroup, CommandInput, CommandItem } from "./command";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

type Props = {
  name: string;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  value?: string;
  onChange: (str: string) => void;
  label?: string;
  readOnly?: boolean;
};

const InputMobile = ({
  name,
  disabled = false,
  readOnly = false,
  placeholder,
  label,
  onChange,
  value = "",
}: Props) => {
  const {
    formState: { errors },
  } = useFormContext<{ [x: string]: string }>();
  const error = errors[name];
  const [search, setSearch] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "us",
      value,
      countries: defaultCountries,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredOptions = defaultCountries.filter((option) => {
    const mCountry = parseCountry(option);
    return mCountry.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex w-full items-center gap-2">
      <div className="min-w-[75px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "form-input",
                "flex items-center justify-between",
                "data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px]"
              )}
              disabled={disabled}
            >
              <FlagImage iso2={country.iso2 as CountryIso2} size="30px" />
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full overflow-y-auto p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={"Search"}
                value={search}
                onValueChange={setSearch}
                name={name}
              />
              <ScrollArea className="max-h-[24rem]">
                <CommandGroup>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {filteredOptions.map((option) => {
                    const mCountry = parseCountry(option);
                    return (
                      <CommandItem
                        key={mCountry.iso2}
                        value={mCountry.iso2}
                        onSelect={(currentValue) => {
                          setCountry(currentValue);
                          setOpen(false);
                        }}
                      >
                        <div className="group flex items-center gap-3.5">
                          <FlagImage iso2={mCountry.iso2} size="35px" />
                          <div className="flex items-center gap-1.5">
                            <div
                              className={cn(
                                "text-left text-sm",
                                country.iso2 === mCountry.iso2
                                  ? "text-primary"
                                  : "text-foreground group-hover:text-accent-foreground transition"
                              )}
                            >
                              {mCountry.name}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              +{mCountry.dialCode}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Input
        id={name}
        name={name}
        type="tel"
        placeholder={readOnly ? "-" : placeholder || label}
        disabled={readOnly ? false : disabled}
        readOnly={readOnly}
        ref={inputRef}
        value={inputValue}
        onChange={handlePhoneValueChange}
        className={cn("form-input", error && "error")}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default InputMobile;
