import { useForm } from "react-hook-form";
import Button from "../../../components/ui/button";
import Dialogue, {
  IDialogueProps,
} from "../../../components/ui/dialogue/dialogue";
import Dropdown from "../../../components/ui/dropdown";
import Input from "../../../components/ui/input";
import { ROLES } from "../../../lib/constants";
import { users } from "../../../lib/validators/users";
import { zodResolver } from "@hookform/resolvers/zod";
import userService from "../../../api/users";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "../../ui/spinner/spinner";
import useUserMutation from "../../../lib/mutations/users";
import { UserFieldTypes } from "../../../lib/types/users";
import { IOrganization } from "../../../lib/types/organizations";

interface IUserDialogueProps extends IDialogueProps {
  userId?: string;

  organizations: IOrganization[];
}

const ViewProfileDialogue = ({
  isVisible,

  organizations,

  handleClose,

  userId,
}: IUserDialogueProps) => {
  const [onEdit, setOnEdit] = useState(false);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["specific user", userId],

    queryFn: () => userService.getOne(userId!),

    enabled: !!userId,
  });

  const {
    handleSubmit,

    formState: { errors },

    setValue,

    watch,

    reset,
  } = useForm<UserFieldTypes>({
    resolver: zodResolver(users.schema),

    defaultValues: users.defaultValues(),
  });

  useEffect(() => {
    // sets default value of the form

    if (userData) {
      reset(users.defaultValues(userData));
    }
  }, [userData, reset]);

  const close = () => {
    setOnEdit(false);

    reset();

    handleClose!();
  };

  const { addUser, isPending } = useUserMutation({
    userId: userId!,

    isProfile: true,

    successCallback: close,
  });

  const onSubmit = async (values: UserFieldTypes) => {
    await addUser(values);
  };

  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={close}
      title={onEdit ? "Edit profile" : "Profile"}
    >
      {isLoading ? (
        <div className="w-full h-[470px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2.5"
        >
          <div className="flex items-start">
            <label
              htmlFor=""
              className="w-[140px] pt-4"
            >
              Email
            </label>

            <Input
              disabled
              value={watch("email")}
              onChange={(e) => setValue("email", e.target.value)}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              type="email"
              autoComplete="email"
              placeholder="email@email.com"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="w-[140px] pt-4"
            >
              First name
            </label>

            <Input
              disabled={!onEdit}
              value={watch("firstName")}
              onChange={(e) => setValue("firstName", e.target.value)}
              error={!!errors.firstName?.message}
              helperText={errors.firstName?.message}
              autoComplete="given-name"
              placeholder="James"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="w-[140px] pt-4"
            >
              Last name
            </label>

            <Input
              disabled={!onEdit}
              value={watch("lastName")}
              onChange={(e) => setValue("lastName", e.target.value)}
              error={!!errors.lastName?.message}
              helperText={errors.lastName?.message}
              autoComplete="family-name"
              placeholder="Potter"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="w-[140px] pt-4"
            >
              Phone number
            </label>

            <Input
              disabled={!onEdit}
              value={watch("phoneNumber")}
              onChange={(e) => setValue("phoneNumber", e.target.value)}
              error={!!errors.phoneNumber?.message}
              helperText={errors.phoneNumber?.message}
              autoComplete="tel"
              placeholder="+61 4567323423"
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="w-[140px] pt-4"
            >
              Organization
            </label>

            <Dropdown
              disabled
              value={
                organizations.find(
                  (item) => item.id?.toString() === watch("organizationId"),
                )?.registeredName
              }
              options={organizations.map((item: IOrganization) => ({
                label: item.registeredName,
                value: item.id!.toString(),
              }))}
              handleSelect={(val) => setValue("organizationId", val.toString())}
              placeholder="Select organization"
              error={!!errors.organizationId?.message}
              helperText={errors.organizationId?.message}
              readOnly
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="w-[140px] pt-4"
            >
              Role
            </label>

            <Dropdown
              disabled
              value={ROLES.find((item) => item.value === watch("role"))?.label}
              handleSelect={(val) => setValue("role", val as string)}
              options={ROLES}
              placeholder="Select role"
              error={!!errors.role?.message}
              helperText={errors.role?.message}
            />
          </div>

          <div className="flex justify-end gap-4 !mt-10">
            {!onEdit ? (
              <Button onClick={() => setOnEdit(true)}>Edit</Button>
            ) : (
              <>
                <Button
                  onClick={() => setOnEdit(false)}
                  buttonType="secondary"
                >
                  Cancel
                </Button>

                <Button
                  loading={isPending}
                  type="submit"
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </form>
      )}
    </Dialogue>
  );
};

export default ViewProfileDialogue;
