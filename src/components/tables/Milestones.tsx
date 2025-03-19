import { useNavigate } from "react-router-dom";

import { IsAuthorized, Milestones } from "lib/role-permissions";
import { IMilestone } from "lib/types/milestones";
import { formatDate, formatNumber, getStatusVariant } from "lib/utils";

import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TMilestonesTable = {
  list: IMilestone[];
  isLoading?: boolean;
};

// for stubs
export function getRandomString(array: string[]): string | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export const MILESTONE_TYPES = ["Threshold", "Per Outcome"];
export const MILESTONE_REFERENCE = ["Contract Name", "Beneficiary Name"];

const MilestonesTable = ({ list, isLoading = false }: TMilestonesTable) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="table-breakpoint:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((item, index) => {
            const {
              id,
              milestone: { title },
              outcome: { name: outcomeName },
              cost,
              status,
            } = item;
            return (
              <Cards.Card
                onClick={() => navigate(id)}
                title={`Milestone ID: ${id}`}
                key={index}
              >
                <Cards.Group cols={2}>
                  <Cards.Details label="Funder" value={title} />
                  <Cards.Details
                    label="Type"
                    value={getRandomString(MILESTONE_TYPES)}
                  />
                  <Cards.Details
                    label="Reference"
                    value={getRandomString(MILESTONE_REFERENCE)}
                  />
                  <Cards.Details label="Outcome Name" value={outcomeName} />

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
      <div className="hidden w-[calc(100vw-250px)] overflow-x-auto table-breakpoint:block">
        <Table.Container isEmpty={!list.length} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {list?.map((item, index) => {
              const {
                id,
                milestone: { title },
                outcome: { name: outcomeName },
                cost,
                status,
              } = item;

              return (
                <Table.Row onClick={() => navigate(id)} key={index}>
                  <Table.Data>
                    <p className="underline">{id.split("-")?.[0] || "ID"}</p>
                  </Table.Data>

                  <Table.Data> {title}</Table.Data>
                  <Table.Data>{getRandomString(MILESTONE_TYPES)}</Table.Data>
                  <Table.Data>
                    {getRandomString(MILESTONE_REFERENCE)}
                  </Table.Data>
                  <Table.Data>{outcomeName}</Table.Data>

                  <Table.Data className="max-w-[70px]">
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
      </div>
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
