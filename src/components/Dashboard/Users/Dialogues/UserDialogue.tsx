import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "api/users";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ROLES } from "lib/constants";
import useUserMutation from "lib/mutations/users";
import { IOrganization } from "lib/types/organizations";
import { ProfileType } from "lib/types/profile";
import { UserFieldTypes } from "lib/types/users";
import { users } from "lib/validators/users";

import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
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
  const qc = useQueryClient();
  const profile = qc.getQueryData(["profile"]) as ProfileType;

  const { data: userData, isLoading } = useQuery({
    queryKey: ["specific-user", userId],

    queryFn: () => userService.getOne(userId!),

    enabled: !!userId,
  });

  const form = useForm<UserFieldTypes>({
    resolver: zodResolver(users.schema),

    defaultValues: users.defaultValues(),
  });

  const {
    reset,

    control,
  } = form;

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
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
          <Controller
            name="email"
            label="Email"
            required
            control={control}
            render={({ field }) => {
              return (
                <Input {...field} autoComplete="email" placeholder="Email" />
              );
            }}
          />

          <Controller
            name="firstName"
            label="First name"
            required
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  autoComplete="given-name"
                  placeholder="First name"
                />
              );
            }}
          />

          <Controller
            name="lastName"
            label="Last name"
            required
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  autoComplete="family-name"
                  placeholder="Last name"
                />
              );
            }}
          />

          <Controller
            name="phoneNumber"
            label="Phone number"
            required
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  phoneNUmber
                  autoComplete="tel"
                  placeholder="Phone number"
                />
              );
            }}
          />

          <Controller
            name="organizationId"
            label="Organization"
            required
            control={control}
            render={({ field }) => {
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
                    value: String(item.id),
                  }))}
                  handleSelect={(val) => field.onChange(val)}
                  placeholder="Organization"
                />
              );
            }}
          />

          <Controller
            name="role"
            label="Role"
            required
            control={control}
            render={({ field }) => {
              return (
                <Dropdown
                  value={
                    ROLES.find((item) => field.value?.includes(item.value))
                      ?.label
                  }
                  handleSelect={(val) => field.onChange(val)}
                  options={ROLES}
                  placeholder="Role"
                  disabled={Number(profile?.id) === Number(userData?.id)}
                />
              );
            }}
          />
          <div className="!mt-10 flex justify-end gap-4">
            <Button onClick={close} buttonType="secondary">
              Cancel
            </Button>

            <Button loading={isPending} type="submit">
              Save
            </Button>
          </div>
        </Form>
      )}
    </Dialogue>
  );
};

export default UserDialogue;
