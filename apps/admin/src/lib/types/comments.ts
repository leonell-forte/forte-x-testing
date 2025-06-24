export type AddCommentParams = {
  beneficiaryId: number | null;

  evidenceId: number;

  values: {
    message: string;
  };
};

export type DeleteCommentParams = {
  beneficiaryId: number | null;

  evidenceId: number;

  commentId: number;
};

export type Comment = {
  id: number;

  createdAt: string;

  createdBy: {
    id: number;

    firstName: string;

    lastName: string;
  };

  message: string;
};
