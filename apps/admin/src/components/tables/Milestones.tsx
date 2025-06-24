import { useNavigate } from "react-router-dom";

import Add from "@/assets/images/icons/add.svg?react";
import Sort from "@/assets/images/icons/sort.svg?react";
import { showSetupEvidenceModal } from "@/components/Dashboard/Milestones/modals/SetupEvidence";
import Button from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area/ScrollArea";
import Status from "@/components/ui/status";
import Table from "@/components/ui/table";
import Cards from "@/components/ui/table-card";
import {
  IMilestone,
  MILESTONE_TYPES,
  SortMilestoneLabel,
} from "@/lib/types/milestones";
import { formatCurrency, getStatusVariant } from "@/lib/utils";

type TMilestonesTable = {
  list: IMilestone[];
  isLoading?: boolean;
  href?: string;
  showDownloadButton?: boolean;
  handleSort?: (label: SortMilestoneLabel) => void;
};

const MilestonesTable = ({
  list,
  isLoading = false,
  href,
  showDownloadButton,
  handleSort,
}: TMilestonesTable) => {
  const navigate = useNavigate();
  const linkTo = href ? href : "/milestones/";
  return (
    <>
      <div className="lg:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((item, index) => {
            const { id, funder, type, reference, outcome, cost, status } = item;
            return (
              <Cards.Card
                onClick={() => navigate(`${linkTo}${id}`)}
                title={`Milestone ID: ${id}`}
                key={index}
              >
                <Cards.Group cols={2}>
                  <Cards.Details label="Funder" value={funder.name} />
                  <Cards.Details label="Type" value={MILESTONE_TYPES[type]} />
                  <Cards.Details label="Reference" value={reference?.name} />
                  <Cards.Details label="Outcome Name" value={outcome.name} />

                  <Cards.Details
                    label="Cost"
                    value={formatCurrency(Number(cost), funder.currency)}
                  />
                  <Cards.Details
                    label="Evidence Status"
                    value={
                      <Status variant={getStatusVariant(status)}>
                        {status}
                      </Status>
                    }
                  />
                </Cards.Group>
                {showDownloadButton && (
                  <button
                    className="absolute bottom-4 right-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      showSetupEvidenceModal({
                        milestone: item,
                        beneficiaryIdParam: item.reference?.id,
                      });
                    }}
                  >
                    <Add className="hover:fill-mint hover:stroke-mint h-[14px] w-[14px] fill-white stroke-white" />
                  </button>
                )}
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>
      <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
        <Table.Container
          emptyConfig={{
            title: "No milestones yet.",
            status: !list.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              <Table.Header>
                {" "}
                <div className="flex items-center gap-2">
                  <span>Milestone ID</span>
                  <button onClick={() => handleSort?.(SortMilestoneLabel.ID)}>
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Funder</span>
                  <button
                    onClick={() => handleSort?.(SortMilestoneLabel.FUNDER)}
                  >
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>Type</Table.Header>
              <Table.Header>Reference</Table.Header>
              <Table.Header>Outcome Name</Table.Header>
              <Table.Header>Cost</Table.Header>
              <Table.Header>Evidence Status</Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {list?.map((item, index) => {
              const { id, funder, type, reference, outcome, cost, status } =
                item;

              return (
                <Table.Row
                  onClick={() => navigate(`${linkTo}${id}`)}
                  key={index}
                >
                  <Table.Data>
                    <p className="underline">{id}</p>
                  </Table.Data>

                  <Table.Data>{funder.name}</Table.Data>
                  <Table.Data>{MILESTONE_TYPES[type]}</Table.Data>
                  <Table.Data>{reference?.name}</Table.Data>
                  <Table.Data>{outcome.name}</Table.Data>

                  <Table.Data>
                    {formatCurrency(Number(cost), funder.currency)}
                  </Table.Data>

                  <Table.Data className="flex items-center">
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>

                  {showDownloadButton && (
                    <Table.Data>
                      <Button
                        buttonType="secondary"
                        className="!border-mint !text-mint h-[30px] !px-3"
                        onClick={() => {
                          showSetupEvidenceModal({
                            milestone: item,
                            beneficiaryIdParam: item.reference?.id,
                          });
                        }}
                      >
                        <Add className="fill-mint stroke-mint h-[14px] w-[14px]" />
                        Add evidence
                      </Button>
                    </Table.Data>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default MilestonesTable;
