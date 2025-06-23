import { IMilestone } from "lib/types/milestones";
import { formatCurrency, getStatusVariant } from "lib/utils";

import Status from "components/ui/status";
import Table from "components/ui/table";

const PayoutMilestones = ({
  milestones,
  loading,
}: {
  milestones: IMilestone[];
  loading: boolean;
}) => {
  return (
    <div className="space-y-4">
      <p className="text-[20px] font-semibold">Milestones</p>

      <Table.Container
        emptyConfig={{
          title: "No milestones yet.",
          status: !milestones.length,
        }}
        isLoading={loading}
      >
        <Table.Head>
          <Table.Row>
            {HEADER.map((key, headerIndex) => {
              return <Table.Header key={headerIndex}>{key}</Table.Header>;
            })}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {milestones.map((milestone, index) => {
            return (
              <Table.Row key={index}>
                <Table.Data>{milestone.id}</Table.Data>
                <Table.Data>{milestone.outcome.name}</Table.Data>
                <Table.Data>{milestone.type}</Table.Data>
                <Table.Data>{milestone.reference?.name}</Table.Data>
                <Table.Data>{milestone.outcome.name}</Table.Data>
                <Table.Data>
                  {formatCurrency(Number(milestone.cost))}
                </Table.Data>
                <Table.Data>
                  <Status variant={getStatusVariant(milestone.status)}>
                    {milestone.status}
                  </Status>
                </Table.Data>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Container>
    </div>
  );
};

export default PayoutMilestones;

const HEADER = [
  "Milestone ID",
  "Project name",
  "Type",
  "Reference",
  "Outcome name",
  "Cost",
  "Status",
];
