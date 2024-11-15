import { useForm } from "react-hook-form";
import Button from "../../../components/ui/button";
import Dialogue, {
  IDialogueProps,
} from "../../../components/ui/dialogue/dialogue";
import Dropdown from "../../../components/ui/dropdown";
import Input from "../../../components/ui/input";
import { ROLES } from "../../../lib/constants";
import { z } from "zod";
import { users } from "../../../lib/validators/users";
import { zodResolver } from "@hookform/resolvers/zod";
import userService from "../../../api/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../components/QueryProvider";
import { useAlert } from "../../../lib/hooks";
import { useEffect, useState } from "react";
import Spinner from "../../ui/spinner/spinner";
import * as amplitude from "@amplitude/analytics-browser";
import { IOrganization } from "../../../pages/Organizations/types";

interface IUserDialogueProps extends IDialogueProps {
  userId?: string;

  organizations: IOrganization[];

  page?: number;
}

const ViewProfileDialogue = ({
  isVisible,

  organizations,

  handleClose,

  userId,

  page,
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

    getValues,

    watch,

    reset,
  } = useForm<z.infer<typeof users.schema>>({
    resolver: zodResolver(users.schema),

    defaultValues: users.defaultValues(),
  });

  useEffect(() => {
    // sets default value of the form

    if (userData) {
      reset(users.defaultValues(userData));
    }
  }, [userData, reset]);

  const { setAlert } = useAlert();

  const close = () => {
    reset();

    handleClose!();
  };

  const { mutateAsync: addUser, isPending } = useMutation({
    mutationFn: () => userService.update(getValues()),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["users", page] });

      const previousUsers = queryClient.getQueryData(["users", page]);

      return { previousUsers };
    },

    onSuccess: (addedUser) => {
      queryClient.setQueryData(["users", page], (old: any) => {
        return {
          ...old,

          items: [...(old?.items || []), addedUser.data.data],
        };
      });

      close();

      reset();

      setAlert({
        status: "success",

        message: `Profile updated successfully`,

        title: "Success!",
      });

      amplitude.track(`Update Profile Form Submission`, { id: userId });
    },

    onError: (err: any, newUser, context) => {
      setAlert({
        status: "error",

        title: `Failed updating profile`,

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(["users", page], context?.previousUsers);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", page] });
    },
  });

  const onSubmit = async () => {
    await addUser();
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          <div className="flex items-center">
            <label htmlFor="" className="w-[140px]">
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
          <div className="flex items-center">
            <label htmlFor="" className="w-[140px]">
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

          <div className="flex items-center">
            <label htmlFor="" className="w-[140px]">
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
          <div className="flex items-center">
            <label htmlFor="" className="w-[140px]">
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
          <div className="flex items-center">
            <label htmlFor="" className="w-[140px]">
              Organization
            </label>

            <Dropdown
              disabled
              value={
                organizations.find(
                  (item) => item.id?.toString() === watch("organizationId")
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

          <div className="flex items-center">
            <label htmlFor="" className="w-[140px]">
              Role
            </label>

            <Dropdown
              disabled
              value={ROLES.find((item) => item.value === watch("role"))?.label}
              handleSelect={(val) => setValue("role", val)}
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
                <Button onClick={() => setOnEdit(false)} buttonType="secondary">
                  Cancel
                </Button>

                <Button loading={isPending} type="submit">
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
