import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { BiSlider as SliderIcon } from "react-icons/bi";
import { HiPlus } from "react-icons/hi2";
import { TbFilterX as FilterIcon } from "react-icons/tb";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { create } from "zustand";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import useProjectList from "lib/common/lists/useProjectList";
import { BENEFICIARY_STATUS, RISK_LEVEL } from "lib/constants";
import { useDebounce, usePage } from "lib/hooks";
import {
  Beneficiaries,
  Funders,
  IsAuthorized,
  Providers,
} from "lib/role-permissions";
import { IBeneficiariesFilter } from "lib/types/beneficiaries";
import { findLabelFromOptions, sortOptions } from "lib/utils";

import { showSetupBeneficiaryModal } from "components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import { useProfile } from "components/ProfileContext";
import BeneficiariesTable from "components/tables/Beneficiaries";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu/DropdownMenu";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

import ViewMilestone from "pages/Milestones/ViewMilestone";

import BulkUpload from "./BulkUpload";
import ViewBeneficiary from "./ViewBeneficiary";

type BeneficiariesProps = {
  projectId?: string;
  contractId?: string;
  hideHeader?: boolean;
  providerId?: string;
  funderId?: string;
};

type ModalLabelTypes =
  | "beneficiaries"
  | "delete"
  | "import"
  | "update status"
  | "filter"
  | "";

type TBeneStore = {
  beneficiaryName: string;
  setBeneficiaryName: (name: string) => void;
};

export const useBeneficiaryStore = create<TBeneStore>()((set) => ({
  beneficiaryName: "",
  setBeneficiaryName: (name) => set(() => ({ beneficiaryName: name })),
}));

const BeneficiariesComp = ({
  projectId,
  contractId,
  hideHeader,
  providerId,
  funderId,
}: BeneficiariesProps) => {
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const initialFilter = {
    project: projectId || "",

    status: "",

    provider: providerId || "",

    riskLevel: "",

    contractId: contractId || "",

    funderId: funderId || "",
  };

  const [filters, setFilters] = useState<IBeneficiariesFilter>(initialFilter);

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search]
  );

  const { page, setPage } = usePage();

  const [modal, setModal] = useState<ModalLabelTypes>("");

  const [beneficiaryId, setBeneficiaryId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: beneficiariesList, isLoading } = useQuery({
    queryKey: ["beneficiaries", debouncedSearch, page, filters],

    queryFn: () =>
      beneficiariesService.list({ search: debouncedSearch, page, filters }),
  });

  const close = () => {
    setModal("");

    setBeneficiaryId(null);

    setPage(1);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "filter":
        return (
          <Dialogue
            hideClose
            title="Filters"
            isVisible={modal === "filter"}
            handleClose={close}
          >
            <div className="space-y-6">
              <Filters filters={filters} setFilters={setFilters} />
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
    //eslint-disable-next-line
  }, [modal, beneficiaryId, selectedIds, filters]);

  const navigate = useNavigate();

  return (
    <>
      {renderModal()}

      <div className="flex h-full flex-col space-y-2.5">
        <div className="space-y-4">
          {!hideHeader && (
            <div className="flex flex-col justify-between gap-x-8 gap-y-1.5 lg:flex-row">
              <p className="text-[24px] font-semibold">Beneficiaries</p>

              <div className="flex w-full flex-wrap justify-start gap-2.5 md:w-auto lg:justify-end">
                {IsAuthorized([Beneficiaries.CREATE]) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button eventName="Add Beneficiary">
                        <HiPlus className="h-auto w-6 fill-black" />
                        Add beneficiary
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      side="bottom"
                      sideOffset={1}
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          showSetupBeneficiaryModal({});
                        }}
                      >
                        Single entry
                      </DropdownMenuItem>
                      {IsAuthorized([Beneficiaries.IMPORT]) && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/beneficiaries/bulk-upload");
                          }}
                        >
                          Bulk upload
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          )}

          <div className="flex">
            <div className="flex w-full flex-col flex-wrap items-start gap-2.5 lg:w-auto lg:flex-row">
              <div className="flex w-full items-center gap-2 md:w-auto">
                <div className="w-full md:w-auto">
                  <SearchInput
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search beneficiaries"
                    containerClass="w-full lg:max-w-[286px]"
                    onClear={() => setSearch("")}
                    tooltip="Search by first name, last name, phone number, cohort name, or email."
                  />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal("filter");
                  }}
                  className="group flex-shrink-0 xl:hidden"
                >
                  <SliderIcon className="h-auto w-6 transition-all group-hover:fill-mint" />
                </button>
              </div>
              <div className="hidden xl:block">
                <Filters
                  filters={filters}
                  setFilters={setFilters}
                  projectId={projectId}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <BeneficiariesTable
            list={beneficiariesList?.items || []}
            isLoading={isLoading}
            setChecked={setSelectedIds}
            funderId={funderId}
            providerId={providerId}
            projectId={projectId}
            contractId={contractId}
          />

          {!!beneficiariesList?.items?.length && (
            <div className="flex w-full items-center justify-end">
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                pageSize={beneficiariesList.pageSize}
                total={beneficiariesList?.totalSize as number}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface IFilterProps {
  filters: IBeneficiariesFilter;

  setFilters: Dispatch<SetStateAction<IBeneficiariesFilter>>;

  projectId?: string;
}

export const Filters = ({ filters, setFilters, projectId }: IFilterProps) => {
  const { setPage } = usePage();
  const { isProviderUser } = useProfile();

  const {
    projects,
    isLoading: projectLoading,
    handleSearchProject,
  } = useProjectList({
    key: ["filter"],
    pageSize: 100,
  });

  const {
    organizations,
    isLoading: orgLoading,
    handleSearchOrg,
  } = useOrganizationList({
    key: ["filter"],
    filters: { type: "provider" },
    enabled: IsAuthorized([Providers.LIST, Funders.LIST]),
    pageSize: 100,
  });

  return (
    <div className="grid w-full grid-cols-1 flex-wrap gap-2.5 xl:flex xl:flex-row">
      {!projectId && (
        <Dropdown
          enableSearch
          value={findLabelFromOptions(projects, filters.project as string)}
          loading={projectLoading}
          options={sortOptions(projects)}
          placeholder="Projects"
          className="xl:w-[166px]"
          contentWidth={200}
          handleSelect={(val) => {
            setFilters((prev) => ({ ...prev, project: val as string }));
            setPage(1);
          }}
          onChange={(e) => handleSearchProject(e.target.value)}
        />
      )}

      <Dropdown
        options={BENEFICIARY_STATUS}
        placeholder="Status"
        className="xl:w-[166px]"
        contentWidth={230}
        value={filters.status}
        handleSelect={(val) => {
          setFilters((prev) => ({ ...prev, status: val as string }));
          setPage(1);
        }}
      />

      {!isProviderUser && IsAuthorized([Providers.LIST, Funders.LIST]) && (
        <Dropdown
          loading={orgLoading}
          options={organizations}
          placeholder="Provider"
          contentWidth={270}
          className="xl:w-[166px]"
          value={findLabelFromOptions(
            organizations,

            filters.provider as string
          )}
          handleSelect={(val) => {
            setPage(1);
            setFilters((prev) => ({
              ...prev,
              provider: val as string,
            }));
          }}
          enableSearch
          onChange={(e) => handleSearchOrg(e.target.value)}
        />
      )}

      <div className="flex w-full items-center gap-2.5 xl:w-auto">
        <Dropdown
          options={RISK_LEVEL}
          placeholder="Risk Level"
          className="xl:w-[166px]"
          value={filters.riskLevel}
          handleSelect={(val) => {
            setFilters((prev) => ({
              ...prev,
              riskLevel: val as string,
            }));
            setPage(1);
          }}
        />

        <button
          onClick={() =>
            setFilters({
              project: "",

              status: "",

              provider: "",

              riskLevel: "",
            })
          }
          className="group hidden flex-shrink-0 xl:block"
        >
          <FilterIcon className="h-auto w-5 fill-white transition-all group-hover:fill-mint group-hover:stroke-mint" />
        </button>
      </div>
    </div>
  );
};

export default function BeneficiariesPage({
  projectId,
  contractId,
  hideHeader,
  providerId,
  funderId,
}: BeneficiariesProps) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const beneficiaryId = pathnames?.[1] || "";
  const milestoneId = pathnames?.[3] || "";
  const { beneficiaryName } = useBeneficiaryStore();

  return (
    <Routes>
      <Route
        index
        element={
          <BeneficiariesComp
            projectId={projectId}
            contractId={contractId}
            hideHeader={hideHeader}
            providerId={providerId}
            funderId={funderId}
          />
        }
      />
      <Route
        path="bulk-upload"
        element={
          <>
            <BreadCrumb href="/beneficiaries">Beneficiaries</BreadCrumb>
            <BreadCrumb>Bulk Upload</BreadCrumb>
            <BulkUpload />
          </>
        }
      />
      <Route
        path=":beneficiaryId"
        element={
          <>
            <BreadCrumb href="/beneficiaries">Beneficiaries</BreadCrumb>
            <BreadCrumb>{beneficiaryName}</BreadCrumb>
            <ViewBeneficiary />
          </>
        }
      />
      <Route
        path=":beneficiaryId/milestone/:milestoneId"
        element={
          <>
            <BreadCrumb href="/beneficiaries">Beneficiaries</BreadCrumb>
            <BreadCrumb href={`/beneficiaries/${beneficiaryId}`}>
              {beneficiaryName}
            </BreadCrumb>
            <BreadCrumb
              href={`/beneficiaries/${beneficiaryId}/milestone/${milestoneId}`}
            >
              Milestone ID: {milestoneId}
            </BreadCrumb>
            <ViewMilestone />
          </>
        }
      />
    </Routes>
  );
}
