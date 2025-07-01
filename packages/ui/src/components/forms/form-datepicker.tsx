import { cn } from "@repo/ui/lib/utils";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { DatePicker, type DatePickerProps } from "../datepicker";
import InputShell from "./input-shell";

interface BaseFormDatePickerProps {
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

interface FormDatePickerProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFormDatePickerProps,
    Omit<DatePickerProps, "selected" | "onSelect"> {
  name: Path<TFieldValues>;
}

function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  required,
  className,
  containerClassName,
  ...datePickerProps
}: FormDatePickerProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const error = errors[name];

  return (
    <InputShell
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      containerClassName={containerClassName}
      error={error?.message as string}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...datePickerProps}
            selected={field.value}
            onSelect={field.onChange}
            className={cn(
              "bg-input/50 border-border",
              "focus:ring-primary/50 focus:border-primary focus:ring-2",
              "transition-colors",
              error &&
                "border-destructive focus:border-destructive focus:ring-destructive/50",
              className
            )}
          />
        )}
      />
    </InputShell>
  );
}

FormDatePicker.displayName = "FormDatePicker";
export default FormDatePicker;
