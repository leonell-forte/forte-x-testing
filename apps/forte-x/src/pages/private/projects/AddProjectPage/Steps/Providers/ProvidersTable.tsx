import FormTable, {
  type ColumnConfig,
} from "@repo/ui/components/forms/form-table/form-table";
import z from "zod";

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
  },
  {
    key: "courses",
    header: "Courses",
    type: "text",
    placeholder: "Add courses",
  },
];

const ProvidersTable = () => {
  return (
    <div>
      <div className="space-y-2">
        <p className="font-semibold">Training Providers</p>
        <FormTable<Provider>
          schema={ProviderSchema}
          columns={providerColumns}
          defaultRow={{
            provider: "",
            contract: "",
            noOfStudents: 0,
            courses: "",
          }}
          onSubmit={(data) => {
            console.log(data);
          }}
        />
      </div>
    </div>
  );
};

export default ProvidersTable;
