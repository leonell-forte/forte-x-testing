import { useNavigate } from "react-router-dom";

import { ReactComponent as Sort } from "assets/images/icons/sort.svg";

import { Invoice, SortInvoiceLabel } from "lib/types/invoices";
import { formatCurrency, formatDate, getStatusVariant } from "lib/utils";

import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type InvoicesProps = {
  list?: Invoice[];
  isLoading?: boolean;
  handleSort?: (sortLabel: SortInvoiceLabel) => void;
};

const Invoices = ({ list, isLoading, handleSort }: InvoicesProps) => {
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  // const handleDownload = () => {
  //   //  ...download loginc here
  // };

  return (
    <div>
      <div className="lg:hidden">
        <Cards.Container isLoading={isLoading}>
          {list?.map((item, index) => {
            const { id, createdAt, cost, status, noOfMilestones, currency } =
              item;
            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(id);
                }}
                key={index}
                title={id}
              >
                <Cards.Group cols={2}>
                  <Cards.Details
                    label="Invoice date"
                    value={formatDate(new Date(createdAt || ""), "dd-LLL-yyyy")}
                  />
                  <Cards.Details
                    label="# of Milestones"
                    value={noOfMilestones || "-"}
                  />
                  <Cards.Details
                    label="Amount"
                    value={formatCurrency(cost, currency)}
                  />
                  <Cards.Details
                    label="Status"
                    value={
                      <Status variant={getStatusVariant(status)}>
                        {status}
                      </Status>
                    }
                  />
                </Cards.Group>
                {/* still not sure what download is for -echo
                
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    eventName="Download Invoice"
                    id={id.toString()}
                    buttonType="default"
                    type="button"
                    onClick={handleDownload}
                    className="icon group"
                  >
                    <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />{" "}
                  </Button>
                </div> */}
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
        <Table.Container
          emptyConfig={{
            title: "No invoices yet.",
            description: "Add an invoice by clicking the ‘Add’ button above.",
            status: !list?.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Invoice ID</span>
                  <button onClick={() => handleSort?.(SortInvoiceLabel.ID)}>
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Invoice date</span>
                  <button
                    onClick={() => handleSort?.(SortInvoiceLabel.CREATED_AT)}
                  >
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header># of Milestones</Table.Header>
              <Table.Header>Amount</Table.Header>
              <Table.Header>Status</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list?.map((item, index) => {
              const { id, createdAt, cost, status, noOfMilestones, currency } =
                item;
              return (
                <Table.Row
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(id);
                  }}
                >
                  <Table.Data className="uppercase">{id}</Table.Data>
                  <Table.Data>
                    {formatDate(new Date(createdAt || ""), "dd LLLL yyyy")}
                  </Table.Data>
                  <Table.Data>{noOfMilestones || "-"}</Table.Data>
                  <Table.Data>{formatCurrency(cost, currency)}</Table.Data>
                  <Table.Data>
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>
                  {/*  still not sure what download is for -echo
                  <Table.Data>
                    <Button
                      eventName="Edit Project"
                      id={id.toString()}
                      buttonType="default"
                      type="button"
                      onClick={handleDownload}
                      className="icon group"
                    >
                      <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />{" "}
                    </Button>
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

export default Invoices;

const HEADERS = [
  "Invoice ID",
  "Invoice date",
  "# of Milestones",
  "Amount",
  "Status",
  // "",
];
