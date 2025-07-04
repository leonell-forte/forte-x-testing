import { cn } from "@repo/ui/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

import { Combobox, type ComboboxProps } from "../combobox";
import InputShell from "./input-shell";

interface BaseSelectProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

interface FormSelectProps
  extends BaseSelectProps,
    Omit<ComboboxProps, "value" | "onValueChange"> {}

const FormSelect = ({
  name,
  label,
  helperText,
  required,
  className,
  containerClassName,
  onSearchChange,
  ...props
}: FormSelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<{ [x: string]: string }>();
  const error = errors[name];

  return (
    <InputShell
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      containerClassName={containerClassName}
      error={error?.message}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Combobox
            value={field.value || ""}
            onValueChange={field.onChange}
            onSearchChange={onSearchChange || (() => {})}
            className={cn("form-input", error && "error", className)}
            {...props}
          />
        )}
      />
    </InputShell>
  );
};

FormSelect.displayName = "FormSelect";

export default FormSelect;
