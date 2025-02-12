import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import userService from "api/users";

import { IUser, UserFieldTypes } from "lib/types/users";
import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";

import { useAlert } from "../hooks";

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
        queryClient.setQueryData(["profile"], (prev: IUser) => {
          return addedUser.data.data;
        });
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

      queryClient.setQueryData(["profile"], context?.previousData);

      queryClient.setQueryData(["users"], context?.previousUsers);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["specific-user", userId] });

      queryClient.invalidateQueries({ queryKey: ["profile"] });

      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  return { addUser, isPending };
};

export default useUserMutation;
