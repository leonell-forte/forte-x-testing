import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import evidenceService from "api/evidence";
import { RiPencilFill as Pencil } from "react-icons/ri";

import loader from "assets/images/icons/loader.svg";

import { DEFAULT_DATE_FORMAT } from "lib/constants";
import { IsAuthorized, Milestones } from "lib/role-permissions";
import { IMilestone, TMilestoneEvidence } from "lib/types/milestones";
import { formatDate, getStatusVariant } from "lib/utils";

import Button from "components/ui/button";
import { useModal } from "components/ui/dialogue/v2/Modal";
import InfoVertical from "components/ui/info-vertical/InfoVertical";
import ReferenceLink from "components/ui/reference-link/ReferenceLink";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";

import { showSetupEvidenceModal } from "./SetupEvidence";

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

  const file = evidenceDetails?.file;
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

  return (
    <div>
      {evidenceLoading || isBeneficiaryLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center gap-6">
              <InfoVertical label="Beneficiary">
                <ReferenceLink hrefLink={`/beneficiaries/${beneficiary?.id}`}>
                  {beneficiary?.firstName} {beneficiary?.lastName}
                </ReferenceLink>
              </InfoVertical>
              <InfoVertical label="Created by">
                {evidenceData?.createdBy.firstName}{" "}
                {evidenceData?.createdBy.lastName}
              </InfoVertical>
              <InfoVertical label="Created at">
                {formatDate(
                  new Date(evidenceData?.createdAt || ""),
                  DEFAULT_DATE_FORMAT
                )}
              </InfoVertical>
            </div>
            <InfoVertical label="Description">
              {evidenceData?.description}
            </InfoVertical>

            {!isFileLoading && fileData ? (
              <InfoVertical label={`File: ${file?.filename}`}>
                <div className="mx-auto flex flex-col items-center py-6">
                  <div className="flex h-[calc(100vh-550px)] w-full max-w-[500px] items-center justify-center overflow-x-auto md:h-[calc(100vh-550px)]">
                    {fileData && (
                      <>
                        <iframe
                          src={
                            fileData + "#navpanes=0&toolbar=0&view=Fit&page=1"
                          }
                          style={{
                            border: "none",
                            background: "transparent",
                          }}
                          width="100%"
                          height="100%"
                          title={file?.filename}
                          className={
                            isFileLoading
                              ? "h-full opacity-[.4]"
                              : "w-[700px] max-w-full overflow-x-auto md:w-[42rem]"
                          }
                        />
                      </>
                    )}

                    {isFileLoading && (
                      <>
                        <img
                          src={loader}
                          alt=""
                          className="absolute w-10 animate-spin"
                        />
                        <span className="sr-only">Loading file</span>
                      </>
                    )}
                  </div>
                </div>
              </InfoVertical>
            ) : null}
            {isFileLoading ? (
              <div
                className="flex h-[250px] w-full items-center justify-center"
                aria-hidden="true"
              >
                <Spinner />
                <span className="sr-only">Loading file</span>
              </div>
            ) : null}
            <div className="flex justify-end">
              {IsAuthorized([Milestones.UPDATE]) && (
                <Button
                  onClick={() =>
                    showSetupEvidenceModal({
                      milestone,
                      evidenceDetails: evidenceData as any,
                    })
                  }
                >
                  <Pencil className="h-auto w-5 fill-black" />
                  Edit details
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
