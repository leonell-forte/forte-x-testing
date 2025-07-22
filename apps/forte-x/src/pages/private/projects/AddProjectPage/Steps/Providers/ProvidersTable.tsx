import { Button } from "@repo/ui/components/button";
import FormTable, {
  type ColumnConfig,
} from "@repo/ui/components/forms/form-table/form-table";
import { SelectionToolbar } from "@repo/ui/components/selection-toolbar";
import { toast } from "@repo/ui/components/sonner";
import { useRef, useState } from "react";
import z from "zod";

import { useStepper } from "@/components/ui/stepper";

const ProviderSchema = z.object({
  provider: z.string(),
  contract: z.string(),
  noOfStudents: z.number(),
  courses: z.string(),
});

type Provider = z.infer<typeof ProviderSchema>;

const providerColumns: ColumnConfig<Provider>[] = [
  {
    key: "provider",
    header: "Provider",
    type: "text",
    placeholder: "Add provider",
  },
  {
    key: "contract",
    header: "Contract",
    type: "text",
    placeholder: "Add contract",
  },
  {
    key: "noOfStudents",
    header: "No of Students",
    type: "number",
    placeholder: "Add no of students",
    maxWidth: "80px",
  },
  {
    key: "courses",
    header: "Courses",
    type: "text",
    placeholder: "Add courses",
  },
];

const ProvidersTable = () => {
  const { setActiveStep } = useStepper();
  const [selectedRows, setSelectedRows] = useState(new Set<number>());
  const ref = useRef<any>(null);

  const handleDelete = () => {
    if (ref.current && selectedRows.size > 0) {
      ref.current.removeRows(Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  const handleClear = () => {
    setSelectedRows(new Set());
  };

  const handleNext = async () => {
    if (ref.current) {
      const isValid = await ref.current.validate();
      if (isValid) {
        const values = ref.current.getValues();
        console.log("Values", values);
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
      <div className="space-y-2">
        <p className="font-semibold">Training Providers</p>
        <FormTable
          ref={ref}
          schema={ProviderSchema}
          columns={providerColumns}
          defaultRow={{
            provider: "",
            contract: "",
            noOfStudents: 0,
            courses: "",
          }}
          onChange={(data) => {
            console.log(data);
          }}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          color="chart-7"
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveStep("milestones")}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
      <SelectionToolbar
        selectedCount={selectedRows.size}
        onDelete={handleDelete}
        onClear={handleClear}
      />
    </div>
  );
};

export default ProvidersTable;
