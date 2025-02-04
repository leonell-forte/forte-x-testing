import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import projectService from "api/projects";
import { useCallback, useMemo, useState } from "react";

import closeFilter from "assets/images/icons/close-filter.svg";

import { CONTRACT_STATUS } from "lib/constants";
import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import { IContract, IContractFilters, StatusType } from "lib/types/contracts";
import { IProject } from "lib/types/projects";
import { findLabelFromOptions } from "lib/utils";

import ContractDialogue from "components/Dashboard/Contracts/Dialogues/ContractDialogue";
import ContractsTable from "components/tables/Contracts";
import Button from "components/ui/button";
import Dropdown, { IOption } from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

const ContractsPage = () => {
  usePageTitle("Contracts");

  const { page, setPage } = usePage();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<IContractFilters>({
    status: "",

    project: "",

    date: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [contractId, setContractId] = useState<number | null>(null);

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search]
  );

  const { data: contractList, isLoading } = useQuery({
    queryKey: ["contracts", page, debouncedSearch, filters],

    queryFn: () =>
      contractService.list({
        page,

        filters,

        search: debouncedSearch,

        listAll: false,
      }),
  });

  const { data: projecrList, isLoading: isProjectLoading } = useQuery({
    queryKey: ["projects"],

    queryFn: () => projectService.list({ page, listAll: true }),
  });

  const contracts: IContract[] = useMemo(
    () =>
      contractList?.items.map((item) => ({
        ...item,
        documentName: item.document!.toString(),
      })) || [],

    [contractList]
  );

  const projects: IOption[] = useMemo(
    () =>
      projecrList?.items?.map((item: IProject) => ({
        label: item.name,

        value: item.id.toString(),
      })) || [],

    [projecrList]
  );

  const [modal, setModal] = useState<"contract" | "delete" | null>(null);

  const close = () => {
    setContractId(null);

    setModal(null);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "contract":
        return (
          <ContractDialogue
            id={contractId!}
            isVisible={modal === "contract"}
            handleClose={close}
          />
        );
    }
  }, [modal, contractId]);

  return (
    <>
      {renderModal()}

      <div className="space-y-2.5">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!w-[286px]"
            placeholder="Search contracts"
            onClear={() => setSearch("")}
          />

          <div className="flex items-center gap-6">
            <Button
              eventName="Add Contract"
              onClick={() => setModal("contract")}
            >
              Add contract
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-[10px]">
          <p className="flex-shrink-0 text-[20px] font-medium">Filter by</p>

          <Dropdown
            noHelperText
            placeholder="Status"
            className="max-w-[166px]"
            options={CONTRACT_STATUS}
            value={filters.status}
            handleSelect={(val) =>
              setFilters((prev) => ({ ...prev, status: val as StatusType }))
            }
          />

          <Dropdown
            noHelperText
            value={findLabelFromOptions(projects, filters.project)}
            handleSelect={(val) =>
              setFilters((prev) => ({ ...prev, project: val as string }))
            }
            loading={isProjectLoading}
            options={projects}
            placeholder="Project"
            className="max-w-[166px]"
          />

          {/* Temporarily comment out date filter */}
          {/* <div className="max-w-[166px]">
            <DatePicker
              noHelperText
              value={new Date(filters.date)}
              onChange={(date) => {
                setFilters((prev) => ({
                  ...prev,

                  date: formatDate(date as Date, "yyyy-LL-dd"),
                }));
              }}
            />
          </div> */}

          <button
            onClick={() =>
              setFilters({
                status: "",

                project: "",

                date: "",
              })
            }
          >
            <img src={closeFilter} alt="close-filter" />
          </button>
        </div>

        <div>
          <ContractsTable list={contracts} isLoading={isLoading} />

          <div className="mt-[18px] flex w-full items-center justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={contractList?.totalSize as number}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractsPage;
