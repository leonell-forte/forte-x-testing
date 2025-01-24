import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import userService from "api/users";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { ROLES } from "lib/constants";
import useUserMutation from "lib/mutations/users";
import { IOrganization } from "lib/types/organizations";
import { UserFieldTypes } from "lib/types/users";
import { users } from "lib/validators/users";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

interface IUserDialogueProps extends IDialogueProps {
  userId?: string;

  organizations: IOrganization[];
}

const UserDialogue = ({
  isVisible,

  organizations,

  handleClose,

  userId,
}: IUserDialogueProps) => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["specific-user", userId],

    queryFn: () => userService.getOne(userId!),

    enabled: !!userId,
  });

  const {
    handleSubmit,

    setValue,

    reset,

    control,
  } = useForm<UserFieldTypes>({
    resolver: zodResolver(users.schema),

    defaultValues: users.defaultValues(),
  });

  useEffect(() => {
    // sets default value of the form

    if (userId) {
      reset(users.defaultValues(userData));
    }
  }, [userData, reset, userId]);

  const close = () => {
    reset();

    handleClose?.();
  };

  // implements optimistic update after adding user

  const { addUser, isPending } = useUserMutation({
    userId: userId!,

    isProfile: false,

    successCallback: close,
  });

  const onSubmit = async (values: UserFieldTypes) => {
    await addUser(values);
  };

  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={close}
      title={userId ? "Edit user" : "Add user"}
    >
      {isLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          <div className="flex items-start">
            <label htmlFor="" className="w-[140px] pt-3">
              Email
            </label>

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                  <Input
                    {...field}
                    error={!!error?.message}
                    helperText={error?.message}
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="w-[140px] pt-3">
              First name
            </label>

            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                  <Input
                    {...field}
                    error={!!error?.message}
                    helperText={error?.message}
                    autoComplete="given-name"
                    placeholder="First name"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="w-[140px] pt-3">
              Last name
            </label>

            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                  <Input
                    {...field}
                    error={!!error?.message}
                    helperText={error?.message}
                    autoComplete="family-name"
                    placeholder="Last name"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="w-[140px] pt-3">
              Phone number
            </label>

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                  <Input
                    {...field}
                    phoneNUmber
                    error={!!error?.message}
                    helperText={error?.message}
                    autoComplete="tel"
                    placeholder="Phone number"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="w-[140px] pt-3">
              Organization
            </label>

            <Controller
              name="organizationId"
              control={control}
              render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                  <Dropdown
                    enableSearch
                    value={
                      organizations.find(
                        (item) => item.id?.toString() === field.value
                      )?.registeredName
                    }
                    options={organizations.map((item: IOrganization) => ({
                      label: item.registeredName,
                      value: item.id!.toString(),
                    }))}
                    handleSelect={(val) =>
                      setValue("organizationId", val.toString())
                    }
                    placeholder="Organization"
                    error={!!error?.message}
                    helperText={error?.message}
                    readOnly
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="w-[140px] pt-3">
              Role
            </label>

            <Controller
              name="role"
              control={control}
              render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                  <Dropdown
                    value={
                      ROLES.find((item) => item.value === field.value)?.label
                    }
                    handleSelect={(val) => setValue("role", val as string)}
                    options={ROLES}
                    placeholder="Role"
                    error={!!error?.message}
                    helperText={error?.message}
                  />
                );
              }}
            />
          </div>

          <div className="!mt-10 flex justify-end gap-4">
            <Button onClick={close} buttonType="secondary">
              Cancel
            </Button>

            <Button loading={isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      )}
    </Dialogue>
  );
};

export default UserDialogue;
