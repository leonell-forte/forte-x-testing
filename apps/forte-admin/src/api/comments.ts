import { api } from "../lib/axios/interceptor";
import {
  AddCommentParams,
  Comment,
  DeleteCommentParams,
} from "../lib/types/comments";

export class CommentsService {
  async add({ beneficiaryId, evidenceId, values }: AddCommentParams) {
    const response = await api.post(
      `/beneficiaries/${beneficiaryId}/evidences/${evidenceId}/comments`,
      values
    );

    return response.data;
  }

  async remove({ beneficiaryId, evidenceId, commentId }: DeleteCommentParams) {
    const response = await api.delete(
      `/beneficiaries/${beneficiaryId}/evidences/${evidenceId}/comments/${commentId}`
    );

    return response.data;
  }

  async list(
    beneficiaryId: number,
    evidenceId: number
  ): Promise<{ items: Comment[]; totalSize: number; pageSize: number }> {
    const response = await api.get(
      `/beneficiaries/${beneficiaryId}/evidences/${evidenceId}/comments`
    );

    return response.data;
  }
}

const commentsService = new CommentsService();

export default commentsService;
