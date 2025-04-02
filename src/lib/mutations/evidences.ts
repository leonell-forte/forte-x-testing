import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import evidenceService from "api/evidence";

import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";
import { useModal } from "components/ui/dialogue/v2/Modal";

import { useAlert } from "../hooks";
import { EvidenceFieldValues } from "../types/evidence";

interface IEvidenceMutation {
  evidenceId: number;

  milestoneId: string;

  successCallback?: (id?: string) => void;
}

export const useEvidenceMutation = ({
  evidenceId,

  milestoneId,

  successCallback,
}: IEvidenceMutation) => {
  const { setAlert } = useAlert();
  const { close } = useModal();

  const { mutateAsync: addEvidence, isPending } = useMutation({
    mutationFn: evidenceId
      ? (values: EvidenceFieldValues) =>
          evidenceService.update({ milestoneId, values })
      : (values: EvidenceFieldValues) =>
          evidenceService.add({ values, milestoneId }),

    onSuccess: (addedEvidence: EvidenceFieldValues) => {
      successCallback?.(String(addedEvidence.id));

      setAlert({
        title: "Success!",

        status: "success",

        message: `Evidence has been ${
          evidenceId ? "updated" : "added"
        } successfully`,
      });

      amplitude.track(
        `${evidenceId ? "Update" : "Add"} Evidence Form Submission`
      );
      close();
    },

    onError: (err: any) => {
      setAlert({
        status: "error",

        title: `Failed ${evidenceId ? "updating" : "adding"} evidence`,

        message: formatErrorMessage(err?.response?.data?.data?.[0]),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence", evidenceId] });

      queryClient.invalidateQueries({
        queryKey: ["milestone-details"],
      });
    },
  });

  return { addEvidence, isPending };
};
