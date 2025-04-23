import { Dispatch, SetStateAction, useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { TbFilterX as FilterIcon } from "react-icons/tb";
import { Route, Routes, useLocation } from "react-router-dom";

import useInvoiceList from "lib/common/lists/useInvoiceList";
import { INVOICE_STATUS } from "lib/constants";
import { useDebounce, usePage } from "lib/hooks";
import { InvoiceFilters, InvoiceStatus } from "lib/types/invoices";

import { showGenerateInvoiceModal } from "components/Dashboard/Invoices/modals/GenerateInvoice";
import InvoicesTable from "components/tables/Invoices";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

import ViewMilestone from "pages/Milestones/ViewMilestone";

import IndividualInvoicePage from "./[id]/IndividualInvoicePage";

export function getRandomString(array: string[]): string | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const InvoicesComp = () => {
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
    key: [page, debouncedSearch, filters],
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
              <Button onClick={showGenerateInvoiceModal}>
                <HiPlus className="h-auto w-6 fill-black" />
                Generate Invoice
              </Button>
            </div>

            {!!invoices?.items.length && (
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
                </div>
                <div className="hidden w-full md:block">
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    handleRemoveFilters={() => setFilters({ status: "" })}
                  />
                </div>
              </div>
            )}
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
  const { setPage } = usePage();

  return (
    <div className="flex flex-col gap-2.5 md:flex-row">
      <Dropdown
        value={filters.status}
        handleSelect={(val) => {
          setFilters((prev) => ({ ...prev, status: val as InvoiceStatus }));
          setPage(1);
        }}
        placeholder="Select status"
        className="w-full lg:max-w-[180px]"
        options={INVOICE_STATUS}
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

export default function InvoicesPage() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <Routes>
      <Route index element={<InvoicesComp />} />
      <Route
        path=":invoiceId"
        element={
          <>
            <BreadCrumb href="/invoices">Invoices</BreadCrumb>
            <BreadCrumb>Invoice ID: {pathnames?.[1] || ""}</BreadCrumb>
            <IndividualInvoicePage />
          </>
        }
      />
      <Route
        path=":id/:milestoneId"
        element={
          <>
            <BreadCrumb href="/invoices">Invoices</BreadCrumb>
            <BreadCrumb href={`/invoices/${pathnames?.[1]}`}>
              Invoice ID: {pathnames?.[1] || ""}
            </BreadCrumb>
            <BreadCrumb>Milestone ID: {pathnames?.[2] || ""}</BreadCrumb>
            <ViewMilestone />
          </>
        }
      />
    </Routes>
  );
}
