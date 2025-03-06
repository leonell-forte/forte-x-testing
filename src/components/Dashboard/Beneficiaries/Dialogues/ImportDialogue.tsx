import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useImportBeneficiaryMutation } from "lib/mutations/beneficiaries";
import { IImportBeneficiariesFieldValues } from "lib/types/beneficiaries";
import { importBeneficiaries } from "lib/validators/beneficiaries";

import Button from "components/ui/button";
import Checkbox from "components/ui/checkbox";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import FileInput from "components/ui/file-input";

interface IImportDialogueProps extends IDialogueProps {}

const ImportDialogue = ({ ...props }: IImportDialogueProps) => {
  const {
    handleSubmit,

    control,

    setValue,

    formState: { errors },
  } = useForm<IImportBeneficiariesFieldValues>({
    resolver: zodResolver(importBeneficiaries.schema),

    defaultValues: importBeneficiaries.defaultValue,
  });

  const { importBeneficiaries: beneficiariesImport, isPending } =
    useImportBeneficiaryMutation({
      successCallback: props.handleClose,
    });

  const onSubmit = async (values: IImportBeneficiariesFieldValues) => {
    await beneficiariesImport(values);
  };

  return (
    <Dialogue
      {...props}
      title="Import beneficiaries"
      className="lg:!max-w-screen-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:divide-x">
            <div className="space-y-2">
              <p>Your CSV must include columns for:</p>

              <ul className="list-disc pl-6">
                <li>First name</li>

                <li>Last name</li>

                <li>
                  Contract ID (You can find the Contract ID on the Contracts
                  page).
                </li>

                <li>Email</li>
              </ul>

              <p>
                You may also choose to include columns for all other beneficiary
                fields, including:
              </p>

              <ul className="list-disc pl-6">
                <li>Cohort (Start date, End date, and Program)</li>

                <li>Social media (LinkedIn, Github, and Other)</li>
                <li>
                  Demographics (Date of birth, Ethnicity, Gender, Disability
                  status, Address, Socio-economic status, Highest education
                  level, and Language(s) spoken)
                </li>
              </ul>
            </div>

            <div className="space-y-2 md:pl-6">
              <label htmlFor="">Upload CSV</label>

              {/* <Input placeholder="Upload your file here" /> */}
              <Controller
                control={control}
                name="file"
                render={({ field }) => {
                  return (
                    <FileInput
                      raw
                      accept=".csv"
                      placeholder="Upload your file here"
                      onUploadStart={(data) => {
                        field.onChange(data);
                      }}
                      error={!!errors.file?.message}
                      helperText={errors.file?.message}
                    />
                  );
                }}
              />

              <Checkbox
                onChange={(e) => {
                  setValue("isOverwriteByEmailEnabled", e.target.checked);
                }}
                labelClass="text-[14px]"
                label="Overwrite existing beneficiaries with the same email."
              />
            </div>
          </div>

          <p className="text-sm">
            Need help getting started?{" "}
            <a
              href="/beneficiaries-template.csv"
              download="Import Beneficiaries Template.csv"
              className="font-semibold text-mint"
            >
              Download a basic CSV template here.
            </a>
          </p>
        </div>

        <div className="mt-12 flex justify-end gap-2.5">
          <Button onClick={props.handleClose} buttonType="secondary">
            Cancel
          </Button>

          <Button type="submit" loading={isPending}>
            Import
          </Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default ImportDialogue;
