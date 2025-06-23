import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import userService from "api/users";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ROLES } from "lib/constants";
import useUserMutation from "lib/mutations/users";
import { IOrganization } from "lib/types/organizations";
import { UserFieldTypes } from "lib/types/users";
import { users } from "lib/validators/users";

import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import InputMobile from "components/ui/form/InputMobile";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

interface IUserDialogueProps {
  userId?: string;
  organizations: IOrganization[];
}

type TParams = {
  userId?: string;
  organizations?: IOrganization[];
};

export function showProfileModal(params: TParams) {
  useModal.getState().open({
    component: (
      <ViewProfileDialogue
        organizations={params.organizations || []}
        userId={String(params.userId)}
      />
    ),
    size: "lg",
    title: "Profile",
  });
}

const ViewProfileDialogue = ({ organizations, userId }: IUserDialogueProps) => {
  const { close } = useModal();

  const [onEdit, setOnEdit] = useState(false);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["specific user", userId],

    queryFn: () => userService.getOne(userId!),

    enabled: !!userId,
  });

  const form = useForm<UserFieldTypes>({
    resolver: zodResolver(users.schema),

    defaultValues: users.defaultValues(),
  });

  const { reset, control } = form;

  useEffect(() => {
    // sets default value of the form

    if (userData) {
      reset(users.defaultValues(userData));
    }
  }, [userData, reset]);

  const { addUser, isPending } = useUserMutation({
    userId: userId!,

    isProfile: true,

    successCallback: close,
  });

  const onSubmit = async (values: UserFieldTypes) => {
    await addUser(values);
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  disabled
                  autoComplete="email"
                  placeholder="Email"
                />
              );
            }}
            name="email"
            label="Email"
            required
          />

          <Controller
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  readOnly={!onEdit}
                  autoComplete="given-name"
                  placeholder="First name"
                />
              );
            }}
            name="firstName"
            label="First name"
            required
          />

          <Controller
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  readOnly={!onEdit}
                  autoComplete="family-name"
                  placeholder="Last name"
                />
              );
            }}
            name="lastName"
            label="Last name"
            required
          />

          <Controller
            control={control}
            render={({ field }) => {
              return (
                <InputMobile
                  {...field}
                  readOnly={!onEdit}
                  placeholder="Phone number"
                />
              );
            }}
            name="phoneNumber"
            label="Phone number"
            required
          />

          <Controller
            control={control}
            required
            render={({ field }) => {
              return (
                <Dropdown
                  value={
                    organizations.find(
                      (item) => item.id?.toString() === field.value
                    )?.registeredName
                  }
                  options={organizations.map((item: IOrganization) => ({
                    label: item.registeredName,
                    value: String(item.id),
                  }))}
                  placeholder="Organization"
                  disabled
                />
              );
            }}
            name="organizationId"
            label="Organization"
          />

          <Controller
            control={control}
            required
            render={({ field }) => {
              return (
                <Dropdown
                  value={
                    ROLES.find((item) => field.value?.includes(item.value))
                      ?.label
                  }
                  options={[]}
                  placeholder="Role"
                  disabled
                />
              );
            }}
            name="role"
            label="Role"
          />

          <div className="!mt-10 flex justify-end gap-4">
            {!onEdit ? (
              <Button onClick={() => setOnEdit(true)}>Edit</Button>
            ) : (
              <>
                <Button onClick={() => setOnEdit(false)} buttonType="secondary">
                  Cancel
                </Button>

                <Button loading={isPending} type="submit">
                  Save
                </Button>
              </>
            )}
          </div>
        </Form>
      )}
    </div>
  );
};

export default ViewProfileDialogue;
