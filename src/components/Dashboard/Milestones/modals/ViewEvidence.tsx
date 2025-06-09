import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import commentsService from "api/comments";
import evidenceService from "api/evidence";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useEvidenceMutation } from "lib/mutations/evidences";
import { Evidences, IsAuthorized } from "lib/role-permissions";
import {
  Evidence as EvidenceType,
  UpdateEvidenceStatusEnum,
} from "lib/types/evidence";
import { EvidenceStatus } from "lib/types/milestones";
import { getStatusVariant } from "lib/utils";
import { evidence } from "lib/validators/evidence";

import Button from "components/ui/button";
import CustomController from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import FileInput from "components/ui/file-input";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Tabs, { TabData } from "components/ui/tabs/Tabs";

import Details from "./Details";
import Evidence from "./Evidence";
import History from "./History";
import { showUpdateStatus } from "./UpdateStatus";

type TParams = {
  milestoneId: string;
  evidenceId: number;
  beneficiaryId: number;
  status: EvidenceStatus;
};

export function showViewEvidenceModal(params: TParams) {
  useModal.getState().open({
    component: (
      <ViewEvidenceModal
        milestoneId={params.milestoneId}
        evidenceId={params.evidenceId}
        beneficiaryId={params.beneficiaryId}
      />
    ),
    size: "2xl",
    title: (
      <div className="flex items-center gap-3">
        <span>Evidence ID: {params.evidenceId}</span>
        <Status variant={getStatusVariant(params.status)}>
          {params.status}
        </Status>
      </div>
    ),
  });
}

function ViewEvidenceModal({
  milestoneId,
  evidenceId,
  beneficiaryId,
}: Omit<TParams, "status">) {
  const { data: evidenceData, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", evidenceId],

    queryFn: () => evidenceService.getOne(beneficiaryId, evidenceId),

    enabled: Boolean(evidenceId) && Boolean(beneficiaryId),
  });

  const form = useForm<z.infer<typeof evidence.schema>>({
    defaultValues: evidence.defaultValues(evidenceData),
    resolver: zodResolver(evidence.schema),
  });

  const { file } = form.watch();

  console.log(form.formState.errors);

  const { data: fileData, isLoading: isFileLoading } = useQuery({
    queryKey: ["file", evidenceData?.file.fileUrl],

    queryFn: () => evidenceService.getFile(evidenceData?.file.fileUrl || ""),

    enabled: Boolean(evidenceData?.file.fileUrl),

    refetchOnWindowFocus: false,
  });

  const { data: beneficiary, isLoading: isBeneficiaryLoading } = useQuery({
    queryKey: ["evidence-beneficiary", beneficiaryId],

    queryFn: () => beneficiariesService.getOne(beneficiaryId),

    enabled: Boolean(beneficiaryId),

    refetchOnWindowFocus: false,
  });

  const { data: commentList, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", beneficiaryId, evidenceId],
    queryFn: () => commentsService.list(beneficiaryId as number, evidenceId),
  });

  const tabs = [
    {
      value: "evidence",
      label: "Evidence",
      content: (
        <Evidence file={file} fileData={fileData} loading={isFileLoading} />
      ),
    },
    {
      value: "evidence-details",
      label: "Evidence Details",
      content: (
        <Details
          beneficiary={beneficiary}
          evidenceData={evidenceData}
          milestoneId={milestoneId}
        />
      ),
    },
    {
      value: "history",
      label: "History",
      content: (
        <History
          beneficiaryId={evidenceData?.beneficiaryId as number}
          evidenceId={evidenceData?.id as number}
          evidenceData={evidenceData as EvidenceType}
        />
      ),
    },
  ] satisfies TabData[];

  const handleUpdateStatus = (status: UpdateEvidenceStatusEnum) => {
    showUpdateStatus({
      evidenceId: evidenceData?.id as number,
      status,
      milestoneId,
    });
  };

  const { addEvidence, isPending } = useEvidenceMutation({
    evidenceId,
    milestoneId,
  });

  const onReplaceFile = async (data: z.infer<typeof evidence.schema>) => {
    addEvidence({ ...data, beneficiaryId: beneficiaryId.toString() });
  };

  return (
    <div>
      {evidenceLoading || isBeneficiaryLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div>
          <Tabs tabs={tabs} />
          {IsAuthorized([Evidences.UPDATE]) && (
            <div className="mt-20 flex gap-10">
              {evidenceData?.status !== "rejected" && (
                <Button
                  onClick={() =>
                    handleUpdateStatus(UpdateEvidenceStatusEnum.REJECT)
                  }
                  className="w-full"
                  buttonType="secondary"
                >
                  Reject
                </Button>
              )}
              {evidenceData?.status !== "more information requested" && (
                <Button
                  onClick={() =>
                    handleUpdateStatus(UpdateEvidenceStatusEnum.MORE_INFO)
                  }
                  className="w-full"
                  buttonType="secondary"
                >
                  Request more info
                </Button>
              )}
              {evidenceData?.status !== "approved" && (
                <Button
                  onClick={() =>
                    handleUpdateStatus(UpdateEvidenceStatusEnum.APPROVE)
                  }
                  className="w-full"
                >
                  Approve
                </Button>
              )}
            </div>
          )}

          {evidenceData?.status !== "approved" &&
            IsAuthorized([Evidences.REPLACE]) && (
              <div className="space-y-4">
                {commentsLoading ? (
                  <Skeleton height={200} />
                ) : (
                  <div>
                    <label
                      className={
                        "min-w-[140px] !text-[12px] font-light text-white/80"
                      }
                    >
                      Comment
                    </label>
                    <Input
                      textarea
                      disabled
                      value={commentList?.items?.slice(-1)?.[0]?.message}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                )}
                <Form form={form} onSubmit={onReplaceFile}>
                  <CustomController
                    label="Upload replacement evidence file"
                    control={form.control}
                    name="file"
                    render={() => {
                      return (
                        <FileInput
                          accept=".pdf"
                          onSuccess={(data) => {
                            form.setValue("file", data);
                            form.setError("file", { message: "" });
                          }}
                          placeholder="Document"
                          error={!!form.formState.errors.file?.message}
                          helperText={form.formState.errors.file?.message}
                        />
                      );
                    }}
                  />
                  <div className="mt-12 flex justify-end">
                    <Button type="submit" loading={isPending}>
                      Replace evidence
                    </Button>
                  </div>
                </Form>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
