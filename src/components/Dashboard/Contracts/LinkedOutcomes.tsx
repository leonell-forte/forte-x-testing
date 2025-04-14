import { useState } from "react";

import { IContractOutcomeRates } from "lib/types/contracts";
import { formatCurrency } from "lib/utils";

import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import SearchInput from "components/ui/search-input";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

const LinkedOutcomes = ({
  outcomes: list,
  isLoading,
}: {
  outcomes: IContractOutcomeRates[];
  isLoading: boolean;
}) => {
  const [search, setSearch] = useState("");

  const outcomes = list.filter((item) => {
    return item.outcome?.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <>
      <div className="space-y-2.5">
        <SearchInput
          placeholder="Search"
          className="md:max-w-[313px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="lg:hidden">
          <Cards.Container
            isLoading={isLoading}
            className="!grid-cols-1 md:!grid-cols-2"
          >
            {outcomes?.map((item, index) => {
              const { id, outcome, perOutcome, rate } = item;

              return (
                <Cards.Card key={index} title={`ID#${id}`}>
                  <Cards.Group cols={2}>
                    <Cards.Details label="Outcome" value={outcome} />
                    <Cards.Details
                      label="Outcome type"
                      value={perOutcome ? "Per outcome" : "Threshold"}
                    />
                    <Cards.Details
                      label="Rate"
                      value={formatCurrency(Number(rate))}
                    />
                  </Cards.Group>
                </Cards.Card>
              );
            })}
          </Cards.Container>
        </div>

        <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
          <Table.Container
            isEmpty={outcomes.length === 0}
            isLoading={isLoading}
          >
            <Table.Head>
              <Table.Row>
                {HEADERS.map((item, index) => {
                  return <Table.Header key={index}>{item}</Table.Header>;
                })}
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {outcomes?.map((item, index) => {
                const { id, outcome, perOutcome, rate } = item;

                return (
                  <Table.Row key={index}>
                    <Table.Data>ID#{id}</Table.Data>
                    <Table.Data>{outcome}</Table.Data>
                    <Table.Data>
                      {perOutcome ? "Per outcome" : "Threshold"}
                    </Table.Data>
                    <Table.Data>{formatCurrency(Number(rate))}</Table.Data>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Container>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default LinkedOutcomes;

const HEADERS = ["Outcome", "Outcome name", "Outcome type", "Rate"];
