import { useNavigate } from "react-router-dom";

import Sort from "@/assets/images/icons/sort.svg?react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area/ScrollArea";
import Status from "@/components/ui/status";
import Table from "@/components/ui/table";
import Cards from "@/components/ui/table-card";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { Payout, PayoutSortLabel, PayoutStatus } from "@/lib/types/payouts";
import { formatCurrency, formatDate, getStatusVariant } from "@/lib/utils";

type PayoutsTableProps = {
  list: Payout[];
  isLoading: boolean;
  handleSort: (sortLabel: PayoutSortLabel) => void;
};

const PayoutsTable = ({ list, isLoading, handleSort }: PayoutsTableProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mt-4 lg:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((payout, index) => {
            const { id, provider, noOfMilestones, amount, status, settledAt } =
              payout;
            return (
              <Cards.Card
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/payouts/${id}`);
                }}
                title={id}
              >
                <Cards.Group cols={3}>
                  <Cards.Details label="Provider" value={provider.name} />
                  <Cards.Details
                    label="# of milestones"
                    value={noOfMilestones}
                  />
                  <Cards.Details label="Amount" value={amount} />
                  <Cards.Details
                    label="Date settled"
                    value={
                      settledAt
                        ? formatDate(settledAt, DEFAULT_DATE_FORMAT)
                        : "-"
                    }
                  />
                  <Cards.Details
                    value={
                      <Status
                        variant={getStatusVariant(status as PayoutStatus)}
                      >
                        {status}
                      </Status>
                    }
                    label="Status"
                    capitalize
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
            title: "No payouts yet.",
            status: !list.length,
            description:
              "Add a payout by clicking the 'Generate payouts' button above.",
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Payout ID</span>
                  <button onClick={() => handleSort?.(PayoutSortLabel.ID)}>
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Provider</span>
                  <button
                    onClick={() => handleSort?.(PayoutSortLabel.PROVIDER)}
                  >
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header># of Milestones</Table.Header>
              <Table.Header>Amount</Table.Header>
              <Table.Header>Date settled</Table.Header>
              <Table.Header>Status</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list.map((payout, index) => {
              const {
                id,
                provider,
                noOfMilestones,
                amount,
                status,
                settledAt,
              } = payout;
              return (
                <Table.Row
                  key={index}
                  onClick={() => {
                    navigate(`/payouts/${id}`);
                  }}
                >
                  <Table.Data>{id}</Table.Data>
                  <Table.Data>{provider.name}</Table.Data>
                  <Table.Data>{noOfMilestones}</Table.Data>
                  <Table.Data>{formatCurrency(Number(amount))}</Table.Data>
                  <Table.Data>
                    {settledAt
                      ? formatDate(settledAt, DEFAULT_DATE_FORMAT)
                      : "-"}
                  </Table.Data>
                  <Table.Data>
                    <Status variant={getStatusVariant(status as PayoutStatus)}>
                      {status}
                    </Status>
                  </Table.Data>
                  {/* <Table.Data>
                    <button>
                      <MoreIcon />
                    </button>
                  </Table.Data> */}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default PayoutsTable;
