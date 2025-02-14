import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import userService from "api/users";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ROLES } from "lib/constants";
import { useProfile } from "lib/hooks";
import useUserMutation from "lib/mutations/users";
import { IOrganization } from "lib/types/organizations";
import { UserFieldTypes } from "lib/types/users";
import { users } from "lib/validators/users";

import { useConfirmPrompt } from "components/ui/alert/confirm-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";
import Tooltip from "components/ui/tooltip/Tooltip";

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
  const profile = useProfile();
  const myRole = profile?.role;
  const { setShowPrompt } = useConfirmPrompt();

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

    watch,

    setValue,
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

  const canEditRole = useMemo(() => {
    if (!myRole) return false;
    if (!userData) return true;
    if (myRole.includes("admin") && userData.role?.includes("owner"))
      return false;
    if (myRole.includes("owner") || myRole.includes("admin")) return true;
    return false;
  }, [myRole, userData]);

  const tooltipMsg = useMemo(() => {
    if (!userData || !myRole) return "";
    if (myRole.includes("admin") && userData.role?.includes("owner"))
      return "You cannot change an owner's role.";
    return "You cannot change your own role.";
  }, [myRole, userData]);

  const organizationId = watch("organizationId");
  const isReadOnly = watch("role").includes("read-only");

  const isNonForteUser = useMemo(
    () => profile?.organization !== "Forte",
    [profile]
  );

  const userOrganization = useMemo(
    () => organizations.find((x) => x.name === profile?.organization),
    [profile, organizations]
  );

  const filteredOrg = useMemo(
    () =>
      organizations
        .filter((org) => {
          if (isReadOnly || isNonForteUser) return org.type !== "forte";
          return true;
        })
        .map((item: IOrganization) => ({
          label: item.registeredName,
          value: String(item.id),
        })),
    [organizations, isReadOnly, isNonForteUser]
  );

  const isForteOrg = useMemo(() => {
    return organizations.some(
      // eslint-disable-next-line
      (org) => org.id == organizationId && org.type === "forte"
    );
  }, [organizationId, organizations]);

  const filteredRoles = useMemo(
    () =>
      ROLES.filter((role) => {
        if (isForteOrg) return role.value !== "read-only";
        if (isNonForteUser) return role.value !== "owner";
        return true;
      }),
    [isForteOrg, isNonForteUser]
  );

  useEffect(() => {
    if (isNonForteUser && userOrganization?.id) {
      setValue("organizationId", String(userOrganization.id));
    }
  }, [isNonForteUser, profile, userOrganization, setValue]);

  console.log(watch("role"));

  return (
    <Dialogue
      confirmBeforeLeave
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
                  disabled={isNonForteUser}
                  enableSearch
                  value={
                    organizations.find(
                      (item) => item.id?.toString() === field.value
                    )?.registeredName
                  }
                  options={filteredOrg}
                  handleSelect={(val) => field.onChange(val)}
                  placeholder="Organization"
                />
              );
            }}
          />
          <Tooltip content={tooltipMsg} {...(canEditRole && { open: false })}>
            <div>
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
                      options={filteredRoles}
                      placeholder="Role"
                      disabled={!canEditRole}
                    />
                  );
                }}
              />
            </div>
          </Tooltip>
          <div className="!mt-10 flex justify-end gap-4">
            <Button onClick={() => setShowPrompt(true)} buttonType="secondary">
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
