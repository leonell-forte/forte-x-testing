import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import userService from "api/users";

import { IUser, UserFieldTypes } from "lib/types/users";
import { formatErrorMessage } from "lib/utils";

import { refreshProfile } from "components/ProfileContext";
import { queryClient } from "components/QueryProvider";

import { useAlert, usePage } from "../hooks";

interface IUserMutation {
  userId: string;

  isProfile?: boolean;

  successCallback?: () => void;
}

const useUserMutation = ({
  userId,

  isProfile,

  successCallback,
}: IUserMutation) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addUser, isPending } = useMutation({
    mutationFn: userId
      ? (values: UserFieldTypes) => userService.update(values)
      : userService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["specific-user", userId] });

      const previousData = queryClient.getQueryData(["specific-user", userId]);

      const previousUsers = queryClient.getQueryData(["users"]);

      return { previousData, previousUsers };
    },

    onSuccess: (addedUser) => {
      queryClient.setQueryData(["specific-user", userId], () => {
        return addedUser.data.data;
      });

      // to prevent upating profile when adding user
      if (isProfile && userId) {
        refreshProfile();
      }

      queryClient.setQueryData(["users"], (old: { items: IUser[] }) => {
        return [...(old?.items || []), addedUser.data.data];
      });

      successCallback?.();

      setAlert({
        status: "success",

        message: isProfile
          ? `Profile updated successfully`
          : `User ${userId ? "updated" : "added"} successfully`,

        title: "Success!",
      });

      amplitude.track(`${userId ? "Update" : "Add"} User Form Submission`);
    },

    onError: (err: any, newUser, context) => {
      setAlert({
        status: "error",

        title: `Failed ${userId ? "updating" : "adding"} user`,

        message:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message,
      });

      queryClient.setQueryData(
        ["specific-user", userId],
        context?.previousData
      );

      queryClient.setQueryData(["users"], context?.previousUsers);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["specific-user", userId] });

      refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  return { addUser, isPending };
};

export const useDeleteUserMutation = (
  id: string,
  succesCallback?: () => void
) => {
  const { page, setPage } = usePage();

  const { setAlert } = useAlert();

  const userQueryKeys = ["users", +page || 1, "", "", []];

  const { mutateAsync: deleteUser, isPending } = useMutation({
    mutationFn: userService.delete,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys });

      const previousUsers = queryClient.getQueryData<IUser[]>(userQueryKeys);

      return { previousUsers };
    },

    onSuccess: () => {
      queryClient.setQueryData(userQueryKeys, (old: { items: IUser[] }) => {
        if (old?.items?.length === 1 && +page !== 1) {
          setPage(page - 1);
        }
        return {
          ...old,
          items: [...(old?.items || [])].filter((item) => item.id !== id),
        };
      });
      succesCallback?.();
      setAlert({
        status: "success",
        message: "User deleted successfully",
        title: "User deleted!",
      });
      amplitude.track(`Delete User Performed`, {
        id,
      });
    },

    onError: (err: any, _, context) => {
      setAlert({
        status: "error",

        title: "Failed deleting user",

        message:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message,
      });

      queryClient.setQueryData(userQueryKeys, context?.previousUsers);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: userQueryKeys });
    },
  });

  return { deleteUser, isPending };
};

export default useUserMutation;
