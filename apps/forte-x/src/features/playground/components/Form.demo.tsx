import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import Form from "@repo/ui/components/forms/form";
import FormDatePicker from "@repo/ui/components/forms/form-datepicker";
import FormInput from "@repo/ui/components/forms/form-input";
import FormMobile from "@repo/ui/components/forms/form-mobile";
import FormSelect from "@repo/ui/components/forms/form-select";
import { formSchemas, useZodForm } from "@repo/ui/hooks/useZodForm";
import { z } from "zod";

const registrationForm = {
  defaultValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    startDate: "",
    endDate: "",
    phone: "",
    rememberMe: false,
    linkedin: "",
    status: "",
    cohortRange: {
      from: undefined,
      to: undefined,
    },
  },
  schema: z
    .object({
      name: formSchemas.name(),
      email: formSchemas.email(),
      gender: formSchemas.required(),
      password: formSchemas.password(6),
      confirmPassword: formSchemas.confirmPassword(),
      cohortRange: formSchemas.dateRange(),
      phone: formSchemas.phone(),
      rememberMe: formSchemas.boolean(),
      linkedin: formSchemas.url(),
      birthDate: formSchemas.required(),
      status: formSchemas.required(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
};

type RegistrationFormData = z.infer<typeof registrationForm.schema>;

export default function FormDemo() {
  const form = useZodForm(registrationForm);

  const onSubmit = async (data: RegistrationFormData) => {
    alert("Registration data:" + JSON.stringify(data));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Components</CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        <Form onSubmit={onSubmit} form={form} className="space-y-6">
          <div className="grid grid-cols-3 gap-4 space-y-2">
            {/* Email Field */}
            <FormInput name="email" label="Email" />
            {/* Password Field */}
            <FormInput name="password" label="Password" type="password" />
            <FormSelect
              name="gender"
              label="Gender"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
            <FormSelect
              name="status"
              label="Status"
              localSearch
              options={[
                { value: "active", label: "Active" },
                { value: "suspended", label: "Suspended" },
                { value: "invited", label: "Invited" },
                { value: "pending", label: "Pending" },
                { value: "disabled", label: "Disabled" },
                { value: "deleted", label: "Deleted" },
                { value: "banned", label: "Banned" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <FormDatePicker name="birthDate" label="Birth Date" mode="single" />
            <FormDatePicker
              name="cohortRange"
              label="Cohort Period"
              mode="range"
            />
            <FormMobile name="phone" label="Phone" />
          </div>
          <Button type="submit" className="w-36">
            Submit
          </Button>

          {/* Submit Button */}
        </Form>
      </CardContent>
    </Card>
  );
}
