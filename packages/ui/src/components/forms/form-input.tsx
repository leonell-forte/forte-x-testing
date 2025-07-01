import { cn } from "@repo/ui/lib/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "../input";
import InputShell from "./input-shell";

interface BaseInputProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

// Text Input Component
interface FormInputProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "name"> {}

const FormInput = ({
  name,
  label,
  helperText,
  required,
  className,
  containerClassName,
  ...props
}: FormInputProps) => {
  const {
    register,
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
      <Input
        id={name}
        {...register(name)}
        {...props}
        className={cn(
          "bg-input/50 border-border w-full rounded-lg border px-4 py-3",
          "focus:ring-primary/50 focus:border-primary focus:outline-none focus:ring-2",
          "placeholder:text-muted-foreground transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error &&
            "border-destructive focus:border-destructive focus:ring-destructive/50",
          className
        )}
      />
    </InputShell>
  );
};

FormInput.displayName = "FormInput";

export default FormInput;
