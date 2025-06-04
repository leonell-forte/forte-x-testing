import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import evidenceService from "api/evidence";

import { IsAuthorized, Milestones } from "lib/role-permissions";
import { File } from "lib/types/common";
import {
  Evidence as EvidenceType,
  UpdateEvidenceStatusEnum,
} from "lib/types/evidence";

import Button from "components/ui/button";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Spinner from "components/ui/spinner/spinner";
import Tabs, { TabData } from "components/ui/tabs/Tabs";

import Details from "./Details";
import Evidence from "./Evidence";
import History from "./History";
import { showUpdateStatus } from "./UpdateStatus";

type TParams = {
  milestoneId: string;
  evidenceId: number;
  beneficiaryId: number;
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
        {/* {params.evidenceDetails?.status ? (
          <Status variant={getStatusVariant(params.evidenceDetails?.status)}>
            {params.evidenceDetails?.status}
          </Status>
        ) : null} */}
      </div>
    ),
  });
}

function ViewEvidenceModal({
  milestoneId,
  evidenceId,
  beneficiaryId,
}: TParams) {
  const { data: evidenceData, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", evidenceId],

    queryFn: () => evidenceService.getOne(beneficiaryId, evidenceId),

    enabled: Boolean(evidenceId) && Boolean(beneficiaryId),
  });

  const file = evidenceData?.file as File;
  const fileUrl = evidenceData?.file?.fileUrl;

  const { data: fileData, isLoading: isFileLoading } = useQuery({
    queryKey: ["file", fileUrl],

    queryFn: () => evidenceService.getFile(fileUrl || ""),

    enabled: Boolean(fileUrl),

    refetchOnWindowFocus: false,
  });

  const { data: beneficiary, isLoading: isBeneficiaryLoading } = useQuery({
    queryKey: ["evidence-beneficiary", evidenceData?.beneficiaryId],

    queryFn: () => beneficiariesService.getOne(evidenceData?.beneficiaryId),

    enabled: Boolean(evidenceData?.beneficiaryId),

    refetchOnWindowFocus: false,
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

  return (
    <div>
      {evidenceLoading || isBeneficiaryLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-20">
          <Tabs tabs={tabs} />
          {IsAuthorized([Milestones.UPDATE]) && (
            <div className="flex gap-10">
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
        </div>
      )}
    </div>
  );
}
