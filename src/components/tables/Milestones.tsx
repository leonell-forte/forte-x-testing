import { useNavigate } from "react-router-dom";

import { IMilestone, MILESTONE_TYPES } from "lib/types/milestones";
import { formatNumber, getStatusVariant } from "lib/utils";

import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TMilestonesTable = {
  list: IMilestone[];
  isLoading?: boolean;
  href?: string;
};

const MilestonesTable = ({
  list,
  isLoading = false,
  href,
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
                    value={`$${formatNumber(cost)}`}
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
              {TABLE_HEADER.map((key, headerIndex) => {
                return (
                  <Table.Header
                    key={headerIndex}
                    {...(key === "Cost" && { className: "text-right !pr-12" })}
                  >
                    {key}
                  </Table.Header>
                );
              })}
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

                  <Table.Data className="!pr-12 text-right">
                    ${formatNumber(cost)}
                  </Table.Data>

                  <Table.Data>
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>
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

const TABLE_HEADER = [
  "Milestone ID",
  "Funder",
  "Type",
  "Reference",
  "Outcome Name",
  "Cost",
  "Evidence Status",
];
