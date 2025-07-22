import { type ColumnConfig } from "@repo/ui/components/forms/form-table/form-table";
import { formSchemas } from "@repo/ui/hooks/useZodForm";
import { Cat, Dog, Dumbbell, Fish, Guitar, Rabbit, Turtle } from "lucide-react";
import { z } from "zod";

export const UserSchema = z.object({
  name: formSchemas.name(),
  status: formSchemas.required(),
  birthdate: formSchemas.required(),
  document: formSchemas.file(),
  courses: formSchemas.array(),
});

type User = z.infer<typeof UserSchema>;

export const userColumns: ColumnConfig<User>[] = [
  {
    key: "name",
    header: "Name",
    type: "text",
    maxWidth: "208px",
  },
  {
    key: "status",
    header: "Status",
    type: "select",
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
    maxWidth: "70px",
  },
  {
    key: "birthdate",
    header: "Birth Date",
    type: "date",
    maxWidth: "80px",
    minWidth: "80px",
  },
  {
    key: "document",
    type: "file",
    header: "Files",
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxWidth: "80px",
  },
  {
    key: "courses",
    type: "multi-select",
    header: "Courses",
    options: [
      { value: "math", label: "Math", icon: Turtle },
      { value: "science", label: "Science", icon: Cat },
      { value: "history", label: "History", icon: Dog },
      { value: "english", label: "English", icon: Fish },
      { value: "art", label: "Art", icon: Rabbit },
      { value: "music", label: "Music", icon: Guitar },
      {
        value: "physical-education",
        label: "Physical Education",
        icon: Dumbbell,
      },
    ],
    maxCount: 3,
    minWidth: "100px",
    maxWidth: "550px",
  },
];

export const defaultRow = {
  name: "",
  status: "",
  birthdate: "",
  document: "" as any,
  courses: [],
};
