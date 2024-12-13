import { useAppSelector } from "../../../../../lib/hooks";
import Input from "../../../../ui/input";
import { useQuery } from "@tanstack/react-query";
import commentsService from "../../../../../api/comments";
import { InputAdornment } from "@mui/material";
import { useState } from "react";
import classNames from "classnames";
import {
  useCommentMutation,
  useDeleteCommentMutation,
} from "../../../../../lib/mutations/comments";
import { formatDate } from "../../../../../lib/utils";
import authService from "../../../../../api/auth";
import Spinner from "../../../../../components/ui/spinner/spinner";

const CommentSection = ({ id: evidenceId }: { id: number }) => {
  const [comment, setComment] = useState("");
  const { beneficiaryId } = useAppSelector((state) => state.evidence);

  const { data: user } = useQuery({
    queryKey: ["profile"],

    queryFn: authService.getProfile,
  });

  const { data: commentList, isLoading } = useQuery({
    queryKey: ["comments", beneficiaryId, evidenceId],
    queryFn: () => commentsService.list(beneficiaryId as number, evidenceId),
  });

  const handleSubmit = async () => {
    await addComment({
      beneficiaryId,
      evidenceId,
      values: { message: comment },
    });
  };

  const successCallback = () => setComment("");

  const { addComment, isPending } = useCommentMutation({ successCallback });
  const { deleteComment, isPending: isDeleting } = useDeleteCommentMutation();

  return (
    <div className="space-y-4">
      <p className="font-medium">Comments</p>

      {isLoading ? (
        <div className="w-full h-[40px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <ul className="space-y-[10px]">
          {commentList?.items?.length === 0 ? (
            <div className="text-xs">No comments.</div>
          ) : (
            commentList?.items.map((item, index) => {
              const name = `${item.createdBy.firstName} ${item.createdBy.lastName}`;
              return (
                <li
                  key={index}
                  className="flex justify-between text-[13px] gap-12"
                >
                  <p>{item.message}</p>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-4">
                      <p>{name}</p>

                      {user?.id === item.createdBy.id ? (
                        <button
                          type="button"
                          className="text-mint hover:text-mint/70 hover:underline transition-all"
                          onClick={() =>
                            deleteComment({
                              beneficiaryId,
                              evidenceId,
                              commentId: item.id,
                            })
                          }
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                    <div className="justify-end flex items-center gap-1.5">
                      <p>{formatDate(item.createdAt, "dd-LL-yyyy")}</p>
                      <span className="text-[9px] font-extrabold">|</span>
                      <p className="lowercase">
                        {formatDate(item.createdAt, "hh:mma")}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}

      <form
        id="comments-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
      >
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    type="submit"
                    form="comments-form"
                    className={classNames(
                      "mx-1.5 text-[12px] font-medium transition",
                      comment.length === 0
                        ? "cursor-not-allowed text-mint/50"
                        : "text-mint hover:text-mint/70"
                    )}
                    disabled={isPending}
                  >
                    Post Comment
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />
      </form>
    </div>
  );
};

export default CommentSection;
