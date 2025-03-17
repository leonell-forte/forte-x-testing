import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import userService from "api/users";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { DEFAULT_DATE_FORMAT, ROLES } from "lib/constants";
import useUserMutation from "lib/mutations/users";
import { IOrganization } from "lib/types/organizations";
import { UserFieldTypes, UserStatusValues } from "lib/types/users";
import { formatDate, sortOptions } from "lib/utils";
import { users } from "lib/validators/users";

import { useProfile } from "components/ProfileContext";
import { useConfirmPrompt } from "components/ui/alert/confirm-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import InputMobile from "components/ui/form/InputMobile";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";
import { Tooltip } from "components/ui/tooltip/Tooltip";

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
  const [editMode, setEditMode] = useState(userId ? false : true);
  const { profile } = useProfile();
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

    setValue,

    formState: { isDirty },
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

  const isOwnAccount = Number(userId) === Number(profile?.id);

  const canEditRole = useMemo(() => {
    if (!myRole) return false;
    if (!userData) return true;
    if (isOwnAccount) return false;
    if (myRole.includes("admin") && userData.role?.includes("owner"))
      return false;
    if (myRole.includes("owner") || myRole.includes("admin")) return true;
    return false;
  }, [myRole, userData, isOwnAccount]);

  const tooltipMsg = useMemo(() => {
    if (!userData || !myRole) return "";
    if (myRole.includes("admin") && userData.role?.includes("owner"))
      return "You cannot change an owner's role.";
    return "You cannot change your own role.";
  }, [myRole, userData]);

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
          if (isNonForteUser) return org.type !== "forte";
          return true;
        })
        .map((item: IOrganization) => ({
          label: item.registeredName,
          value: String(item.id),
        })),
    [organizations, isNonForteUser]
  );

  const filteredRoles = useMemo(
    () =>
      ROLES.filter((role) => {
        if (isNonForteUser || myRole?.includes("admin"))
          return role.value !== "owner";
        return true;
      }),
    [isNonForteUser, myRole]
  );

  const getTitle = useCallback(() => {
    if (userId) {
      return editMode ? "Edit user" : "View user";
    }
    return "Add user";
  }, [userId, editMode]);

  const handleCancel = () => {
    if (!userId && isDirty) {
      setShowPrompt(true);
      return;
    }

    reset();
    setEditMode(false);
    if (!userId) close();
  };

  useEffect(() => {
    if (isNonForteUser && userOrganization?.id) {
      setValue("organizationId", String(userOrganization.id));
    }
  }, [isNonForteUser, profile, userOrganization, setValue]);

  // autosave start

  const formId = "project-form";

  useAutoSaveForm(form, {
    formId,
    enabled: !userId,
  });

  // autosave end

  return (
    <Dialogue
      confirmBeforeLeave={isDirty}
      isVisible={isVisible}
      handleClose={close}
      title={getTitle()}
      formId={formId}
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
                <Input
                  {...field}
                  autoComplete="email"
                  placeholder="Email"
                  // disabled={profile?.email === field.value} uncomment to disable if email is same as user's email
                  // disables email on edit mode
                  disabled={Boolean(userId)}
                />
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
                  disabled={!editMode}
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
                  disabled={!editMode}
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
                <InputMobile
                  label="Phone number"
                  {...field}
                  disabled={!editMode}
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
                  disabled={isNonForteUser || !editMode}
                  enableSearch
                  value={
                    organizations.find(
                      (item) => item.id?.toString() === field.value
                    )?.registeredName
                  }
                  options={sortOptions(filteredOrg)}
                  handleSelect={(val) => field.onChange(val)}
                  placeholder="Select organization"
                />
              );
            }}
          />
          <Tooltip
            title={tooltipMsg}
            {...(canEditRole && { open: false })}
            followCursor
          >
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
                      placeholder="Select role"
                      disabled={!canEditRole || isOwnAccount || !editMode}
                    />
                  );
                }}
              />
            </div>
          </Tooltip>

          <Controller
            name="status"
            label="Status"
            required
            control={control}
            render={({ field }) => {
              return (
                <Dropdown
                  value={[...UserStatusValues, "invited"].find((item) =>
                    field.value?.includes(item)
                  )}
                  handleSelect={(val) => field.onChange(val)}
                  options={UserStatusValues.filter(
                    (item) => item !== "invited"
                  ).map((item) => ({
                    label: capitalize(item),
                    value: item,
                  }))}
                  placeholder="Status"
                  disabled={userId ? !editMode : field.value === "invited"}
                />
              );
            }}
          />

          {Boolean(userId) && !isNonForteUser && (
            <div
              className={classNames(
                "flex w-full flex-col gap-y-1.5 md:flex-row md:items-center"
              )}
            >
              <label className={"min-w-[140px]"}>Terms</label>
              <Input
                disabled
                value={`Accepted${userData?.signUpSource ? ` on ${userData?.signUpSource}` : ""} at ${formatDate(userData?.agreedTermsAt || userData?.createdAt || "", DEFAULT_DATE_FORMAT + " HH:mm aa")}`}
              />
            </div>
          )}

          <div className="!mt-10 flex justify-end gap-4">
            {editMode ? (
              <>
                <Button onClick={handleCancel} buttonType="secondary">
                  Cancel
                </Button>

                <Button loading={isPending} type="submit" disabled={!isDirty}>
                  {userId ? "Update" : "Add"}
                </Button>
              </>
            ) : (
              <Button
                loading={isPending}
                type="button"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </Form>
      )}
    </Dialogue>
  );
};

export default UserDialogue;
