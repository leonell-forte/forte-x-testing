import { useQuery } from "@tanstack/react-query";
import invoiceService from "api/invoices";
import { InputHTMLAttributes } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import arrow from "assets/images/icons/arrow.svg";

import { usePageTitle } from "lib/hooks";
import { formatCurrency, formatDate } from "lib/utils";

import Button from "components/ui/button";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

const IndividualInvoicePage = () => {
  const navigate = useNavigate();
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
      <Link
        to={".."}
        onClick={(e) => {
          e.preventDefault();
          navigate("/invoices");
        }}
        className="flex items-center gap-2.5"
      >
        <img src={arrow} alt="back" />

        <p className="font-semibold">Back</p>
      </Link>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            label="Invoice date"
            value={formatDate(new Date(data?.createdAt || ""), "dd-LLL-yyyy")}
          />
          <InputWithLabel
            label="Date due"
            value={formatDate(new Date(data?.dueDate || ""), "dd-LLL-yyyy")}
          />
          <InputWithLabel
            label="Date paid"
            value={formatDate(new Date(data?.paidDate || ""), "dd-LLL-yyyy")}
          />
          <InputWithLabel
            label="Total"
            value={formatCurrency(data?.grossAmount as number)}
          />
          <InputWithLabel label="Status" value={data?.status} />
        </div>

        <div className="flex justify-end gap-4">
          {data?.status === "Pending" && (
            <Button buttonType="secondary">Proceed to payment</Button>
          )}
          <Button>Download</Button>
        </div>

        <div className="flex items-center gap-5">
          <p className="heading w-fit whitespace-nowrap">Milestones</p>

          <hr className="w-full" />
        </div>

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
                const { milestone, id, outcome, cost, status, invoiceDate } =
                  item;

                return (
                  <Table.Row key={index}>
                    <Table.Data>{id}</Table.Data>
                    <Table.Data>{outcome.name}</Table.Data>
                    <Table.Data>{"**not available in response**"}</Table.Data>
                    <Table.Data>{milestone.link}</Table.Data>
                    <Table.Data>{formatCurrency(cost)}</Table.Data>
                    <Table.Data>{status}</Table.Data>
                    <Table.Data>
                      {formatDate(new Date(invoiceDate), "dd-LLL-yyyy")}
                    </Table.Data>
                    <Table.Data>
                      {"**needs clarification to which date this refers to**"}
                    </Table.Data>
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

const InputWithLabel = ({
  label,
  value,
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
  return (
    <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center">
      <label className="w-[80px] sm:w-[140px]">{label}</label>
      <Input value={value} readOnly />
    </div>
  );
};

const MILESTONE_HEADERS = [
  "Milestone ID",
  "Outcome name",
  "Milestone type",
  "Milestone reference",
  "Cost",
  "Status",
  "Date created",
  "Date achieved",
];
