import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import milestoneService from "api/milestones";
import { useMemo } from "react";
import { HiPlus } from "react-icons/hi2";
import { HiEllipsisHorizontal as Ellipsis } from "react-icons/hi2";
import { RiShareBoxLine as Share } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

import { ReactComponent as Pencil } from "assets/images/icons/pencil.svg";

import { useDeleteEvidence } from "lib/mutations/evidences";
import { IsAuthorized, Milestones } from "lib/role-permissions";
import { MILESTONE_TYPES } from "lib/types/milestones";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getStatusVariant,
} from "lib/utils";

import { showOverrideCostModal } from "components/Dashboard/Milestones/modals/OverrideCost";
import { showSetupEvidenceModal } from "components/Dashboard/Milestones/modals/SetupEvidence";
import { showViewEvidenceModal } from "components/Dashboard/Milestones/modals/ViewEvidence";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu/DropdownMenu";
import InfoVertical from "components/ui/info-vertical/InfoVertical";
import ReferenceLink from "components/ui/reference-link/ReferenceLink";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

export default function ViewMilestone() {
  const navigate = useNavigate();
  const params = useParams();
  const { open } = useCustomPrompt();

  const id = params.milestoneId;
  const beneficiaryId = params.beneficiaryId;

  const { data: milestone, isLoading } = useQuery({
    queryKey: ["milestone-details", id],

    queryFn: () => milestoneService.getOne(id!),

    enabled: Boolean(id),
  });

  const { deleteEvidence } = useDeleteEvidence();

  const handleDelete = (beneId: number, id: number) => {
    open({
      title: "Delete Evidence",
      subText:
        "Deleting this document will unlink and delete this document from its milestone.",
      onYes: () => deleteEvidence({ beneficiaryId: beneId, evidenceId: id }),
      yesLabel: "Proceed",
    });
  };
  const isThreshold = milestone?.type === "threshold";

  const headers = useMemo(() => {
    if (isThreshold)
      return ["File name", "Beneficiary", "Description", "Evidence Status"];
    return ["File name", "Description", "Evidence Status"];
  }, [isThreshold]);

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );

  if (!milestone) return null;

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-x-2">
            <div className="t-1 text-2xl">Milestone ID: {id}</div>
            <Status variant={getStatusVariant(milestone.status)}>
              {milestone.status}
            </Status>
          </div>
          {IsAuthorized([Milestones.UPDATE]) && (
            <div className="flex items-center gap-2">
              {milestone.type === "outcome" && (
                <Button
                  className="group"
                  buttonType="secondary"
                  onClick={() =>
                    showOverrideCostModal({
                      milestone,
                    })
                  }
                  disabled={milestone.status !== "open"}
                >
                  <Pencil
                    height={14}
                    className="group-disabled:fill-[#787878] group-disabled:stroke-[#787878]"
                  />
                  Override cost
                </Button>
              )}

              {milestone.status === "open" && (
                <Button
                  onClick={() =>
                    showSetupEvidenceModal({
                      milestone,
                      beneficiaryIdParam: beneficiaryId,
                    })
                  }
                >
                  <HiPlus className="h-auto w-6 fill-black" />
                  Add Evidence
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="heading w-fit whitespace-nowrap">Milestone Details</p>

          <div className="grid items-center gap-6 rounded-lg border p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <InfoVertical label="Type">
              {MILESTONE_TYPES[milestone.type]}
            </InfoVertical>
            <InfoVertical label="Cost">
              {formatCurrency(
                Number(milestone.cost),
                milestone.funder.currency
              )}
            </InfoVertical>
            <InfoVertical label="Invoice ID">{milestone.id}</InfoVertical>
            <InfoVertical label="Outcome Name">
              {milestone.outcome.name}
            </InfoVertical>
            <InfoVertical label="Date Created">
              {formatDate(milestone.createdAt, "dd MMMM yyy")}
            </InfoVertical>

            <InfoVertical label="Date Invoiced">
              {formatDate(milestone.invoicedAt || "", "dd MMMM yyy")}
            </InfoVertical>
            <InfoVertical label="Reference">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    isThreshold
                      ? `/contracts/${milestone.reference.id}`
                      : `/beneficiaries/${milestone.reference.id}`
                  )
                }
                className="group flex items-center gap-x-2 transition hover:text-mint"
              >
                {milestone.reference.name}
                <Share className="fill-mint" />
              </button>
            </InfoVertical>

            <InfoVertical label="Date Achieved">
              {formatDate(milestone.achievedAt || "", "dd MMMM yyy")}
            </InfoVertical>

            <InfoVertical label="Date Paid">
              {formatDate(milestone.paidAt || "", "dd MMMM yyy")}
            </InfoVertical>
          </div>
        </div>
        <div className="space-y-4">
          <p className="heading w-fit whitespace-nowrap">Evidence</p>

          <div className="md:hidden">
            <Cards.Container>
              {milestone.evidences.map((item, index) => {
                const { file, status, beneficiary } = item;

                return (
                  <Cards.Card
                    onClick={(e) => {
                      e.stopPropagation();
                      showViewEvidenceModal({
                        milestone,
                        evidenceDetails: item,
                      });
                    }}
                    key={index}
                  >
                    <div className="space-y-2">
                      <Cards.Group>
                        <Cards.Details
                          label="File name"
                          value={file.filename}
                        />
                        {isThreshold ? (
                          <Cards.Details
                            label="Beneficiary"
                            value={
                              <ReferenceLink
                                hrefLink={`/beneficiaries/${beneficiary.id}`}
                              >
                                {beneficiary.firstName} {beneficiary.lastName}
                              </ReferenceLink>
                            }
                          />
                        ) : null}
                        <Cards.Details
                          label="Status"
                          value={
                            <Status variant={getStatusVariant(status)}>
                              {status}
                            </Status>
                          }
                          capitalize
                        />
                      </Cards.Group>
                      <div className="absolute bottom-4 right-6 z-50">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="group mt-1 flex w-full items-center justify-end">
                              <Ellipsis className="m-auto h-auto w-8 group-hover:fill-mint" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            side="bottom"
                            sideOffset={1}
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                evidenceService.getFile(
                                  item.file.fileUrl,
                                  item.file.filename
                                );
                              }}
                              disabled={!IsAuthorized([Milestones.DOWNLOAD])}
                            >
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.beneficiary.id, item.id);
                              }}
                              disabled={!IsAuthorized([Milestones.DELETE])}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Cards.Card>
                );
              })}
            </Cards.Container>
          </div>
          <div className="hidden md:block">
            <Table.Container
              emptyConfig={{
                title: "No evidences yet.",
                status: !milestone.evidences.length,
              }}
              isLoading={isLoading}
            >
              <Table.Head>
                <Table.Row>
                  {headers.map((item, index) => {
                    return <Table.Header key={index}>{item}</Table.Header>;
                  })}

                  <Table.Header></Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {milestone.evidences.map((item, index) => {
                  const { file, status, description, beneficiary } = item;
                  return (
                    <Table.Row
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        showViewEvidenceModal({
                          milestone,
                          evidenceDetails: item,
                        });
                      }}
                    >
                      <Table.Data>{file.filename}</Table.Data>

                      {isThreshold ? (
                        <Table.Data>
                          <ReferenceLink
                            hrefLink={`/beneficiaries/${beneficiary.id}`}
                          >
                            {beneficiary.firstName} {beneficiary.lastName}
                          </ReferenceLink>
                        </Table.Data>
                      ) : null}

                      <Table.Data>{description}</Table.Data>

                      <Table.Data>
                        <Status variant={getStatusVariant(status)}>
                          {status}
                        </Status>
                      </Table.Data>

                      <Table.Data>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="group mt-1 flex w-full items-center justify-end">
                              <Ellipsis className="m-auto h-auto w-8 group-hover:fill-mint" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            side="bottom"
                            sideOffset={1}
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                evidenceService.getFile(
                                  item.file.fileUrl,
                                  item.file.filename
                                );
                              }}
                              disabled={!IsAuthorized([Milestones.DOWNLOAD])}
                            >
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.beneficiary.id, item.id);
                              }}
                              disabled={!IsAuthorized([Milestones.DELETE])}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Table.Data>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Container>
          </div>
        </div>
      </div>
    </>
  );
}
