import { useQuery } from "@tanstack/react-query";
import milestoneService from "api/milestones";
import { HiOutlineDownload as DL } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { RiShareBoxLine as Share } from "react-icons/ri";
import { useParams } from "react-router-dom";

import { usePageTitle } from "lib/hooks";
import { MILESTONE_TYPES } from "lib/types/milestones";
import { formatDate, formatNumber, getStatusVariant } from "lib/utils";

import { showSetupEvidenceModal } from "components/Dashboard/Milestones/modals/SetupEvidence";
import Button from "components/ui/button";
import InfoVertical from "components/ui/info-vertical/InfoVertical";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

export default function ViewMilestone() {
  const params = useParams();
  const id = params.milestoneId;
  usePageTitle(`Milestone ID: ${id?.split("-")[0]}`);

  const { data: milestone, isLoading } = useQuery({
    queryKey: ["milestone-details", id],

    queryFn: () => milestoneService.getOne(id!),

    enabled: Boolean(id),
  });

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
          <Button onClick={() => showSetupEvidenceModal({ milestone })}>
            <HiPlus className="h-auto w-6 fill-black" />
            Add Evidence
          </Button>
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
                onClick={() => alert("Go to reference")}
                className="group flex items-center gap-x-2 transition hover:text-mint"
              >
                {milestone.reference.name}
                <Share className="fill-mint" />
              </button>
            </InfoVertical>

            <InfoVertical label="Date Achieved">
              {formatDate(milestone.invoicedAt || "", "dd MMMM yyy")}
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
                const { file, status } = item;

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
                        <Cards.Details
                          label="Description"
                          value="Lorem Ipsum"
                        />
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
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            alert("download file");
                          }}
                          className="group"
                        >
                          <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />
                        </button>
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
                  {["File name", "Description", "Evidence Status"].map(
                    (item, index) => {
                      return <Table.Header key={index}>{item}</Table.Header>;
                    }
                  )}

                  <Table.Header></Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {milestone.evidences.map((item, index) => {
                  const { file, status, description } = item;
                  return (
                    <Table.Row
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        showSetupEvidenceModal({
                          milestone,
                          evidenceDetails: item,
                        });
                      }}
                    >
                      <Table.Data>{file.filename}</Table.Data>

                      <Table.Data>{description}</Table.Data>

                      <Table.Data>
                        <Status variant={getStatusVariant(status)}>
                          {status}
                        </Status>
                      </Table.Data>

                      <Table.Data>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            alert("download evidence");
                          }}
                          className="group mt-1.5"
                        >
                          <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />
                        </button>
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
