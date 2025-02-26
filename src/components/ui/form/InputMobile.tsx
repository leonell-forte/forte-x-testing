import * as SelectPrimitive from "@radix-ui/react-select";
import classNames from "classnames";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import {
  CountryIso2,
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";

import { Select, SelectContent, SelectItem, SelectTrigger } from "./Select";

export const CustomTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, value, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={classNames(
      "bg-background ring-offset-background flex h-[40.13px] w-full items-center justify-between rounded-lg border px-3 py-2 text-sm leading-4 sm:text-base",
      "focus:outline-none disabled:bg-gray-300",
      "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      "[&[data-state=open]>svg]:rotate-180",
      "[&>span]:text-left [&>span]:text-inherit",
      "focus:border-selected data-[placeholder]:text-white/70",
      className
    )}
    {...props}
  >
    <FlagImage iso2={value as CountryIso2} size="30px" />
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 transform stroke-white/70 transition-all duration-300" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

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
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "us",
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  return (
    <div
      className="relative flex w-full items-center gap-2"
      onClick={(e) => {
        // Prevent clicks from bubbling up to Dialogue's outside click handler
        e.stopPropagation();
      }}
    >
      <div className="min-w-[75px]" onClick={(e) => e.stopPropagation()}>
        <Select
          name={name}
          onValueChange={(v) => {
            setCountry(v);
          }}
          defaultValue={country.iso2}
          value={country.iso2}
          disabled={disabled}
        >
          <CustomTrigger
            value={country.iso2}
            onClick={(e) => e.stopPropagation()}
          />
          <SelectContent onClick={(e) => e.stopPropagation()}>
            {defaultCountries.map((c, idx) => {
              const mCountry = parseCountry(c);
              return (
                <SelectItem
                  key={idx}
                  value={mCountry.iso2}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="group flex items-center gap-3.5">
                    <FlagImage iso2={mCountry.iso2} size="20px" />
                    <div className="flex items-center gap-1.5">
                      <div
                        className={classNames(
                          "text-sm",
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
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <input
        id={name}
        name={name}
        type="tel"
        className={classNames(
          "h-[40.13px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm leading-4 sm:text-base",
          "focus:outline-none disabled:border-disabled",
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
