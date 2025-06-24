import { useMemo, useState } from "react";

import { useCustomPrompt } from "@/components/ui/alert/custom-prompt";
import Button from "@/components/ui/button";
import { useModal } from "@/components/ui/dialogue/v2/Modal";
import Input from "@/components/ui/input";
import RadioGroup from "@/components/ui/radio-group";
import { useBulkUpdateStatus } from "@/lib/mutations/evidences";
import { UpdateEvidenceStatusEnum } from "@/lib/types/evidence";

type TParams = {
  ids: number[];
  successCb: () => void;
};

export function showBulkUpdateStatusModal(params: TParams) {
  useModal.getState().open({
    component: (
      <BulkUpdateStatusModal ids={params.ids} successCb={params.successCb} />
    ),
    title: "Update status",
  });
}

type Status = "approved" | "rejected" | "more information requested";

const statuses = [
  { label: "Approved", value: "approved" },
  {
    label: "Request for more information",
    value: "more information requested",
  },
  { label: "Rejected", value: "rejected" },
];

const titleMap = {
  approved: "Approve Evidence?",
  "more information requested": "Request more information?",
  rejected: "Reject Evidence?",
};

const subTextMap = {
  approved:
    "Approving this marks this evidence as ‘Approved’ under its respective milestone. This action cannot be undone.",
  "more information requested":
    "This will notify the user that supplementing information is needed for this evidence attachment. Add specific requests to the comments to avoid confusion.",
  rejected:
    "Rejecting this will require the user to upload new evidence to its specific milestone. Add specific details on why this evidence was rejected for clarity.",
};

const yesLabelMap = {
  approved: "Approve",
  "more information requested": "Request",
  rejected: "Reject",
};

function BulkUpdateStatusModal({ ids, successCb }: TParams) {
  const { close } = useModal();
  const { open } = useCustomPrompt();
  const [status, setStatus] = useState<Status | "">("");
  const [comment, setComment] = useState("");

  const { updateStatus, isPending } = useBulkUpdateStatus({
    count: ids.length,
    statusType: status,
  });

  const onSubmit = async () => {
    open({
      title: titleMap[status as keyof typeof titleMap],
      subText: subTextMap[status as keyof typeof subTextMap],
      onYes: async () => {
        await updateStatus({
          evidenceIds: ids,
          status: status as UpdateEvidenceStatusEnum,
          comment,
        });
        successCb();
        close();
      },
      yesLabel: yesLabelMap[status as keyof typeof yesLabelMap],
    });
  };

  const isDisabled = useMemo(() => {
    if (!status) return true;
    if (status === "approved") return false;
    return comment.length === 0;
  }, [status, comment]);

  return (
    <div className="space-y-7">
      <RadioGroup
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
        items={statuses}
        className="flex w-full flex-col gap-1"
      />

      <div className="flex w-full flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="comment">
          Comment {status === "approved" ? "(optional)" : "*"}
        </label>
        <Input
          id="comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="flex w-full justify-end">
        <Button
          loading={isPending}
          onClick={onSubmit}
          disabled={isDisabled}
          className="!px-8"
        >
          Update
        </Button>
      </div>
    </div>
  );
}
