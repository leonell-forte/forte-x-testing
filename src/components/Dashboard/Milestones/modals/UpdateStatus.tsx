import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import { useForm } from "react-hook-form";

import {
  UpdateEvidenceStatusEnum,
  UpdateStatusFieldValues,
} from "lib/types/evidence";
import { updateStatusSchema } from "lib/validators/evidence";

import { queryClient } from "components/QueryProvider";
import Button from "components/ui/button";
import CustomController from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";
import { toast } from "components/ui/toast/Toast";

export enum EvidenceStatusEnum {
  APPROVE = "approved",
  REJECT = "rejected",
  MORE_INFO = "more information requested",
}

type Params = {
  evidenceId: number;
  status: UpdateEvidenceStatusEnum;
  milestoneId: string;
};

export const showUpdateStatus = ({
  evidenceId,
  status,
  milestoneId,
}: Params) => {
  const title = {
    [EvidenceStatusEnum.APPROVE]: "Approve Evidence?",
    [EvidenceStatusEnum.REJECT]: "Reject Evidence?",
    [EvidenceStatusEnum.MORE_INFO]: "Request More Information?",
  };
  useModal.getState().open({
    component: (
      <UpdateStatusModal
        evidenceId={evidenceId}
        status={status}
        milestoneId={milestoneId}
      />
    ),
    size: "2xl",
    title: title[status],
  });
};

const UpdateStatusModal = ({ evidenceId, status, milestoneId }: Params) => {
  const form = useForm<UpdateStatusFieldValues>({
    defaultValues: {
      evidenceIds: [evidenceId],
      status,
      comment: "",
    },
    resolver: zodResolver(updateStatusSchema),
  });
  const { control } = form;

  const description = {
    [EvidenceStatusEnum.APPROVE]:
      "Approving this marks this evidence as ‘Approved’ under its respective milestone. This action cannot be undone. Evidence?",
    [EvidenceStatusEnum.REJECT]:
      "Rejecting this will require the user to upload new evidence to its specific milestone. Add specific details on why this evidence was rejected for clarity.",
    [EvidenceStatusEnum.MORE_INFO]:
      "This will notify the user that supplementing information is needed for this evidence attachment. Add specific requests to the comments to avoid confusion.",
  };

  const buttonLabel = {
    [EvidenceStatusEnum.APPROVE]: "Approve",
    [EvidenceStatusEnum.REJECT]: "Reject",
    [EvidenceStatusEnum.MORE_INFO]: "Request",
  };

  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: ({ evidenceIds, status, comment }: UpdateStatusFieldValues) =>
      evidenceService.updateStatus(evidenceIds, status, comment),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Evidence updated successfully",
      });

      queryClient.setQueryData(
        ["milestone-details", milestoneId],
        (oldData: any) => {
          return {
            ...oldData,
            evidences: oldData.evidences.map((evidence: any) => {
              if (evidence.id === evidenceId) {
                return {
                  ...evidence,
                  status,
                };
              }
              return evidence;
            }),
          };
        }
      );

      useModal.getState().close();
    },
    onError: (err: any) => {
      console.log(err);

      toast({
        variant: "danger",
        title: "Error",
        description: err.response.data.message || "Something went wrong",
      });
    },
  });

  const onSubmit = (data: UpdateStatusFieldValues) => {
    updateStatus(data);
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-6">
        <p>{description[status]}</p>

        <CustomController
          control={control}
          name="comment"
          label="Comment (Optional)"
          render={({ field }) => <Input {...field} multiline />}
        />
      </div>
      <div className="mt-12 flex justify-end gap-2.5">
        <Button
          buttonType="secondary"
          onClick={() => useModal.getState().close()}
        >
          Cancel
        </Button>
        <Button loading={isPending} type="submit">
          {buttonLabel[status]}
        </Button>
      </div>
    </Form>
  );
};
