import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import milestoneService, { TOverride } from "api/milestones";

import { TMilestoneEvidence } from "lib/types/milestones";
import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";
import { useModal } from "components/ui/dialogue/v2/Modal";
import { ToastAction, toast } from "components/ui/toast/Toast";

import { EvidenceFieldValues } from "../types/evidence";

interface IEvidenceMutation {
  evidenceId: number;

  milestoneId: string;

  successCallback?: (added: TMilestoneEvidence) => void;
}

export const useEvidenceMutation = ({
  evidenceId,

  milestoneId,

  successCallback,
}: IEvidenceMutation) => {
  const { close } = useModal();
  const isEdit = Boolean(evidenceId);

  const { mutateAsync: addEvidence, isPending } = useMutation({
    mutationFn: evidenceId
      ? (values: EvidenceFieldValues) =>
          evidenceService.update({ milestoneId, values })
      : (values: EvidenceFieldValues) =>
          evidenceService.add({ values, milestoneId }),

    onSuccess: (addedEvidence: { data: TMilestoneEvidence }) => {
      toast({
        title: `Evidence has successfully been ${isEdit ? "updated" : "added"}`,
        action: (
          <ToastAction
            altText="view"
            onClick={() =>
              successCallback
                ? successCallback(addedEvidence.data || addedEvidence)
                : {}
            }
          >
            <p>View</p>
          </ToastAction>
        ),
      });

      amplitude.track(`${isEdit ? "Update" : "Add"} Evidence Form Submission`);
      close();
    },

    onError: (err: any) => {
      toast({
        variant: "danger",
        title: `Failed ${evidenceId ? "updating" : "adding"} evidence`,

        description:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          `There has been an error with ${evidenceId ? "updating" : "adding"} the evidence`,
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

export const useDeleteEvidence = () => {
  const { mutateAsync: deleteEvidence, isPending } = useMutation({
    mutationFn: evidenceService.remove,

    onSuccess: () => {
      toast({
        title: "Evidence has successfully been deleted",
      });
    },

    onError: (err: any) => {
      toast({
        variant: "danger",
        title:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          "There has been an error with deleting the evidence",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["milestone-details"] });
      queryClient.invalidateQueries({
        queryKey: ["evidences"],
      });
    },
  });

  return { deleteEvidence, isPending };
};

export const useOverrideCost = () => {
  const { close } = useModal();

  const { mutateAsync: overrideCost, isPending } = useMutation({
    mutationFn: (values: TOverride) => milestoneService.overrideCost(values),
    onSuccess: () => {
      toast({
        title: "Milestone cost successfully updated.",
      });
      close();
    },
    onError: (err: any) => {
      toast({
        variant: "danger",
        title: "Failed updating cost of milestone",

        description:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          "There has been an error with updating the cost of the milestone.",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestone-details"],
      });
    },
  });

  return { overrideCost, isPending };
};
