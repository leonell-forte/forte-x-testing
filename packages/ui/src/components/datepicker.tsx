import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";
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
      if (
        (mode === "single" && value) ||
        (mode === "range" && value?.from && value?.to)
      ) {
        setOpen(false);
      }
      // For multiple, don't auto-close
    },
    [onSelect, mode]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">{formatDisplayValue()}</span>
          {showIcon && (
            <span className="ml-2 flex shrink-0">
              <CalendarIcon className="h-4 w-4" />
            </span>
          )}
        </Button>
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
