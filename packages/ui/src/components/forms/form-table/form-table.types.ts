import type { FieldPath, FieldValues } from "react-hook-form";
import { z } from "zod";

export type ColumnType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "date"
  | "file"
  | "multi-select";

export interface BaseColumnConfig<T extends FieldValues> {
  key: FieldPath<T>;
  header: string;
  type: ColumnType;
  placeholder?: string;
  required?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
}

export type ColumnConfig<T extends FieldValues> =
  | (BaseColumnConfig<T> & {
      type: "text" | "email";
    })
  | (BaseColumnConfig<T> & {
      type: "number";
      min?: number;
      max?: number;
    })
  | (BaseColumnConfig<T> & {
      type: "select";
      options: Array<{ value: string; label: string }>;
    })
  | (BaseColumnConfig<T> & {
      type: "date";
    })
  | (BaseColumnConfig<T> & {
      type: "file";
      accept?: Record<string, string[]>; // e.g., { 'image/*': ['.png', '.jpg'] }
    })
  | (BaseColumnConfig<T> & {
      type: "multi-select";
      options: Array<{
        value: string;
        label: string;
        icon?: React.ComponentType<{ className?: string }>;
      }>;
      maxCount?: number;
    });

export interface EditableTableProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  columns: ColumnConfig<T>[];
  defaultRow: T;
  onSubmit: (data: { rows: T[] }) => void;
  initialData?: T[];
  addRowPlaceholder?: string;
  submitButtonText?: string;
  className?: string;
  color?: string;
}
