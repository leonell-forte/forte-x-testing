import { cn } from "@repo/ui/lib/utils";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Combobox } from "../../combobox";
import { DatePicker } from "../../datepicker";
import { Input } from "../../input";
import type { ColumnConfig } from "./form-table.types";

interface FieldProps<T extends FieldValues> {
  control: Control<{ rows: T[] }>;
  name: FieldPath<{ rows: T[] }>;
  config: ColumnConfig<T>;
  hasError: boolean;
}

export function TableField<T extends FieldValues>({
  control,
  name,
  config,
  hasError,
}: FieldProps<T>) {
  const baseClassName = cn(
    "form-input hover:border-input border-transparent shadow-none",
    hasError ? "border-destructive" : ""
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        if (config.type === "select") {
          return (
            <Combobox
              value={typeof field.value === "string" ? field.value : ""}
              onValueChange={field.onChange}
              localSearch
              className={baseClassName}
              options={config.options}
            />
          );
        }

        if (config.type === "date") {
          return (
            <DatePicker
              mode="single"
              selected={field.value as Date}
              onSelect={field.onChange}
              className={baseClassName}
            />
          );
        }

        switch (config.type) {
          default:
            return (
              <Input
                {...field}
                type={config.type}
                className={baseClassName}
                placeholder={config.placeholder}
                value={field.value as string}
              />
            );
        }
      }}
    />
  );
}
