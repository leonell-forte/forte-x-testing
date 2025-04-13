import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import milestoneService from "api/milestones";
import payoutsService from "api/payouts";
import { useMemo, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { HiEllipsisHorizontal as Ellipsis } from "react-icons/hi2";
import { RiShareBoxLine as Share } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

import { useAlert } from "lib/hooks";
import { useDeleteEvidence } from "lib/mutations/evidences";
import { MILESTONE_TYPES } from "lib/types/milestones";
import { formatDate, formatNumber, getStatusVariant } from "lib/utils";

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
  const { setAlert } = useAlert();
  const params = useParams();
  const { open } = useCustomPrompt();
  const [loading, setLoading] = useState(false);

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
        "Are you sure you want to delete this evidence? This process cannot be undone.",
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

  const handleGeneratePayouts = async () => {
    setLoading(true);
    try {
      await payoutsService.generate(milestone.provider.id as string);
      setAlert({
        message: "Payouts generated successfully",
        status: "success",
        title: "Success",
      });
    } catch (err) {
      console.log(err);
      setAlert({
        message: "Failed to generate payouts",
        status: "error",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(milestone.status);

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
          <div className="flex items-center gap-2">
            {milestone.status !== "paid" && milestone.type === "outcome" && (
              <Button
                className="group"
                buttonType="secondary"
                onClick={() =>
                  showOverrideCostModal({
                    milestone,
                  })
                }
              >
                <HiPencil className="h-auto w-6 transition duration-300 group-hover:fill-mint" />
                Override cost
              </Button>
            )}
            {milestone.status === "paid" && (
              <Button
                loading={loading}
                className="group"
                buttonType="secondary"
                onClick={handleGeneratePayouts}
              >
                Generate Payout
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
        </div>

        <div className="space-y-4">
          <p className="heading w-fit whitespace-nowrap">Milestone Details</p>

          <div className="grid items-center gap-6 rounded-lg border p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <InfoVertical label="Type">
              {MILESTONE_TYPES[milestone.type]}
            </InfoVertical>
            <InfoVertical label="Cost">
              ${formatNumber(milestone.cost)}
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
                      ? "/contracts"
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
                      alert("open view evidence");
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
                            >
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.beneficiary.id, item.id);
                              }}
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
              isEmpty={!milestone.evidences.length}
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
                            >
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.beneficiary.id, item.id);
                              }}
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
