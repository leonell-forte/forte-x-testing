import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@repo/ui/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CircleAlert, Trash } from "lucide-react";
import React, { useState } from "react";
import {
  type FieldError,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type Path,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "../../button";
import { Input } from "../../input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../tooltip";
import { TableField } from "./form-table-field";
import type { ColumnConfig, EditableTableProps } from "./form-table.types";

const ErrorIcon = ({ message }: { message: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="text-destructive absolute -top-2.5 right-1 flex h-5 w-5 cursor-help items-center justify-center">
        <CircleAlert />
      </div>
    </TooltipTrigger>
    <TooltipContent color="destructive">
      <p>{message}</p>
    </TooltipContent>
  </Tooltip>
);

function getFieldError<T extends FieldValues>(
  errors: FieldErrors<{ rows: T[] }>,
  rowIndex: number,
  fieldName: FieldPath<T>
): string | undefined {
  const rowErrors = errors.rows?.[rowIndex];
  if (!rowErrors) return undefined;

  if (
    typeof rowErrors === "object" &&
    "message" in rowErrors &&
    typeof rowErrors.message === "string"
  ) {
    return rowErrors.message;
  }

  if (
    typeof rowErrors === "object" &&
    rowErrors !== null &&
    fieldName in rowErrors
  ) {
    const fieldError = rowErrors[fieldName as keyof typeof rowErrors] as
      | FieldError
      | undefined;
    return fieldError?.message;
  }

  return undefined;
}

function castFieldArrayToRows<T extends FieldValues>(
  fields: Array<T & { id: string }>
): T[] {
  return fields.map(({ id, ...rest }) => rest as unknown as T);
}

export default function EditableTable<T extends FieldValues>({
  schema,
  columns,
  defaultRow,
  onSubmit,
  initialData = [defaultRow],
  addRowPlaceholder = "+ Add new item",
  submitButtonText = "Save Changes",
  className = "",
  color = "primary",
}: EditableTableProps<T>) {
  const [newRowInput, setNewRowInput] = useState("");
  const [addHover, setAddHover] = useState(false);

  const formSchema = z.object({
    rows: z.array(schema),
  });

  type FormData = { rows: T[] };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { rows: initialData },
    mode: "onSubmit",
  });

  // @ts-expect-error - react-hook-form constraint issue with generic types
  const { fields, append, remove } = useFieldArray<FormData, "rows">({
    control,
    name: "rows",
  });

  const handleAddRow = () => {
    if (newRowInput.trim()) {
      const firstColumnKey = columns[0].key;
      const newRow: T = {
        ...defaultRow,
        [firstColumnKey]: newRowInput.trim(),
      } as T;
      append(newRow);
      setNewRowInput("");
    }
  };

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  const tableColumns = React.useMemo<ColumnDef<T>[]>(
    () => [
      ...columns.map((config) => {
        const column: ColumnDef<T> = {
          header: config.header,
          accessorKey: config.key as string,
          size: config.width ? parseInt(config.width) : undefined,
          maxSize: config.maxWidth ? parseInt(config.maxWidth) : undefined,
          minSize: config.minWidth ? parseInt(config.minWidth) : undefined,
          cell: ({ row }) => {
            const error = getFieldError(
              errors,
              row.index,
              config.key as Path<T>
            );
            const fieldName: FieldPath<FormData> =
              `rows.${row.index}.${String(config.key)}` as FieldPath<FormData>;

            return (
              <div className="relative flex items-center">
                <TableField<T>
                  control={control}
                  name={fieldName}
                  config={config}
                  hasError={!!error}
                />
                {error && (
                  <div className="absolute right-2">
                    <ErrorIcon message={error} />
                  </div>
                )}
              </div>
            );
          },
        };
        return column;
      }),
      {
        header: "",
        id: "actions",
        size: 5,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="hover:text-destructive text-muted-foreground disabled:text-muted p-1 transition-colors disabled:pointer-events-none"
              onClick={() => remove(row.index)}
              disabled={fields.length === 1}
              title="Delete row"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [columns, control, remove, fields.length, errors]
  );

  const table = useReactTable({
    data: castFieldArrayToRows(fields),
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const border = {
    className: "border-l-4",
    style: {
      borderLeftColor: `var(--${color})`,
    },
  };

  const addBorder = {
    className: "!border-l-4 border-r transition-colors",
    style: {
      borderLeftColor: `color-mix(in srgb, var(--${color}) ${addHover ? 100 : 50}%, transparent)`,
    },
    onMouseEnter: () => setAddHover(true),
    onMouseLeave: () => setAddHover(false),
  };

  return (
    <TooltipProvider>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn("w-full space-y-4", className)}
      >
        <div className="overflow-hidden rounded-lg border">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} {...border}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4.5 overflow-hidden text-ellipsis whitespace-nowrap border-r text-center last:border-r-0"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} {...border}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden text-ellipsis whitespace-nowrap border-r last:border-r-0"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Add new row input */}
              <TableRow {...addBorder}>
                <TableCell colSpan={tableColumns.length} className="p-2">
                  <Input
                    value={newRowInput}
                    onChange={(e) => setNewRowInput(e.target.value)}
                    onBlur={handleAddRow}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddRow();
                      }
                    }}
                    className="hover:border-input w-full max-w-xs border-transparent shadow-none"
                    placeholder={addRowPlaceholder}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button type="submit">{submitButtonText}</Button>
        </div>
      </form>
    </TooltipProvider>
  );
}

export { type ColumnConfig };
