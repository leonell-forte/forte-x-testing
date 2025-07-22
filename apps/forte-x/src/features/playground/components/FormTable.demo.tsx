import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import FormTable from "@repo/ui/components/forms/form-table/form-table";
import { SelectionToolbar } from "@repo/ui/components/selection-toolbar";
import { toast } from "@repo/ui/components/sonner";
import { useRef } from "react";
import { useState } from "react";

import { UserSchema, defaultRow, userColumns } from "./constants";

export default function FormTableDemo() {
  const [table1Selection, setTable1Selection] = useState(new Set<number>());
  const [table2Selection, setTable2Selection] = useState(new Set<number>());
  const table1Ref = useRef<any>(null);
  const table2Ref = useRef<any>(null);

  const handleNext = async () => {
    if (table1Ref.current && table2Ref.current) {
      const isValid = await table1Ref.current.validate();
      const isValid2 = await table2Ref.current.validate();
      if (isValid && isValid2) {
        const values = table1Ref.current.getValues();
        toast({
          title: "Go to next step",
          description: JSON.stringify(values, null, 2),
        });
      } else {
        toast({
          title: "Form is invalid!",
        });
      }
    }
  };

  const handleDelete = () => {
    if (table1Ref.current && table1Selection.size > 0) {
      table1Ref.current.removeRows(Array.from(table1Selection));
      setTable1Selection(new Set());
    }
    if (table2Ref.current && table2Selection.size > 0) {
      table2Ref.current.removeRows(Array.from(table2Selection));
      setTable2Selection(new Set());
    }
  };

  const handleClear = () => {
    setTable1Selection(new Set());
    setTable2Selection(new Set());
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <p>Form Table</p>
            <p className="text-sm">(monday.com inspired)</p>
            <Badge variant="warning">IN PROGRESS</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex w-full flex-wrap gap-8">
          <div className="w-full space-y-4">
            <p className="text-lg font-semibold">Users (Group 1)</p>
            <FormTable
              schema={UserSchema}
              columns={userColumns}
              defaultRow={defaultRow}
              onChange={(data) => {
                console.log("Users Group 1", data.rows);
              }}
              addRowPlaceholder="+ Add new user"
              selectedRows={table1Selection}
              onSelectionChange={setTable1Selection}
              ref={table1Ref}
              color="primary"
            />
          </div>
          <div className="w-full space-y-4">
            <p className="text-lg font-semibold">Users (Group 2)</p>
            <FormTable
              schema={UserSchema}
              columns={userColumns}
              defaultRow={defaultRow}
              onChange={(data) => {
                console.log("Users Group 2", data.rows);
              }}
              addRowPlaceholder="+ Add new user"
              selectedRows={table2Selection}
              onSelectionChange={setTable2Selection}
              ref={table2Ref}
              color="chart-4"
            />
          </div>
          <div className="ml-auto">
            <Button onClick={handleNext} className="w-fit">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <SelectionToolbar
        selectedCount={table1Selection.size + table2Selection.size}
        onDelete={handleDelete}
        onClear={handleClear}
        itemLabel="user"
      />
    </>
  );
}
