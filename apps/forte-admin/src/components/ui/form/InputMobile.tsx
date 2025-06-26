import classNames from "classnames";
import * as React from "react";
import { HiChevronDown } from "react-icons/hi";
import {
  CountryIso2,
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";

import { useOutsideClick } from "@/lib/hooks";
import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "../popover/Popover";

type Props = {
  name: string;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  type?: "text" | "email";
  value?: string;
  onChange: (str: string) => void;
  label?: string;
  readOnly?: boolean;
};

const InputMobile = ({
  name,
  disabled = false,
  readOnly = false,
  placeholder = undefined,
  label,
  onChange,
  value = "",
}: Props) => {
  const dropdownRef = React.useRef(null);

  const [open, setOpen] = React.useState(false);
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "us",
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  useOutsideClick(dropdownRef, () => {
    setOpen(false);
  });

  return (
    <div className="relative flex w-full items-center gap-2" ref={dropdownRef}>
      <div className="min-w-[75px]">
        <Popover {...(readOnly || disabled ? { open: false } : { open })}>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen((state) => !state);
              }}
              disabled={disabled}
              className={cn(
                "flex h-[40.13px] w-full items-center justify-between rounded-lg border border-[#e5e7eb]/40 px-3 py-2 text-sm leading-4 hover:border-white focus:border-white disabled:cursor-not-allowed sm:text-base",
                readOnly ? "pointer-events-none cursor-pointer" : ""
              )}
            >
              <FlagImage iso2={country.iso2 as CountryIso2} size="30px" />

              <HiChevronDown
                className={classNames(
                  "h-auto w-[20px] flex-shrink-0 transition-all",
                  open && "rotate-180",
                  disabled ? "fill-disabled cursor-not-allowed" : "fill-white"
                )}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            onPointerDownOutside={(e) => e.stopPropagation()}
            className="w-[280px]"
          >
            {defaultCountries.map((c, idx) => {
              const mCountry = parseCountry(c);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setCountry(mCountry.iso2);
                  }}
                  className="hover:bg-mint relative flex w-full items-center rounded px-2.5 py-1.5 text-sm transition sm:text-base"
                >
                  <div className="group flex items-center gap-3.5">
                    <FlagImage iso2={mCountry.iso2} size="35px" />
                    <div className="flex items-center gap-1.5">
                      <div
                        className={classNames(
                          "text-left text-sm",
                          country.iso2 === mCountry.iso2
                            ? "text-[#2ca373]"
                            : "text-black transition group-hover:text-black/60"
                        )}
                      >
                        {mCountry.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        +{mCountry.dialCode}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>

      <input
        id={name}
        name={name}
        type="tel"
        className={classNames(
          "h-[40.13px] w-full rounded-lg border border-[#e5e7eb]/40 bg-transparent px-3 py-2 text-sm leading-4 hover:border-white sm:text-base",
          "disabled:border-disabled focus:border-white focus:outline-none",
          "focus:border-selected text-white placeholder:text-white/70"
        )}
        placeholder={readOnly ? "-" : placeholder || label}
        disabled={readOnly ? false : disabled}
        readOnly={readOnly}
        ref={inputRef}
        value={inputValue}
        onChange={handlePhoneValueChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default InputMobile;
