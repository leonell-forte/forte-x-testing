import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { DataTable } from "@repo/ui/components/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, Square } from "lucide-react";
import * as React from "react";

type Student = {
  name: string;
  status: "Pre-training" | "In training" | "Post-training";
  provider: string;
  course: string;
  dates: string[];
  milestone1: boolean;
  milestone2: boolean;
  milestone3: boolean;
  gender: string;
  ethnicity: string;
  age: number;
};

const statusVariantMap = {
  "Pre-training": "default",
  "In training": "secondary",
  "Post-training": "destructive",
} as const;

const defaultData: Student[] = [
  {
    name: "Ava Chen",
    status: "Pre-training",
    provider: "SkillSpring",
    course: "Data Analytics",
    dates: ["06/01/2024", "06/15/2024"],
    milestone1: true,
    milestone2: true,
    milestone3: true,
    gender: "Female",
    ethnicity: "Asian",
    age: 25,
  },
  {
    name: "Mateo Rivera",
    status: "Pre-training",
    provider: "SkillSpring",
    course: "Data Analytics",
    dates: ["06/01/2024", "06/15/2024"],
    milestone1: true,
    milestone2: true,
    milestone3: true,
    gender: "Male",
    ethnicity: "Hispanic",
    age: 28,
  },
  {
    name: "Sophia Williams",
    status: "In training",
    provider: "NextGen Academy",
    course: "Web Development",
    dates: ["06/10/2024", "07/10/2024"],
    milestone1: true,
    milestone2: true,
    milestone3: false,
    gender: "Female",
    ethnicity: "White",
    age: 30,
  },
  {
    name: "Elijah Johnson",
    status: "In training",
    provider: "NextGen Academy",
    course: "Web Development",
    dates: ["06/10/2024", "07/10/2024"],
    milestone1: true,
    milestone2: true,
    milestone3: false,
    gender: "Male",
    ethnicity: "Black",
    age: 27,
  },
  {
    name: "Mia Patel",
    status: "Post-training",
    provider: "SkillSpring",
    course: "UI/UX Design",
    dates: ["05/01/2024", "05/31/2024"],
    milestone1: true,
    milestone2: false,
    milestone3: false,
    gender: "Female",
    ethnicity: "Asian",
    age: 26,
  },
  {
    name: "Liam O'Connor",
    status: "Post-training",
    provider: "SkillSpring",
    course: "UI/UX Design",
    dates: ["05/01/2024", "05/31/2024"],
    milestone1: true,
    milestone2: false,
    milestone3: false,
    gender: "Male",
    ethnicity: "White",
    age: 29,
  },
];

const renderCheckbox = (value: boolean) => {
  return value ? (
    <Check className="text-success-foreground size-5" />
  ) : (
    <Square className="text-border-foreground size-5" />
  );
};

const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 32,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as Student["status"];
      const variant = statusVariantMap[status];
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "dates",
    header: "Dates",
    cell: (info) => (
      <div>
        {(info.getValue() as string[]).map((date, idx) => (
          <div key={idx}>{date}</div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "milestone1",
    header: "Milestone 1",
    cell: (info) => (
      <div className="flex items-center justify-center">
        {renderCheckbox(info.getValue() as boolean)}
      </div>
    ),
  },
  {
    accessorKey: "milestone2",
    header: "Milestone 2",
    cell: (info) => (
      <div className="flex items-center justify-center">
        {renderCheckbox(info.getValue() as boolean)}
      </div>
    ),
  },
  {
    accessorKey: "milestone3",
    header: "Milestone 3",
    cell: (info) => (
      <div className="flex items-center justify-center">
        {renderCheckbox(info.getValue() as boolean)}
      </div>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "ethnicity",
    header: "Ethnicity",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

const initialVisibility: VisibilityState = {
  gender: false,
  ethnicity: false,
  age: false,
};

export default function StudentsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility);

  const table = useReactTable({
    data: defaultData,
    columns,
    state: { columnVisibility, rowSelection, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="ml-auto w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Show/Hide Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllLeafColumns()
              .filter((column) => column.id !== "select")
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    table.getColumn(column.id)?.toggleVisibility(!!value)
                  }
                >
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable
        table={table}
        renderExpandedContent={(row) => (
          <div>
            {row.name} Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Saepe fugit iusto veritatis vitae quasi, beatae nihil, officia cum
            ad voluptatem, molestias earum cupiditate? Deleniti voluptatum animi
            temporibus, maiores voluptates impedit.
          </div>
        )}
      />
    </div>
  );
}
