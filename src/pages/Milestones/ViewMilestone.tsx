import { useQuery } from "@tanstack/react-query";
import milestoneService from "api/milestones";
import { HiOutlineDownload as DL } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi2";
import { Link, useParams } from "react-router-dom";

import { usePageTitle } from "lib/hooks";
import { formatDate, formatNumber } from "lib/utils";

import {
  MILESTONE_REFERENCE,
  MILESTONE_TYPES,
  getRandomString,
} from "components/tables/Milestones";
import InfoVertical from "components/ui/info-vertical/InfoVertical";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

export default function ViewMilestone() {
  const { id } = useParams();
  usePageTitle(`Milestone ID: ${id?.split("-")[0]}`);

  const { data: milestone, isLoading } = useQuery({
    queryKey: ["milestone", id],

    queryFn: () => milestoneService.getOne(id!),

    enabled: Boolean(id),
  });

  console.log(milestone);

  if (!milestone) return null;

  return (
    <div className="space-y-8 p-2.5">
      <Link to="/milestones" className="group flex w-fit items-center gap-2.5">
        <HiArrowLeft className="transition group-hover:fill-mint" />
        <p className="font-semibold transition group-hover:text-mint">Back</p>
      </Link>
      <div className="space-y-4">
        <div className="flex items-center gap-x-4">
          <p className="heading w-fit whitespace-nowrap">Milestone Details</p>
          <hr className="w-full" />
        </div>
        <div className="flex flex-wrap items-center gap-x-20 gap-y-12 py-4">
          <InfoVertical label="Milestone ID">{id}</InfoVertical>
          <InfoVertical label="Milestone Name">
            {milestone.milestone.title}
          </InfoVertical>
          <InfoVertical label="Outcome Name">
            {milestone.outcome.name}
          </InfoVertical>
          <InfoVertical label="Milestone Type">
            {getRandomString(MILESTONE_TYPES)}
          </InfoVertical>
          <InfoVertical label="Milestone Reference">
            <button
              type="button"
              onClick={() => alert("Go to reference")}
              className="text-mint hover:underline"
            >
              {getRandomString(MILESTONE_REFERENCE)}
            </button>
          </InfoVertical>
          <InfoVertical label="Cost">
            ${formatNumber(milestone.cost)}
          </InfoVertical>
          <InfoVertical label="Status">{milestone.status}</InfoVertical>
          <InfoVertical label="Date Created">
            {formatDate(milestone.createdAt, "MMMM dd, yyy")}
          </InfoVertical>
          <InfoVertical label="Date Achieved">
            {formatDate(milestone.invoiceDate, "MMMM dd, yyy")}
          </InfoVertical>
          <InfoVertical label="Invoice ID">{milestone.id}</InfoVertical>
          <InfoVertical label="Date Invoiced">
            {formatDate(milestone.invoiceDate, "MMMM dd, yyy")}
          </InfoVertical>
          <InfoVertical label="Date Paid">
            {formatDate(milestone.paidDate, "MMMM dd, yyy")}
          </InfoVertical>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-x-4">
          <p className="heading w-fit whitespace-nowrap">Evidence</p>
          <hr className="w-full" />
        </div>

        <div className="md:hidden">
          <Cards.Container>
            {milestone.evidences.map((item, index) => {
              const { fileName, status, beneficiary } = item;

              return (
                <Cards.Card
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("open view evidence");
                  }}
                  key={index}
                >
                  <div className="space-y-2">
                    <p className="font-semibold">{fileName}</p>
                    <Cards.Group>
                      <Cards.Details label="Description" value="Lorem Ipsum" />
                      <Cards.Details
                        label="Beneficiary ID"
                        value={beneficiary.id}
                      />
                      <Cards.Details label="Status" value={status} capitalize />
                    </Cards.Group>
                    <div className="absolute bottom-3 right-4 z-50">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert("download file");
                        }}
                        className="group"
                      >
                        <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />
                      </button>
                    </div>
                  </div>
                </Cards.Card>
              );
            })}
          </Cards.Container>
        </div>
        <div className="hidden md:block">
          <Table.Container
            isEmpty={!milestone.evidences.length}
            isLoading={isLoading}
          >
            <Table.Head>
              <Table.Row>
                {[
                  "Evidence files",
                  "Description",
                  "Beneficiary ID",
                  "Status",
                ].map((item, index) => {
                  return <Table.Header key={index}>{item}</Table.Header>;
                })}

                <Table.Header></Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {milestone.evidences.map((item, index) => {
                const { fileName, status, beneficiary } = item;
                return (
                  <Table.Row
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("open view evidence");
                    }}
                  >
                    <Table.Data>{fileName}</Table.Data>

                    <Table.Data>Lorem Ipsum</Table.Data>

                    <Table.Data className="w-[200px]">
                      {beneficiary.id}
                    </Table.Data>

                    <Table.Data>
                      <span>{status}</span>
                    </Table.Data>

                    <Table.Data>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert("download evidence");
                        }}
                        className="group mt-1.5"
                      >
                        <DL className="h-auto w-6 transition-all group-hover:stroke-mint" />
                      </button>
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
}
