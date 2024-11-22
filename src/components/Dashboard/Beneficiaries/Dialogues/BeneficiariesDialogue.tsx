import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Dropdown from "../../../../components/ui/dropdown";
import Button from "../../../../components/ui/button";

interface IBeneficiariesDialogueProps extends IDialogueProps {}

const BeneficiariesDialogue = ({ ...props }: IBeneficiariesDialogueProps) => {
  return (
    <Dialogue
      {...props}
      title="Add beneficiaries"
    >
      <form
        action=""
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              First name
            </label>

            <Input placeholder="First name" />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Last name
            </label>

            <Input placeholder="Last name" />
          </div>
          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Provider
            </label>

            <Dropdown
              options={[]}
              placeholder="Select provider"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Email
            </label>

            <Input
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Phone
            </label>

            <Input
              type="number"
              placeholder="Phone"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Status
            </label>

            <Dropdown
              options={[]}
              placeholder="Status"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Risk level
            </label>

            <Dropdown
              options={[]}
              placeholder="Select risk level"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Contract
            </label>

            <Input placeholder="Select contract" />
          </div>
        </div>

        <div className="flex items-center !mt-0">
          <p className="text-[20px] font-semibold w-[190px]">Cohort</p>

          <hr className="w-full" />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Start date
              </label>

              <Input placeholder="Select date" />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                End date
              </label>

              <Input placeholder="Select date" />
            </div>
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Program
            </label>

            <Input placeholder="Program" />
          </div>
        </div>

        <div className="flex items-center !mt-0">
          <p className="text-[20px] font-semibold w-[190px]">Social media</p>

          <hr className="w-full" />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Linkedin
              </label>

              <Input placeholder="Linkdin link" />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Github
              </label>

              <Input placeholder="Github link" />
            </div>
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Other
            </label>

            <Input placeholder="Other" />
          </div>
        </div>

        <div className="flex items-center !mt-0">
          <p className="text-[20px] font-semibold w-[190px]">Demographics</p>

          <hr className="w-full" />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Date of birth
              </label>

              <Input placeholder="Select date" />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Etnicity
              </label>

              <Dropdown
                options={[]}
                placeholder="Select"
              />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Gender
              </label>

              <Dropdown
                options={[]}
                placeholder="Select"
              />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Disability status
              </label>

              <Dropdown
                options={[]}
                placeholder="Select"
              />
            </div>
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Address
            </label>

            <Input placeholder="Address" />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Socio-economic status
            </label>

            <Input placeholder="Socio-economic status" />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Highest education level
            </label>

            <Input placeholder="Highest education level" />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Language(s) spoken
            </label>

            <Dropdown
              options={[]}
              placeholder="Select"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            buttonType="secondary"
            onClick={props.handleClose}
          >
            Cancel
          </Button>

          <Button>Save</Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default BeneficiariesDialogue;
