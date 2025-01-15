import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import evidenceService from "api/evidence";

import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";

import { useAlert } from "../hooks";
import { Evidence, EvidenceFieldValues } from "../types/evidence";

interface IEvidenceMutation {
  evidenceId: number;

  beneficiaryId: number;

  successCallback?: () => void;
}

export const useEvidenceMutation = ({
  evidenceId,

  beneficiaryId,

  successCallback,
}: IEvidenceMutation) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addEvidence, isPending } = useMutation({
    mutationFn: evidenceId
      ? (values: EvidenceFieldValues) =>
          evidenceService.update({ beneficiaryId, values })
      : (values: EvidenceFieldValues) =>
          evidenceService.add({ values, beneficiaryId }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["evidence", evidenceId] });

      await queryClient.cancelQueries({
        queryKey: ["evidences", beneficiaryId],
      });

      const previousEvidences = queryClient.getQueryData([
        "evidences",

        beneficiaryId,
      ]);

      const previousEvidence = queryClient.getQueryData([
        "evidence",

        evidenceId,
      ]);

      return { previousEvidences, previousEvidence };
    },

    onSuccess: (addedEvidence) => {
      console.log(addedEvidence, "addedEvidence");

      queryClient.setQueryData(
        ["evidences", beneficiaryId],

        (old: { items: Evidence[] }) => {
          return {
            ...old,

            items: [...(old?.items || []), addedEvidence],
          };
        }
      );

      queryClient.setQueryData(
        ["evidence", evidenceId],

        () => addedEvidence
      );

      successCallback?.();

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
    },

    onError: (err: any, newEvidence, context) => {
      setAlert({
        status: "error",

        title: `Failed ${evidenceId ? "updating" : "adding"} evidence`,

        message: formatErrorMessage(err?.response?.data?.data?.[0]),
      });

      queryClient.setQueryData(
        ["evidences", beneficiaryId],

        context?.previousEvidences
      );

      queryClient.setQueryData(
        ["evidence", evidenceId],

        context?.previousEvidence
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence", evidenceId] });

      queryClient.invalidateQueries({ queryKey: ["evidences", beneficiaryId] });
    },
  });

  return { addEvidence, isPending };
};
