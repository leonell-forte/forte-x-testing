import { useForm } from "react-hook-form";
import Button from "../../../../components/ui/button";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Dropdown from "../../../../components/ui/dropdown";
import Input from "../../../../components/ui/input";
import { ROLES } from "../../../../lib/constants";
import { IOrganization, IUser } from "../../../../pages/Users/types";
import { z } from "zod";
import { users } from "../../../../lib/validators/users";
import { zodResolver } from "@hookform/resolvers/zod";
import userService from "../../../../api/users";
import { useState } from "react";

interface IUserDialogueProps extends IDialogueProps {
  user?: IUser | null;
  organizations: IOrganization[];
}

const UserDialogue = ({
  isVisible,
  organizations,
  handleClose,
  user,
}: IUserDialogueProps) => {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<z.infer<typeof users.schema>>({
    resolver: zodResolver(users.schema),
    defaultValues: users.defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof users.schema>) => {
    setLoading(true);
    try {
      await userService.add(values);
      handleClose!();
      reset();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={handleClose}
      title={user ? "Edit user" : "Add user"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Email
          </label>
          <Input
            onChange={(e) => setValue("email", e.target.value)}
            error={!!errors.email?.message}
            helperText={errors.email?.message}
            type="email"
            autoComplete="email"
            placeholder="email@email.com"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            First name
          </label>
          <Input
            onChange={(e) => setValue("firstName", e.target.value)}
            error={!!errors.firstName?.message}
            helperText={errors.firstName?.message}
            autoComplete="given-name"
            placeholder="James"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Last name
          </label>
          <Input
            onChange={(e) => setValue("lastName", e.target.value)}
            error={!!errors.lastName?.message}
            helperText={errors.lastName?.message}
            autoComplete="family-name"
            placeholder="Potter"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Phone number
          </label>
          <Input
            onChange={(e) => setValue("phoneNumber", e.target.value)}
            error={!!errors.phoneNumber?.message}
            helperText={errors.phoneNumber?.message}
            autoComplete="tel"
            placeholder="+61 4567323423"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Organization
          </label>
          <Dropdown
            value={
              organizations.find((item) => item.id == watch("organizationId"))
                ?.registeredName
            }
            options={organizations.map((item: IOrganization) => ({
              label: item.registeredName,
              value: item.id,
            }))}
            handleSelect={(val) => setValue("organizationId", val.toString())}
            placeholder="Select organization"
            error={!!errors.organizationId?.message}
            helperText={errors.organizationId?.message}
            readOnly
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Role
          </label>
          <Dropdown
            value={ROLES.find((item) => item.value === watch("role"))?.label}
            handleSelect={(val) => setValue("role", val)}
            options={ROLES}
            placeholder="Select role"
            error={!!errors.role?.message}
            helperText={errors.role?.message}
          />
        </div>

        <div className="flex justify-end gap-4 !mt-10">
          <Button onClick={handleClose} buttonType="secondary">
            Cancel
          </Button>
          <Button loading={loading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default UserDialogue;
