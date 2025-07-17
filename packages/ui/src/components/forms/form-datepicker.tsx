import { cn } from "@repo/ui/lib/utils";
import { get } from "lodash";
import { useMemo } from "react";
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
  const errMsg = useMemo(() => {
    if (
      datePickerProps.mode === "range" &&
      (get(error, "from") || get(error, "to"))
    ) {
      return (
        get(error, "from.message", "") ||
        get(error, "to.message", "") ||
        "Please select a date range"
      );
    }
    return error?.message;
  }, [error, datePickerProps.mode]);

  console.log(error);
  return (
    <InputShell
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      containerClassName={containerClassName}
      error={errMsg as string}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...datePickerProps}
            selected={field.value}
            onSelect={field.onChange}
            className={cn("form-input", errMsg && "error", className)}
          />
        )}
      />
    </InputShell>
  );
}

FormDatePicker.displayName = "FormDatePicker";
export default FormDatePicker;
