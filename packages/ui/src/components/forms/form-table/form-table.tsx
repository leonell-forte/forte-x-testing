import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@repo/ui/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CircleAlert } from "lucide-react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  type FieldError,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type Path,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "../../checkbox";
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

interface ModifiedEditableTableProps<T extends FieldValues>
  extends Omit<EditableTableProps<T>, "onSubmit" | "submitButtonText"> {
  onChange?: (data: { rows: T[] }) => void;
  selectedRows: Set<number>;
  onSelectionChange: (selectedRows: Set<number>) => void;
}

const EditableTable = forwardRef(function EditableTable<T extends FieldValues>(
  {
    schema,
    columns,
    defaultRow,
    onChange,
    initialData = [defaultRow],
    addRowPlaceholder = "+ Add new item",
    className = "",
    color = "primary",
    selectedRows,
    onSelectionChange,
  }: ModifiedEditableTableProps<T>,
  ref: React.Ref<any>
) {
  const [newRowInput, setNewRowInput] = useState("");
  const [addHover, setAddHover] = useState(false);

  const formSchema = z.object({
    rows: z.array(schema),
  });

  type FormData = { rows: T[] };

  const {
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { rows: initialData },
    mode: "onChange",
  });

  // @ts-expect-error - react-hook-form constraint issue with generic types
  const { fields, append, remove } = useFieldArray<FormData, "rows">({
    control,
    name: "rows",
  });

  const watchedData = useWatch({
    control,
    name: "rows",
  });

  useEffect(() => {
    if (onChange && watchedData) {
      onChange({ rows: watchedData });
    }
  }, [watchedData, onChange]);

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
    getValues: () => getValues(),
    errors,
    removeRows: (indices: number[]) => {
      const sortedIndices = [...indices].sort((a, b) => b - a);
      sortedIndices.forEach((index) => remove(index));
    },
    getSelectedRowsData: () => {
      const currentData = getValues().rows;
      return Array.from(selectedRows)
        .map((index) => currentData[index])
        .filter(Boolean);
    },
  }));

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

  const handleRowSelection = (rowIndex: number, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(rowIndex);
    } else {
      newSelection.delete(rowIndex);
    }
    onSelectionChange(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndices = new Set(fields.map((_, index) => index));
      onSelectionChange(allIndices);
    } else {
      onSelectionChange(new Set());
    }
  };

  const isAllSelected =
    fields.length > 0 && selectedRows.size === fields.length;
  const isIndeterminate =
    selectedRows.size > 0 && selectedRows.size < fields.length;

  const tableColumns = React.useMemo<ColumnDef<T>[]>(
    () => [
      {
        header: () => (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all rows"
          />
        ),
        id: "select",
        size: 1,
        cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.has(row.index)}
            onCheckedChange={(checked) =>
              handleRowSelection(row.index, Boolean(checked))
            }
            aria-label={`Select row ${row.index + 1}`}
          />
        ),
      },
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
    ],
    [
      columns,
      control,
      remove,
      fields.length,
      errors,
      selectedRows,
      onSelectionChange,
      isAllSelected,
      isIndeterminate,
    ]
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
      <div className={cn("w-full", className)}>
        <div className="overflow-hidden rounded-lg border">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} {...border}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "px-4.5 overflow-hidden text-ellipsis whitespace-nowrap border-r text-center last:border-r-0",
                        header.column.id === "select" && "pl-0"
                      )}
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
                      className={cn(
                        "overflow-hidden text-ellipsis whitespace-nowrap border-r last:border-r-0",
                        cell.column.id === "select" && "pl-0 text-center"
                      )}
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
      </div>
    </TooltipProvider>
  );
});

export default EditableTable;

export { type ColumnConfig };
