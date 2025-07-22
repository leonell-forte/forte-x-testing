import { Button } from "@repo/ui/components/button";
import FormTable, {
  type ColumnConfig,
} from "@repo/ui/components/forms/form-table/form-table";
import { SelectionToolbar } from "@repo/ui/components/selection-toolbar";
import { toast } from "@repo/ui/components/sonner";
import { formSchemas } from "@repo/ui/hooks/useZodForm";
import { useRef, useState } from "react";
import z from "zod";

import { useStepper } from "@/components/ui/stepper";

const MilestoneSchema = z.object({
  task: formSchemas.required(),
  timeLimitation: formSchemas.optional(),
  type: formSchemas.optional(),
  evidenceRequired: formSchemas.boolean(),
  specificData: formSchemas.optional(),
});

type Milestone = z.infer<typeof MilestoneSchema>;

const milestoneColumns: ColumnConfig<Milestone>[] = [
  {
    key: "task",
    header: "Task",
    type: "text",
    placeholder: "Add task",
  },
  {
    key: "timeLimitation",
    header: "Time Limitation",
    type: "text",
    placeholder: "Add time limitation",
  },
  {
    key: "type",
    header: "Type",
    type: "text",
    placeholder: "Add type",
  },
  {
    key: "evidenceRequired",
    header: "Evidence Required",
    type: "select",
    placeholder: "Add evidence required",
    options: [
      {
        value: "Yes",
        label: "Yes",
      },
      {
        value: "No",
        label: "No",
      },
    ],
  },
  {
    key: "specificData",
    header: "Specific Data",
    type: "text",
    placeholder: "Add specific data",
  },
];

const MilestoneTable = () => {
  const { setActiveStep } = useStepper();
  const [group1Selection, setGroup1Selection] = useState(new Set<number>());
  const [group2Selection, setGroup2Selection] = useState(new Set<number>());

  const group1Ref = useRef<any>(null);
  const group2Ref = useRef<any>(null);

  const handleDelete = () => {
    if (group1Ref.current && group1Selection.size > 0) {
      group1Ref.current.removeRows(Array.from(group1Selection));
      setGroup1Selection(new Set());
    }
    if (group2Ref.current && group2Selection.size > 0) {
      group2Ref.current.removeRows(Array.from(group2Selection));
      setGroup2Selection(new Set());
    }
  };

  const handleClear = () => {
    setGroup1Selection(new Set());
    setGroup2Selection(new Set());
  };

  const handleNext = async () => {
    if (group1Ref.current && group2Ref.current) {
      const isValid = await group1Ref.current.validate();
      const isValid2 = await group2Ref.current.validate();
      if (isValid && isValid2) {
        const values1 = group1Ref.current.getValues();
        const values2 = group2Ref.current.getValues();
        console.log("Values", values1, values2);
        setActiveStep("providers");
      } else {
        toast({
          title: "Form is invalid!",
        });
      }
    }
  };

  return (
    <div className="space-y-24">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="font-semibold">Project Milestone</p>
          <FormTable
            schema={MilestoneSchema}
            columns={milestoneColumns}
            defaultRow={{
              task: "",
              timeLimitation: "",
              type: "",
              evidenceRequired: false,
              specificData: "",
            }}
            onChange={(data) => {
              console.log(data);
            }}
            selectedRows={group1Selection}
            onSelectionChange={setGroup1Selection}
            ref={group1Ref}
          />
        </div>

        <div className="space-y-2">
          <p className="font-semibold">Student Milestone</p>
          <FormTable
            schema={MilestoneSchema}
            columns={milestoneColumns}
            defaultRow={{
              task: "",
              timeLimitation: "",
              type: "",
              evidenceRequired: false,
              specificData: "",
            }}
            onChange={(data) => {
              console.log(data);
            }}
            selectedRows={group2Selection}
            onSelectionChange={setGroup2Selection}
            ref={group2Ref}
            color="chart-4"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveStep("project-details")}
        >
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
      <SelectionToolbar
        selectedCount={group1Selection.size + group2Selection.size}
        onDelete={handleDelete}
        onClear={handleClear}
      />
    </div>
  );
};

export default MilestoneTable;
