import { useNavigate } from "react-router-dom";

import { IsAuthorized, Milestones } from "lib/role-permissions";
import { IMilestone } from "lib/types/milestones";
import { formatDate, formatNumber } from "lib/utils";

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
              createdAt,
              invoiceDate,
              paidDate,
            } = item;
            return (
              <Cards.Card
                onClick={
                  IsAuthorized([Milestones.UPDATE])
                    ? (e) => {
                        e.stopPropagation();

                        console.log("Show details");
                      }
                    : undefined
                }
                title={`Milestone ID: ${id}`}
                key={index}
              >
                <Cards.Group cols={2}>
                  <Cards.Details label="Name" value={title} />

                  <Cards.Details label="Outcome Name" value={outcomeName} />
                  <Cards.Details
                    label="Type"
                    value={getRandomString(MILESTONE_TYPES)}
                  />
                  <Cards.Details
                    label="Milestone Reference"
                    value={getRandomString(MILESTONE_REFERENCE)}
                  />
                  <Cards.Details
                    label="Cost"
                    value={`$${formatNumber(cost)}`}
                  />
                  <Cards.Details label="Status" value={status} />
                  <Cards.Details
                    label="Date Created"
                    value={formatDate(createdAt)}
                  />
                  <Cards.Details
                    label="Date Achieved"
                    value={formatDate(new Date())}
                  />
                  <Cards.Details
                    label="Invoice ID"
                    value={id.split("-")?.[1] || "ID"}
                  />
                  <Cards.Details
                    label="Date Invoiced"
                    value={formatDate(invoiceDate)}
                  />
                  <Cards.Details
                    label="Date Paid"
                    value={formatDate(paidDate)}
                  />
                </Cards.Group>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>
      <div className="hidden table-breakpoint:block">
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
                createdAt,
                invoiceDate,
                paidDate,
              } = item;

              return (
                <Table.Row onClick={() => navigate(id)} key={index}>
                  <Table.Data className="max-w-[60px]">
                    {id.split("-")?.[0] || "ID"}
                  </Table.Data>

                  <Table.Data className="max-w-[100px]">{title}</Table.Data>
                  <Table.Data className="max-w-[100px]">
                    {outcomeName}
                  </Table.Data>

                  <Table.Data className="max-w-[100px]">
                    {getRandomString(MILESTONE_TYPES)}
                  </Table.Data>

                  <Table.Data className="max-w-[100px] capitalize">
                    {getRandomString(MILESTONE_REFERENCE)}
                  </Table.Data>

                  <Table.Data className="max-w-[70px]">
                    ${formatNumber(cost)}
                  </Table.Data>

                  <Table.Data className="w-[80px]">{status}</Table.Data>

                  <Table.Data className="w-[120px]">
                    {formatDate(createdAt)}
                  </Table.Data>
                  <Table.Data className="w-[120px]">
                    {formatDate(new Date())}
                  </Table.Data>
                  <Table.Data className="w-[70px]">
                    {id.split("-")?.[1] || "ID"}
                  </Table.Data>
                  <Table.Data className="w-[120px]">
                    {formatDate(invoiceDate)}
                  </Table.Data>
                  <Table.Data className="w-[120px]">
                    {formatDate(paidDate)}
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
  "ID",
  "Name",
  "Outcome Name",
  "Type",
  "Reference",
  "Cost",
  "Status",
  "Date Created",
  "Date Achieved",
  "Invoice ID",
  "Date Invoiced",
  "Date Paid",
];
