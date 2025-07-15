import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import FormTable, {
  type ColumnConfig,
} from "@repo/ui/components/forms/form-table/form-table";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role required"),
  status: z.string().min(1, "Status required"),
});

type User = z.infer<typeof UserSchema>;

const userColumns: ColumnConfig<User>[] = [
  { key: "name", header: "Name", type: "text", placeholder: "Enter name..." },
  {
    key: "email",
    header: "Email",
    type: "email",
    placeholder: "Enter email...",
  },
  { key: "role", header: "Role", type: "text", placeholder: "Enter role..." },
  {
    key: "status",
    header: "Status",
    type: "select",
    placeholder: "Select status",
    options: [
      { value: "active", label: "Active" },
      { value: "suspended", label: "Suspended" },
      { value: "invited", label: "Invited" },
      { value: "pending", label: "Pending" },
      { value: "disabled", label: "Disabled" },
      { value: "deleted", label: "Deleted" },
      { value: "banned", label: "Banned" },
      { value: "inactive", label: "Inactive" },
    ],
    width: "130px",
  },
];

export default function FormTableDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <p>Form Table</p>
          <p className="text-sm">(monday.com inspired)</p>
          <Badge variant="warning">IN PROGRESS</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-wrap gap-2">
        <FormTable<User>
          schema={UserSchema}
          columns={userColumns}
          defaultRow={{ name: "", email: "", role: "", status: "" }}
          onSubmit={(data) => {
            // Do something with the data
            console.log("Submitted users:", data.rows);
          }}
          addRowPlaceholder="+ Add new user"
          submitButtonText="Save Users"
        />
      </CardContent>
    </Card>
  );
}
