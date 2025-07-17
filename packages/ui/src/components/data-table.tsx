import type { RowData, Table as TanStackTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "../lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface DataTableProps<TData extends RowData> {
  table: TanStackTable<TData>;
  renderExpandedContent?: (row: TData) => React.ReactNode;
  getRowCanExpand?: (row: TData) => boolean;
}

const centeredColumns = ["milestone1", "milestone2", "milestone3", "select"];

export function DataTable<TData extends RowData>({
  table,
  renderExpandedContent,
  getRowCanExpand,
}: DataTableProps<TData>) {
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const toggleRow = (rowId: string, isOpen: boolean) => {
    setOpenRows((prev) => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(rowId);
      } else {
        newSet.delete(rowId);
      }
      return newSet;
    });
  };

  // Calculate total columns (add 1 if expandable)
  const totalColumns =
    table.getAllLeafColumns().length + (renderExpandedContent ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {renderExpandedContent && <TableHead className="w-8" />}
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={
                    centeredColumns.includes(header.column.id)
                      ? "text-center"
                      : ""
                  }
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className={`flex w-full items-center gap-1 ${
                        centeredColumns.includes(header.column.id)
                          ? "justify-center"
                          : "justify-start"
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <span className="text-xs">▲</span>,
                        desc: <span className="text-xs">▼</span>,
                      }[header.column.getIsSorted() as string] ?? null}
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const canExpand = getRowCanExpand
                ? getRowCanExpand(row.original)
                : !!renderExpandedContent;
              const isOpen = openRows.has(row.id);

              return (
                <Collapsible
                  key={row.id}
                  open={isOpen}
                  onOpenChange={(open) => toggleRow(row.id, open)}
                  asChild
                >
                  <>
                    <TableRow>
                      {renderExpandedContent && (
                        <TableCell className="w-8 p-2 align-middle">
                          {canExpand && (
                            <CollapsibleTrigger asChild>
                              <button
                                className="hover:bg-muted flex items-center justify-center rounded transition"
                                aria-label={
                                  isOpen ? "Collapse row" : "Expand row"
                                }
                              >
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition duration-200 ease-in-out",
                                    isOpen ? "rotate-180" : ""
                                  )}
                                />
                              </button>
                            </CollapsibleTrigger>
                          )}
                        </TableCell>
                      )}
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* Expanded content row */}
                    {renderExpandedContent && canExpand && (
                      <CollapsibleContent asChild>
                        <TableRow className="text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-full outline-none">
                          <TableCell
                            colSpan={totalColumns}
                            className="bg-muted/50 p-0"
                          >
                            <div
                              className="w-full px-4 py-3"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "anywhere",
                                whiteSpace: "pre-line",
                              }}
                            >
                              {renderExpandedContent(row.original)}
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    )}
                  </>
                </Collapsible>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={totalColumns} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
