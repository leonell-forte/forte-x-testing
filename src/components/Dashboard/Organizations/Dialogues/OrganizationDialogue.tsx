import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Dropdown from "../../../../components/ui/dropdown";
import Button from "../../../../components/ui/button";

interface IOrganizationDialogueProps extends IDialogueProps {}

const OrganizationDialogue = ({
  handleClose,
  isVisible,
  title,
}: IOrganizationDialogueProps) => {
  return (
    <Dialogue isVisible={isVisible} handleClose={handleClose} title={title}>
      <form action="" className="space-y-[22px]">
        <div className="flex items-center gap-4">
          <label htmlFor="" className="w-[200px]">
            Organization
          </label>
          <Input
            // value={watch("email")}
            // onChange={(e) => setValue("email", e.target.value)}
            // error={!!errors.email?.message}
            // helperText={errors.email?.message}
            placeholder="Organization name"
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="w-[200px]">
            Registered name
          </label>
          <Input
            // value={watch("email")}
            // onChange={(e) => setValue("email", e.target.value)}
            // error={!!errors.email?.message}
            // helperText={errors.email?.message}
            placeholder="Registered name"
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="w-[200px]">
            Registration #
          </label>
          <Input
            // value={watch("email")}
            // onChange={(e) => setValue("email", e.target.value)}
            // error={!!errors.email?.message}
            // helperText={errors.email?.message}
            placeholder="Registration number"
          />
        </div>
        <div className="flex items-start gap-4">
          <label htmlFor="" className="w-[200px] pt-3.5">
            Registered address
          </label>
          <div className="w-full space-y-[22px]">
            <Input
              // value={watch("email")}
              // onChange={(e) => setValue("email", e.target.value)}
              // error={!!errors.email?.message}
              // helperText={errors.email?.message}
              placeholder="Registered address"
            />
            <div className="flex flex-col md:flex-row w-full gap-[22px] md:gap-2">
              <Input
                // value={watch("email")}
                // onChange={(e) => setValue("email", e.target.value)}
                // error={!!errors.email?.message}
                // helperText={errors.email?.message}
                placeholder="State"
              />
              <Input
                // value={watch("email")}
                // onChange={(e) => setValue("email", e.target.value)}
                // error={!!errors.email?.message}
                // helperText={errors.email?.message}
                placeholder="Postal Code"
              />
              <Input
                // value={watch("email")}
                // onChange={(e) => setValue("email", e.target.value)}
                // error={!!errors.email?.message}
                // helperText={errors.email?.message}
                placeholder="Country"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="w-[200px]">
            Role
          </label>
          <Dropdown
            //   value={ROLES.find((item) => item.value === watch("role"))?.label}
            //   handleSelect={(val) => setValue("role", val)}
            options={[]}
            placeholder="Select region"
            //   error={!!errors.role?.message}
            //   helperText={errors.role?.message}
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="w-[200px]">
            Role
          </label>
          <Dropdown
            //   value={ROLES.find((item) => item.value === watch("role"))?.label}
            //   handleSelect={(val) => setValue("role", val)}
            options={[]}
            placeholder="Select type"
            //   error={!!errors.role?.message}
            //   helperText={errors.role?.message}
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="w-[200px]">
            Role
          </label>
          <Dropdown
            //   value={ROLES.find((item) => item.value === watch("role"))?.label}
            //   handleSelect={(val) => setValue("role", val)}
            options={[]}
            placeholder="Select status"
            //   error={!!errors.role?.message}
            //   helperText={errors.role?.message}
          />
        </div>

        <div className="flex justify-end gap-4 !mt-10">
          <Button onClick={handleClose} buttonType="secondary">
            Cancel
          </Button>
          <Button loading={false} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default OrganizationDialogue;
