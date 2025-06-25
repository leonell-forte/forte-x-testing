import { cn } from "@repo/ui/lib/utils";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Checkbox } from "../checkbox";
import { Label } from "../label";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  containerClassName?: string;
}

const FormCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  containerClassName,
}: FormCheckboxProps<T>) => {
  return (
    <div className={cn("flex items-center gap-x-2", containerClassName)}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            id={name}
            checked={value}
            onCheckedChange={(checked) => onChange(checked)}
          />
        )}
      />
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
    </div>
  );
};

FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
