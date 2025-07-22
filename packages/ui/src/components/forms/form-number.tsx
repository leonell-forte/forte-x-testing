import { cn } from "@repo/ui/lib/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { InputNumber } from "../input-number";
import InputShell from "./input-shell";

interface BaseInputProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

// Number Input Component
interface FormNumberProps
  extends BaseInputProps,
    Omit<React.ComponentProps<typeof InputNumber>, "className" | "name"> {}

const FormNumber = ({
  name,
  label,
  helperText,
  required,
  className,
  containerClassName,
  ...props
}: FormNumberProps) => {
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
          <InputNumber
            id={name}
            {...field}
            {...props}
            className={cn(error && "error", className)}
          />
        )}
      />
    </InputShell>
  );
};

FormNumber.displayName = "FormNumber";

export default FormNumber;
