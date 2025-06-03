import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import evidenceService from "api/evidence";

import { IsAuthorized, Milestones } from "lib/role-permissions";
import { File } from "lib/types/common";
import {
  Evidence as EvidenceType,
  UpdateEvidenceStatusEnum,
} from "lib/types/evidence";
import { IMilestone, TMilestoneEvidence } from "lib/types/milestones";
import { getStatusVariant } from "lib/utils";

import Button from "components/ui/button";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Tabs, { TabData } from "components/ui/tabs/Tabs";

import Details from "./Details";
import Evidence from "./Evidence";
import History from "./History";
import { showUpdateStatus } from "./UpdateStatus";

type TParams = {
  milestone: IMilestone;
  evidenceDetails?: TMilestoneEvidence;
};

export function showViewEvidenceModal(params: TParams) {
  useModal.getState().open({
    component: (
      <ViewEvidenceModal
        milestone={params.milestone}
        evidenceDetails={params.evidenceDetails}
      />
    ),
    size: "2xl",
    title: (
      <div className="flex items-center gap-3">
        <span>Evidence ID: {params.evidenceDetails?.id}</span>
        {params.evidenceDetails?.status ? (
          <Status variant={getStatusVariant(params.evidenceDetails?.status)}>
            {params.evidenceDetails?.status}
          </Status>
        ) : null}
      </div>
    ),
  });
}

function ViewEvidenceModal({ milestone, evidenceDetails }: TParams) {
  const { data: evidenceData, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", evidenceDetails?.id],

    queryFn: () =>
      evidenceService.getOne(
        evidenceDetails ? evidenceDetails.beneficiary.id : NaN,
        evidenceDetails ? evidenceDetails.id : NaN
      ),

    enabled: Boolean(evidenceDetails?.id),
  });

  const file = evidenceDetails?.file as File;
  const fileUrl = evidenceData?.file?.fileUrl;

  const { data: fileData, isLoading: isFileLoading } = useQuery({
    queryKey: ["file", fileUrl],

    queryFn: () => evidenceService.getFile(fileUrl || ""),

    enabled: Boolean(fileUrl),

    refetchOnWindowFocus: false,
  });

  const { data: beneficiary, isLoading: isBeneficiaryLoading } = useQuery({
    queryKey: ["evidence-beneficiary", evidenceDetails?.beneficiary.id],

    queryFn: () => beneficiariesService.getOne(evidenceDetails?.beneficiary.id),

    enabled: Boolean(evidenceDetails?.beneficiary.id),

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
          milestone={milestone}
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
      milestoneId: milestone.id,
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
