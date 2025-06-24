import { useMutation } from "@tanstack/react-query";
import commentsService from "@/api/comments";

// import * as amplitude from "@amplitude/analytics-browser";
import type { Comment } from "@/lib/types/comments";

import { queryClient } from "@/components/QueryProvider";

import { useAlert } from "@/lib/hooks";

interface ICommentMutationProps {
  successCallback?: () => void;
}

export const useCommentMutation = ({
  successCallback,
}: ICommentMutationProps) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addComment, isPending } = useMutation({
    mutationFn: commentsService.add,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousComments = queryClient.getQueryData(["comments"]);

      return { previousComments };
    },

    onSuccess: (addedComment) => {
      queryClient.setQueryData(["comments"], () => {
        return addedComment.data.data;
      });

      successCallback?.();

      setAlert({
        title: "Success!",

        message: `Comment added successfully`,

        status: "success",
      });

      // keeping in case required to track in amplitude
      //   amplitude.track(
      //     "Add Comment Form Submission"
      //   );
    },

    onError: (err: any, _, context) => {
      setAlert({
        title: "Failed adding comment",
        message: err?.response?.data?.message,
        status: "error",
      });

      queryClient.setQueryData(["comments"], context?.previousComments);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return { addComment, isPending };
};

export const useDeleteCommentMutation = (successCallback?: () => void) => {
  const { setAlert } = useAlert();

  const { mutateAsync: deleteComment, isPending } = useMutation({
    mutationFn: commentsService.remove,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments",
      ]);

      return { previousComments };
    },

    onSuccess: () => {
      successCallback?.();

      setAlert({
        title: "Comment deleted",

        message: "Comment deleted successfully",

        status: "success",
      });

      // keeping in case required to track in amplitude
      // amplitude.track(`Delete Comment Performed`, {
      //   id: id,
      // });
    },

    onError: (err: any, _, context) => {
      setAlert({
        title: "Failed deleting comment",

        message: err?.response?.data?.message,

        status: "error",
      });

      queryClient.setQueryData(
        ["comments"],

        context?.previousComments
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return { deleteComment, isPending };
};
