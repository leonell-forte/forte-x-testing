import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import InputMobile from "../input-mobile";
import InputShell from "./input-shell";

interface BaseInputProps {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

interface FormMobileProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "name"> {}

const FormMobile = ({
  name,
  label,
  helperText,
  required,
  containerClassName,
}: FormMobileProps) => {
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
        render={({ field }) => <InputMobile {...field} />}
      />
    </InputShell>
  );
};

FormMobile.displayName = "FormMobile";

export default FormMobile;
