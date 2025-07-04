import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";
import { get } from "lodash";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange, PropsBase } from "react-day-picker";

interface BaseDatePickerProps {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  captionLayout?: PropsBase["captionLayout"];
  fromYear?: number;
  toYear?: number;
  showIcon?: boolean;
  required?: boolean;
}

interface SingleDatePickerProps extends BaseDatePickerProps {
  mode: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

interface MultipleDatePickerProps extends BaseDatePickerProps {
  mode: "multiple";
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
}

interface RangeDatePickerProps extends BaseDatePickerProps {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

export type DatePickerProps =
  | SingleDatePickerProps
  | MultipleDatePickerProps
  | RangeDatePickerProps;

export function DatePicker(props: DatePickerProps) {
  const {
    placeholder = "Select date",
    className,
    disabled = false,
    captionLayout = "dropdown",
    showIcon = true,
    mode,
    selected,
    onSelect,
    required = false,
  } = props;

  const [open, setOpen] = React.useState(false);

  // Format the display value based on mode and selection
  const formatDisplayValue = React.useCallback(() => {
    if (!selected) return placeholder;

    if (mode === "single") {
      return selected instanceof Date
        ? selected.toLocaleDateString()
        : placeholder;
    }

    if (mode === "multiple") {
      const dates = Array.isArray(selected) ? selected : [];
      if (dates.length === 0) return placeholder;
      if (dates.length === 1) return dates[0].toLocaleDateString();
      return `${dates.length} dates selected`;
    }

    if (mode === "range") {
      const range = selected as DateRange;
      if (!range?.from) return placeholder;
      if (!range.to) return `${range.from.toLocaleDateString()} - ...`;

      // Don't show "to" date if it's the same as "from" date
      if (range.from.getTime() === range.to.getTime()) {
        return `${range.from.toLocaleDateString()} - ...`;
      }

      return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
    }

    return placeholder;
  }, [selected, mode, placeholder]);

  // Handle selection and popover closing
  const handleSelect = React.useCallback(
    (value: any) => {
      if (onSelect) {
        onSelect(value);
      }
      if (mode === "single" && value) {
        setOpen(false);
      } else if (
        mode === "range" &&
        value?.from &&
        value?.to &&
        value.from.getTime() !== value.to.getTime()
      ) {
        setOpen(false);
      }
    },
    [onSelect, mode]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "form-input data-[state=open]:border-ring data-[state=open]:ring-ring/50 w-full items-center justify-between font-normal data-[state=open]:ring-[3px]",
            className
          )}
          disabled={disabled}
        >
          <span
            className={cn(
              "truncate",
              !selected ||
                (mode === "range" &&
                  (!get(selected, "from") || !get(selected, "to")))
                ? "text-muted-foreground"
                : ""
            )}
          >
            {formatDisplayValue()}
          </span>
          {showIcon && (
            <CalendarIcon className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode={mode}
          selected={selected as any}
          onSelect={handleSelect}
          captionLayout={captionLayout}
          numberOfMonths={mode === "range" ? 2 : 1}
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
}
