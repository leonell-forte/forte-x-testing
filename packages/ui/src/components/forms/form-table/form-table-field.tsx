import { cn } from "@repo/ui/lib/utils";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Combobox } from "../../combobox";
import { DatePicker } from "../../datepicker";
import { FileUpload } from "../../file-upload";
import { Input } from "../../input";
import { MultiSelect } from "../../multi-select";
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
        if (config.type === "file") {
          return (
            <FileUpload
              value={field.value as File | null}
              onChange={field.onChange}
              accept={config.accept}
              hasError={hasError}
            />
          );
        }
        if (config.type === "select") {
          return (
            <Combobox
              value={typeof field.value === "string" ? field.value : ""}
              onValueChange={field.onChange}
              localSearch
              className={baseClassName}
              options={config.options}
              showIcon={false}
              placeholder={config.placeholder || ""}
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
              showIcon={false}
              placeholder={config.placeholder || ""}
            />
          );
        }
        if (config.type === "multi-select") {
          return (
            <MultiSelect
              options={config.options}
              value={field.value as string[]}
              onValueChange={field.onChange}
              className={baseClassName}
              maxCount={config.maxCount}
              placeholder={config.placeholder || ""}
              hideClear
              hideChevron
              modalPopover
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
                placeholder={config.placeholder || ""}
                value={field.value as string}
              />
            );
        }
      }}
    />
  );
}
