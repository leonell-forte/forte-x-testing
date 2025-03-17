import { HiOutlineDownload as DL } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import { Invoice } from "lib/types/invoices";
import { formatCurrency, formatDate } from "lib/utils";

import Button from "components/ui/button";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type InvoicesProps = {
  list?: Invoice[];
  isLoading?: boolean;
};

const Invoices = ({ list, isLoading }: InvoicesProps) => {
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  const handleDownload = () => {
    //  ...download loginc here
  };

  return (
    <div>
      <div className="table-breakpoint:hidden">
        <Cards.Container isLoading={isLoading}>
          {list?.map((item, index) => {
            const { id, createdAt, dueDate, paidDate, grossAmount, status } =
              item;
            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(id);
                }}
                key={index}
                title={`INV-${id.slice(-4)}`.toUpperCase()}
              >
                <Cards.Group cols={2}>
                  <Cards.Details
                    label="Invoice date"
                    value={formatDate(new Date(createdAt || ""), "dd-LLL-yyyy")}
                  />
                  <Cards.Details
                    label="Date due"
                    value={formatDate(new Date(dueDate || ""), "dd-LLL-yyyy")}
                  />
                  <Cards.Details
                    label="Date paid"
                    value={formatDate(new Date(paidDate || ""), "dd-LLL-yyyy")}
                  />
                  <Cards.Details
                    label="Total"
                    value={formatCurrency(grossAmount)}
                  />
                  <Cards.Details label="Status" value={status} />
                </Cards.Group>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    eventName="Delete Invoice"
                    id={id.toString()}
                    buttonType="default"
                    type="button"
                    onClick={handleDownload}
                    className="icon group"
                  >
                    <DL className="h-auto w-6 transition-all group-hover:fill-mint" />{" "}
                  </Button>
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden table-breakpoint:block">
        <Table.Container isEmpty={!list?.length} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {HEADERS.map((header, index) => (
                <Table.Header key={index}>{header}</Table.Header>
              ))}
              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list?.map((item, index) => {
              const { id, createdAt, dueDate, paidDate, grossAmount, status } =
                item;
              return (
                <Table.Row
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(id);
                  }}
                >
                  <Table.Data className="uppercase">
                    INV-{id.slice(-4)}
                  </Table.Data>
                  <Table.Data>
                    {formatDate(new Date(createdAt || ""), "dd-LLL-yyyy")}
                  </Table.Data>
                  <Table.Data>
                    {formatDate(new Date(dueDate || ""), "dd-LLL-yyyy")}
                  </Table.Data>
                  <Table.Data>
                    {formatDate(new Date(paidDate || ""), "dd-LLL-yyyy")}
                  </Table.Data>
                  <Table.Data>{formatCurrency(grossAmount)}</Table.Data>
                  <Table.Data>{status}</Table.Data>
                  <Table.Data>
                    <Button
                      eventName="Edit Project"
                      id={id.toString()}
                      buttonType="default"
                      type="button"
                      onClick={handleDownload}
                      className="icon group"
                    >
                      <DL className="h-auto w-6 transition-all group-hover:fill-mint" />{" "}
                    </Button>
                  </Table.Data>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
      </div>
    </div>
  );
};

export default Invoices;

const HEADERS = [
  "Invoice ID",
  "Invoice date",
  "Date due",
  "Date paid",
  "Total",
  "Status",
];
