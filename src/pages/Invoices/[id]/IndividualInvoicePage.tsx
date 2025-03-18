import { useQuery } from "@tanstack/react-query";
import invoiceService from "api/invoices";
import { InputHTMLAttributes } from "react";
import { Link, useParams } from "react-router-dom";

import download from "assets/images/icons/download.svg";
import link from "assets/images/icons/link.svg";

import { usePageTitle } from "lib/hooks";
import { InvoiceStatus } from "lib/types/invoices";
import { formatCurrency, formatDate, getStatusVariant } from "lib/utils";

import Button from "components/ui/button";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

const IndividualInvoicePage = () => {
  const params = useParams();
  const id = params.id;

  usePageTitle(`INV-${id?.slice(-4)}`.toUpperCase());

  const { data, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getOne(id as string),
    enabled: !!id,
  });
  if (isLoading)
    return (
      <div className="flex h-[470px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-[24px] font-semibold">
            Invoice {`ID#${id?.slice(-4)}`.toUpperCase()}
          </p>
          <Status variant={getStatusVariant(data?.status as InvoiceStatus)}>
            {data?.status}
          </Status>
        </div>

        <div className="flex justify-end gap-4">
          <Button buttonType="secondary">
            <img src={download} alt="download" />
            Download
          </Button>

          {data?.status === "Pending" && (
            <Button className="!min-w-[155px]">Pay now</Button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-4">
          <p className="text-[20px] font-semibold">Invoice details</p>
          <div className="rounded-[8px] border border-white/30 p-6">
            <div className="grid-cols 1 grid max-w-[656px] gap-4 sm:grid-cols-2">
              <Data
                label="Date invoiced"
                value={formatDate(
                  new Date(data?.createdAt || ""),
                  "dd-LLL-yyyy"
                )}
              />
              <Data
                label="Amount"
                value={formatCurrency(data?.grossAmount as number)}
              />
              <Data
                label="Date due"
                value={formatDate(new Date(data?.dueDate || ""), "dd-LLL-yyyy")}
              />
              <Data
                label="Date paid"
                value={formatDate(
                  new Date(data?.paidDate || ""),
                  "dd-LLL-yyyy"
                )}
              />
            </div>
          </div>
        </div>

        <p className="text-[20px] font-semibold">Milestones</p>

        <div className="table-breakpoint:hidden">
          <Cards.Container className="!grid-cols-1" isLoading={isLoading}>
            {data?.items.map((item, index) => {
              const { milestone, id, outcome, cost, status, invoiceDate } =
                item;

              return (
                <Cards.Card
                  onClick={() => {}}
                  key={index}
                  title={milestone.title}
                >
                  <Cards.Group cols={2}>
                    <Cards.Details label="Milestone ID" value={id} />
                    <Cards.Details label="Outcome name" value={outcome.name} />
                    <Cards.Details
                      label="Milestone type"
                      value={"**not available in response**"}
                    />
                    <Cards.Details
                      label="Milestone reference"
                      value={milestone.link}
                    />
                    <Cards.Details label="Cost" value={formatCurrency(cost)} />
                    <Cards.Details label="Status" value={status} />
                    <Cards.Details
                      label="Date created"
                      value={formatDate(new Date(invoiceDate), "dd-LLL-yyyy")}
                    />
                    <Cards.Details
                      label="Date achieved"
                      value={
                        "**needs clarification to which date this refers to**"
                      }
                    />
                  </Cards.Group>
                </Cards.Card>
              );
            })}
          </Cards.Container>
        </div>

        <div
          className="hidden overflow-x-auto table-breakpoint:block"
          style={{
            width: `calc(100vw - 250px)`,
          }}
        >
          <Table.Container>
            <Table.Head>
              <Table.Row>
                {MILESTONE_HEADERS.map((header, index) => (
                  <Table.Header key={index}>{header}</Table.Header>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {data?.items.map((item, index) => {
                const { milestone, id, outcome, cost, status } = item;

                return (
                  <Table.Row key={index}>
                    <Table.Data>
                      <Link to="#" className="flex items-center gap-2">
                        {" "}
                        {`ID#${id.slice(-3).toUpperCase()}`}{" "}
                        <img src={link} alt="link" />
                      </Link>
                    </Table.Data>
                    <Table.Data>
                      ** No project name in the response**
                    </Table.Data>
                    <Table.Data>**Need to add type in outcomes**</Table.Data>
                    <Table.Data>
                      <Link to={milestone.link} className="hover:underline">
                        {milestone.title}
                      </Link>
                    </Table.Data>
                    <Table.Data>{outcome.name}</Table.Data>
                    <Table.Data>{formatCurrency(cost)}</Table.Data>
                    <Table.Data>
                      <Status variant={getStatusVariant(status)}>
                        {status}
                      </Status>
                    </Table.Data>

                    {/* <Table.Data>{outcome.name}</Table.Data>
                    <Table.Data>{"**not available in response**"}</Table.Data>
                    <Table.Data>{milestone.link}</Table.Data>
                    <Table.Data>{formatCurrency(cost)}</Table.Data>
                    <Table.Data>{status}</Table.Data>
                    <Table.Data>
                      {formatDate(new Date(invoiceDate), "dd-LLL-yyyy")}
                    </Table.Data>
                    <Table.Data>
                      {"**needs clarification to which date this refers to**"}
                    </Table.Data> */}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Container>
        </div>
      </div>
    </div>
  );
};

export default IndividualInvoicePage;

const Data = ({
  label,
  value,
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-light">{label}</label>
      <p className="font-light">{value}</p>
    </div>
  );
};

const MILESTONE_HEADERS = [
  "Milestone ID",
  "Project name",
  "Type",
  "Reference",
  "Outcome name",
  "Cost",
  "Evidence status",
];
