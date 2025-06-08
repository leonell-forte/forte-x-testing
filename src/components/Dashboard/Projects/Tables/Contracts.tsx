import { useState } from "react";
import { BiSlider as SliderIcon } from "react-icons/bi";

import useContractList from "lib/common/lists/useContractList";
import { usePage } from "lib/hooks";
import { SortValues } from "lib/types/common";
import { ContractSortLabel, IContractFilters } from "lib/types/contracts";

import ContractsTable from "components/tables/Contracts";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

import { Filters } from "pages/Contracts/ContractsPage";

import ContractDialogue from "../../Contracts/Dialogues/ContractDialogue";
import TagExistingDialogue from "../Dialogues/TagExistingDialogue";

type ModalLabelType = "contract" | "tag" | "filter" | "";

interface IProps {
  projectId?: number;

  providerId?: string;

  funderId?: string;
}

const Contracts = ({ projectId, providerId, funderId }: IProps) => {
  const { page, setPage } = usePage();

  const initialFilter: IContractFilters = {
    status: "",

    project: projectId?.toString() || "",

    date: "",

    providerId: providerId || "",

    funderId: funderId || "",

    sortLabel: ContractSortLabel.CREATED_AT,

    sortValue: SortValues.DESC,
  };

  const [filters, setFilters] = useState<IContractFilters>(initialFilter);

  const {
    isLoading,
    rawList: contractList,
    handleSearchContract,
    searchContractValue,
  } = useContractList({
    key: [page, filters],
    page,
    filters,
  });

  const [selectedContract, setSelectedContract] = useState("");

  const [modal, setModal] = useState<ModalLabelType>("");

  const close = () => {
    setModal("");

    setSelectedContract("");
  };

  const renderModal = (modal: ModalLabelType) => {
    switch (modal) {
      case "contract":
        return <ContractDialogue id={selectedContract} projectId={projectId} />;

      case "tag":
        return (
          <TagExistingDialogue
            isVisible={modal === "tag"}
            handleClose={close}
            title="Add contracts to project"
          />
        );
      case "filter":
        return (
          <Dialogue
            hideClose
            isVisible={modal === "filter"}
            title="Filters"
            handleClose={close}
          >
            <div className="space-y-6">
              <Filters
                filters={filters}
                setFilters={setFilters}
                projectId={projectId}
                initialFilter={initialFilter}
              />
              <div className="flex justify-end gap-2">
                <Button
                  buttonType="secondary"
                  onClick={() => {
                    setFilters(initialFilter);
                  }}
                >
                  Clear
                </Button>
                <Button onClick={close}>Apply</Button>
              </div>
            </div>
          </Dialogue>
        );
    }
  };

  return (
    <>
      {renderModal(modal)}

      <div className="space-y-2.5">
        {!!contractList?.items.length && (
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="flex gap-2">
              <div className="w-full md:w-auto">
                <SearchInput
                  value={searchContractValue}
                  onChange={(e) => {
                    handleSearchContract(e.target.value);
                  }}
                  containerClass="w-full lg:max-w-[286px]"
                  placeholder="Search contracts"
                  onClear={() => handleSearchContract("")}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModal("filter");
                }}
                className="group flex-shrink-0 lg:hidden"
              >
                <SliderIcon className="h-auto w-6 transition-all group-hover:fill-mint" />
              </button>
            </div>

            <div className="hidden lg:block">
              <Filters
                filters={filters}
                setFilters={setFilters}
                projectId={projectId}
                initialFilter={initialFilter}
              />
            </div>
          </div>
        )}

        <div className="flex h-full flex-col justify-between gap-4">
          <ContractsTable
            list={contractList.items}
            isLoading={isLoading}
            projectId={projectId}
          />

          {!!contractList?.items.length && (
            <div className="flex w-full items-center justify-end">
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                pageSize={contractList?.pageSize}
                total={contractList?.totalSize as number}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Contracts;
