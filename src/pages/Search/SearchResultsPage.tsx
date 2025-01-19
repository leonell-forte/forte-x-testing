import { useQuery } from "@tanstack/react-query";
import { searchConsole } from "api/search";
import { startCase } from "lodash";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

import search from "assets/images/icons/search.svg";

import { usePageTitle } from "lib/hooks";
import { IBeneficiaries } from "lib/types/beneficiaries";
import { IContract } from "lib/types/contracts";
import { IOrganization } from "lib/types/organizations";
import { IProject } from "lib/types/projects";
import { IUser } from "lib/types/users";

import BeneficiariesTable from "components/tables/Beneficiaries";
import ContractsTable from "components/tables/Contracts";
import OrganizationTable from "components/tables/Organization";
import ProjectsTable from "components/tables/Projects";
import UsersTable from "components/tables/Users";
import Accordion from "components/ui/accordion/Accordion";
import Spinner from "components/ui/spinner/spinner";

export interface SearchItem {
  data: (IBeneficiaries | IContract | IOrganization | IProject | IUser)[];
  table: string;
}

const SearchResultsPage = () => {
  const renderTable = useCallback((item: SearchItem) => {
    switch (item.table) {
      case "beneficiaries":
        return <BeneficiariesTable list={item.data as IBeneficiaries[]} />;

      case "contracts":
        return <ContractsTable list={item.data as IContract[]} />;

      case "organizations":
        return <OrganizationTable list={item.data as IOrganization[]} />;

      case "projects":
        return <ProjectsTable list={item.data as IProject[]} />;

      case "users":
        return <UsersTable list={item.data as IUser[]} />;
    }
  }, []);

  const { query = "" } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["search-console", query],

    queryFn: () => searchConsole({ searchText: query }),

    enabled: Boolean(query),
  });

  usePageTitle(`Showing results for "${query}"`);

  const tables = [
    "beneficiaries",
    "contracts",
    "organizations",
    "projects",
    "users",
  ];

  const firstTableWithResult = data?.find((item) => item.data.length > 0);

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-10 py-[144px]">
          <img alt="search" src={search} className="w-16" />
          <div className="text-2xl font-semibold">
            We couldn&apos;t find anything matching your search.
          </div>
        </div>
      ) : (
        <div className="space-y-4 px-2">
          {tables.map((table) => {
            const item = data?.find((x) => x.table === table) || {
              table,
              data: [],
            };
            return (
              <div className="space-y-4" key={JSON.stringify(item)}>
                <Accordion
                  text={
                    <div className="text-2xl font-semibold">
                      {startCase(table)} {`(${item?.data?.length})`}
                    </div>
                  }
                  defaultOpen={
                    table === "beneficiaries" ||
                    firstTableWithResult?.table === table
                  }
                >
                  {item?.data?.length === 0
                    ? `No result found for "${query}" in ${table}.`
                    : renderTable(item)}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
