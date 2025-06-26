import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import userService from "@/api/users";

import type { IUser, UserFieldTypes } from "@/lib/types/users";
import { formatErrorMessage } from "@/lib/utils";

import { refreshProfile } from "@/components/ProfileContext";
import { queryClient } from "@/components/QueryProvider";

import { useAlert, usePage } from "@/lib/hooks";

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

    onError: (err: any, _, context) => {
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

export const useDeleteUserMutation = (id: string, onSuccess?: () => void) => {
  const { page, setPage } = usePage();

  const { setAlert } = useAlert();

  // Create a more flexible query key matcher that will match all user queries
  const usersQueryKeyPrefix = ["users"];

  const { mutateAsync: deleteUser, isPending } = useMutation({
    mutationFn: userService.delete,

    onMutate: async () => {
      // Cancel all queries that start with the users prefix
      await queryClient.cancelQueries({
        queryKey: usersQueryKeyPrefix,
        exact: false,
      });

      // Store all matching queries to restore in case of error
      const previousQueries = new Map();

      // Find all user queries in the cache
      const queryCache = queryClient.getQueryCache();
      const userQueries = queryCache.findAll({
        queryKey: usersQueryKeyPrefix,
        exact: false,
      });

      // Store the current state of each query
      userQueries.forEach((query) => {
        previousQueries.set(
          query.queryKey,
          queryClient.getQueryData(query.queryKey)
        );
      });

      // Optimistically update all user queries
      userQueries.forEach((query) => {
        const data = queryClient.getQueryData(query.queryKey);
        if (data && typeof data === "object" && "items" in data) {
          queryClient.setQueryData(query.queryKey, {
            ...data,
            items: (data.items as IUser[]).filter((item) => item.id !== id),
          });
        }
      });

      return { previousQueries };
    },

    onSuccess: () => {
      // If we're on a page that's now empty (except page 1), go to previous page
      const currentPageQuery = ["users", +page || 1, "", "", []];

      const currentPageData = queryClient.getQueryData<{ items: IUser[] }>(
        currentPageQuery
      );
      if (currentPageData?.items?.length === 0 && +page !== 1) {
        setPage(page - 1);
      }

      if (onSuccess) {
        onSuccess();
      }

      setAlert({
        status: "success",
        message: "User deleted successfully",
        title: "User deleted!",
      });

      amplitude.track("Delete User Performed", {
        userId: id,
      });
    },

    onError: (err: any, _: any, context: any) => {
      setAlert({
        status: "error",
        title: "Failed deleting user",
        message:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message,
      });

      // Restore all previous queries from the context
      if (context?.previousQueries) {
        context.previousQueries.forEach((data: any, queryKey: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Invalidate all user queries to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: usersQueryKeyPrefix,
        exact: false,
      });
    },
  });

  return { deleteUser, isPending };
};

export default useUserMutation;
