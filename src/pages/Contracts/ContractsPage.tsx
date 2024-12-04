import Button from "../../components/ui/button";
import Dropdown, { IOption } from "../../components/ui/dropdown";
import SearchInput from "../../components/ui/search-input";
import closeFilter from "../../assets/images/icons/close-filter.svg";
import Table from "../../components/ui/table";
import pencil from "../../assets/images/icons/pencil.svg";
import bin from "../../assets/images/icons/bin.svg";
import ContractDialogue from "../../components/Dashboard/Contracts/Dialogues/ContractDialogue";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import contractService from "../../api/contract";
import {
  IContract,
  IContractFilters,
  StatusType,
} from "../../lib/types/contracts";
import { formatDate } from "../../lib/utils";
import Pagination from "../../components/ui/pagination";
import { useDebounce, usePageTitle } from "../../lib/hooks";
import { STATUS } from "../../lib/constants";
import { capitalize } from "@mui/material";
import DatePicker from "../../components/ui/date-picker";
import DeleteDialogue from "../../components/Dashboard/Contracts/Dialogues/DeleteDialogue";
import HorizontalScroller from "../../components/ui/horizontal-scroller";
import projectService from "../../api/projects";
import { IProject } from "@/lib/types/projects";

const ContractsPage = () => {
  usePageTitle("Contracts");

  const [page, setPage] = useState(1);

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

    [search],
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
    () => contractList?.items || [],

    [contractList],
  );

  const projects: IOption[] = useMemo(
    () =>
      projecrList?.items?.map((item: IProject) => ({
        label: item.name,

        value: item.name,
      })) || [],

    [projecrList],
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

      case "delete":
        return (
          <DeleteDialogue
            id={contractId!.toString()}
            isVisible={modal === "delete"}
            handleClose={close}
          />
        );
    }
  }, [modal, contractId]);

  const handleEditContract = (id: number) => {
    setModal("contract");

    setContractId(id);
  };

  const handleDeleteContract = (id: number) => {
    setModal("delete");

    setContractId(id);
  };

  return (
    <>
      {renderModal()}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between w-full gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!w-[286px]"
            placeholder="Search contract"
            onClear={() => setSearch("")}
          />

          <div className="flex items-center gap-6">
            <Button
              eventName="Add User"
              onClick={() => setModal("contract")}
            >
              Add contract
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-[18px]">
          <p className="text-[20px] font-medium flex-shrink-0">Filter by</p>

          <Dropdown
            noHelperText
            placeholder="Status"
            className="max-w-[166px]"
            options={STATUS}
            value={filters.status}
            handleSelect={(val) =>
              setFilters((prev) => ({ ...prev, status: val as StatusType }))
            }
          />

          <Dropdown
            noHelperText
            value={filters.project}
            handleSelect={(val) =>
              setFilters((prev) => ({ ...prev, project: val as string }))
            }
            loading={isProjectLoading}
            options={projects}
            placeholder="Project"
            className="max-w-[166px]"
          />

          <div className="max-w-[166px]">
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
          </div>

          <button
            onClick={() =>
              setFilters({
                status: "",

                project: "",

                date: "",
              })
            }
          >
            <img
              src={closeFilter}
              alt="close-filter"
            />
          </button>
        </div>

        <div className="space-y-[18px] overflow-scroll">
          <div className="pr-4">
            <Table.Container
              isEmpty={!contracts.length}
              isLoading={isLoading}
            >
              <Table.Head>
                <Table.Row>
                  {TABLE_HEADER.map((key, headerIndex) => {
                    return <Table.Header key={headerIndex}>{key}</Table.Header>;
                  })}

                  <Table.Header></Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {contracts?.map((item, index) => {
                  const {
                    id,

                    parties,

                    project,

                    status,

                    outcomes,

                    targetNoOfBenefeciaries,

                    startDate,

                    endDate,

                    document,
                  } = item;
                  return (
                    <Table.Row key={index}>
                      <Table.Data>
                        <p className="w-[90px] truncate">Contract {id}</p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[150px] truncate">{parties}</p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[100px] truncate">
                          {capitalize(status)}
                        </p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[140px] truncate">{project}</p>
                      </Table.Data>

                      <Table.Data>{outcomes}</Table.Data>

                      <Table.Data>{targetNoOfBenefeciaries}</Table.Data>

                      <Table.Data>{targetNoOfBenefeciaries}</Table.Data>

                      <Table.Data>
                        {formatDate(startDate, "LL-dd-yyyy")}
                      </Table.Data>

                      <Table.Data>
                        {formatDate(endDate, "LL-dd-yyyy")}
                      </Table.Data>

                      <Table.Data>{document}</Table.Data>

                      <Table.Data>
                        <div className="flex justify-end">
                          <Button
                            eventName="Edit Contract"
                            id={id!.toString()}
                            buttonType="default"
                            type="button"
                            onClick={() => handleEditContract(id!)}
                            className="p-[3px]"
                          >
                            <img
                              alt="pencil"
                              src={pencil}
                            />
                          </Button>

                          <Button
                            eventName="Delete Contract"
                            id={id!.toString()}
                            buttonType="default"
                            type="button"
                            onClick={() => handleDeleteContract(id!)}
                            className="p-[3px]"
                          >
                            <img
                              alt="bin"
                              src={bin}
                            />
                          </Button>
                        </div>
                      </Table.Data>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Container>
          </div>

          <div className="flex justify-end items-center w-full">
            <HorizontalScroller />

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

const TABLE_HEADER = [
  "Contract",
  "Parties",
  "Status",
  "Project",
  "Outcome(s)",
  "Target beneficiaries",
  "Actual beneficiaries ",
  "Start date",
  "End date",
  "Document",
];
