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
import { formSchemas } from "@repo/ui/hooks/useZodForm";
import { z } from "zod";

const UserSchema = z.object({
  name: formSchemas.name(),
  email: formSchemas.email(),
  status: formSchemas.required(),
  birthdate: formSchemas.required(),
  document: formSchemas.required(),
});

type User = z.infer<typeof UserSchema>;

const userColumns: ColumnConfig<User>[] = [
  {
    key: "name",
    header: "Name",
    type: "text",
    placeholder: "Enter name...",
    minWidth: "182px",
  },
  {
    key: "email",
    header: "Email",
    type: "email",
    placeholder: "Enter email...",
  },
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
  {
    key: "birthdate",
    header: "Birth Date",
    type: "date",
    placeholder: "Enter birthdate...",
  },
  {
    key: "document",
    type: "file",
    header: "Files",
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxWidth: "120px",
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
          defaultRow={{
            name: "",
            email: "",
            status: "",
            birthdate: "",
            document: "",
          }}
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
