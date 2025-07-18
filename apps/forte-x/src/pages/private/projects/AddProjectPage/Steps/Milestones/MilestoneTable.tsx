import FormTable, {
  type ColumnConfig,
} from "@repo/ui/components/forms/form-table/form-table";
import z from "zod";

const MilestoneSchema = z.object({
  task: z.string(),
  timeLimitation: z.string(),
  type: z.string(),
  evidenceRequired: z.boolean(),
  specificData: z.string(),
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
  return (
    <div>
      <div className="space-y-2">
        <p className="font-semibold">Project Milestone</p>
        <FormTable<Milestone>
          schema={MilestoneSchema}
          columns={milestoneColumns}
          defaultRow={{
            task: "",
            timeLimitation: "",
            type: "",
            evidenceRequired: false,
            specificData: "",
          }}
          onSubmit={(data) => {
            console.log(data);
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="font-semibold">Student Milestone</p>
        <FormTable<Milestone>
          schema={MilestoneSchema}
          columns={milestoneColumns}
          defaultRow={{
            task: "",
            timeLimitation: "",
            type: "",
            evidenceRequired: false,
            specificData: "",
          }}
          onSubmit={(data) => {
            console.log(data);
          }}
        />
      </div>
    </div>
  );
};

export default MilestoneTable;
