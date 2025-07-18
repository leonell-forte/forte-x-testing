import { Button } from "@repo/ui/components/button";
import Form from "@repo/ui/components/forms/form";
import FormInput from "@repo/ui/components/forms/form-input";
import { useZodForm } from "@repo/ui/hooks/useZodForm";
import { z } from "zod";

const ProjectDetails = () => {
  const form = useZodForm({
    defaultValues: {},
    schema: z.object({}),
  });
  return (
    <div className="max-w-[800px] space-y-4">
      <p className="text-lg text-green-300">Step 1 of 5</p>
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold">Add project details</h2>
          <p className="text-sm text-white/60">
            Enter the core information about your project to establish a shared
            understanding among all stakeholders, including key details and the
            main point of the product
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Project details</h3>

          <Form form={form} onSubmit={() => {}} className="space-y-12">
            <div>
              <FormInput name="projectName" label="Project name" />
              <FormInput name="description" label="Project description" />
              <FormInput name="noOfStudents" label="Number of students" />
              <div className="flex gap-4">
                <FormInput
                  containerClassName="w-full"
                  name="startDate"
                  label="What quarter does training starts?"
                />
                <FormInput
                  containerClassName="w-full"
                  name="endDate"
                  label="What quarter does training ends?"
                />
              </div>
              <div className="flex gap-4">
                <FormInput
                  name="firstname"
                  label="First name"
                  containerClassName="w-full"
                />
                <FormInput
                  name="lastname"
                  label="Last name"
                  containerClassName="w-full"
                />
              </div>
              <FormInput name="email" label="Email" />
              <FormInput name="phone" label="Phone" />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Next</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
