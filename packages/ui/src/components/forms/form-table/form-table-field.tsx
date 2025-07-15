import { cn } from "@repo/ui/lib/utils";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Combobox } from "../../combobox";
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
  // const baseClassName = `border-0 bg-transparent px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded ${
  //   hasError ? "pr-8" : ""
  // }`;

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
              className={cn(
                "form-input hover:border-input border-transparent shadow-none",
                hasError ? "border-destructive" : ""
              )}
              options={config.options}
            />
          );
        }

        switch (config.type) {
          default:
            return (
              <Input
                {...field}
                type={config.type}
                className={cn(
                  "hover:border-input border-transparent shadow-none",
                  hasError ? "border-destructive" : ""
                )}
                placeholder={config.placeholder}
                value={field.value as string}
              />
            );
        }
      }}
    />
  );
}
