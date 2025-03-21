import { Dispatch, SetStateAction, useState } from "react";
import { TbFilterX as FilterIcon } from "react-icons/tb";

// import { BiSlider as SliderIcon } from "react-icons/bi";
import add from "assets/images/icons/add.svg";

import useInvoiceList from "lib/common/lists/useInvoiceList";
import { INVOICE_STATUSES } from "lib/constants";
import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import { InvoiceFilters, InvoiceStatus } from "lib/types/invoices";

import { showGenerateInvoiceModal } from "components/Dashboard/Invoices/modals/GenerateInvoice";
import InvoicesTable from "components/tables/Invoices";
import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

const InvoicesPage = () => {
  const { page, setPage } = usePage();

  const [filters, setFilters] = useState<InvoiceFilters>({
    status: "",
  });

  const [showFilter, setShowFilter] = useState(false);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,
    [search]
  );

  const { invoices, isLoading } = useInvoiceList({
    page,
    search: debouncedSearch,
    key: [page, debouncedSearch],
    filters,
  });

  return (
    <>
      <FilterDialogue
        filters={filters}
        setFilters={setFilters}
        handleRemoveFilters={() => setFilters({ status: "" })}
        isVisible={showFilter}
        handleClose={() => setShowFilter(false)}
      />
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-2.5">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <p className="text-[24px] font-semibold">Invoices</p>
              <Button onClick={() => showGenerateInvoiceModal()}>
                <img src={add} alt="add" width={14} height={14} />
                Generate Invoice
              </Button>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex gap-2">
                <div className="w-full md:w-[286px]">
                  <SearchInput
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full"
                    placeholder="Search invoice"
                    onClear={() => setSearch("")}
                  />
                </div>
                {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilter(true);
                }}
                className="group flex-shrink-0 md:hidden"
              >
                <SliderIcon className="h-auto w-6 transition-all group-hover:fill-mint" />
              </button> */}
              </div>
              {/* <div className="hidden w-full md:block">
              <Filters
                filters={filters}
                setFilters={setFilters}
                handleRemoveFilters={() => setFilters({ status: "" })}
              />
            </div> */}
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col justify-between gap-4">
          <InvoicesTable list={invoices?.items} isLoading={isLoading} />

          <div className="flex w-full items-center justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={invoices?.totalSize as number}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicesPage;

type FiltersProps = {
  filters: InvoiceFilters;
  setFilters: Dispatch<SetStateAction<InvoiceFilters>>;
  handleRemoveFilters: () => void;
};

const Filters = ({
  filters,
  setFilters,
  handleRemoveFilters,
}: FiltersProps) => {
  return (
    <div className="flex flex-col gap-2.5 md:flex-row">
      <Dropdown
        value={filters.status}
        handleSelect={(val) => {
          setFilters((prev) => ({ ...prev, status: val as InvoiceStatus }));
        }}
        placeholder="Select status"
        className="md:max-w-[250px]"
        options={INVOICE_STATUSES.map((status) => ({
          label: status,
          value: status,
        }))}
      />
      <button
        onClick={handleRemoveFilters}
        className="group hidden flex-shrink-0 md:block"
      >
        <FilterIcon className="h-auto w-5 fill-white transition-all group-hover:fill-mint group-hover:stroke-mint" />
      </button>
    </div>
  );
};

type FilterDialogueProps = IDialogueProps & {
  filters: InvoiceFilters;
  setFilters: Dispatch<SetStateAction<InvoiceFilters>>;
  handleRemoveFilters: () => void;
};

const FilterDialogue = ({
  filters,
  setFilters,
  handleRemoveFilters,
  isVisible,
  handleClose,
}: FilterDialogueProps) => {
  return (
    <Dialogue title="Filters" isVisible={isVisible} handleClose={handleClose}>
      <div className="space-y-6">
        <Filters
          filters={filters}
          setFilters={setFilters}
          handleRemoveFilters={handleRemoveFilters}
        />
        <div>
          <div className="flex justify-end gap-2">
            <Button
              buttonType="secondary"
              onClick={() => {
                handleRemoveFilters();
              }}
            >
              Clear
            </Button>
            <Button onClick={handleClose}>Apply</Button>
          </div>
        </div>
      </div>
    </Dialogue>
  );
};
