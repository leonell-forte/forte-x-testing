import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Checkbox from "../../../../components/ui/checkbox";
import { Link } from "react-router-dom";
import Button from "../../../../components/ui/button";

interface IImportDialogueProps extends IDialogueProps {}

const ImportDialogue = ({ ...props }: IImportDialogueProps) => {
  return (
    <Dialogue
      {...props}
      title="Import beneficiaries"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 divide-x">
          <div className="space-y-2 pr-5">
            <p>Your CSV must include columns for:</p>

            <ul className="list-disc pl-6">
              <li>First name</li>

              <li>Last name</li>

              <li>Provider name</li>

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
                status, Address, Socio-economic status, Highest education level,
                and Language(s) spoken)
              </li>
            </ul>
          </div>

          <div className="space-y-2 pl-5">
            <label htmlFor="">Upload CSV</label>

            <Input placeholder="Upload your file here" />

            <Checkbox
              labelClass="text-[16px] leading-[120%]"
              label="Overwrite existing beneficiaries with the same email."
            />
          </div>
        </div>

        <p className="font-semibold">
          Need help getting started?{" "}
          <Link
            to="#"
            className="text-mint font-semibold"
          >
            Download a basic CSV template here.
          </Link>
        </p>
      </div>

      <div className="flex gap-2.5 justify-end mt-12">
        <Button
          onClick={props.handleClose}
          buttonType="secondary"
        >
          Cancel
        </Button>

        <Button>Import</Button>
      </div>
    </Dialogue>
  );
};

export default ImportDialogue;
