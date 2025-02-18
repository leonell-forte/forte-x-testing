import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import organizationService from "api/organization";
import projectService from "api/projects";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import closeFilter from "assets/images/icons/close-filter.svg";
import filter from "assets/images/icons/filter.svg";

import { BENEFICIARY_STATUS, RISK_LEVEL } from "lib/constants";
import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import {
  useExportBeneficiaries,
  useExportEvidenceMutation,
} from "lib/mutations/beneficiaries";
import {
  Beneficiaries,
  IsAuthorized,
  Organizations,
} from "lib/role-permissions";
import { IBeneficiariesFilter } from "lib/types/beneficiaries";
import { findLabelFromOptions } from "lib/utils";

import BeneficiariesDialogue from "components/Dashboard/Beneficiaries/Dialogues/BeneficiariesDialogue";
import BulkUpdateStatus from "components/Dashboard/Beneficiaries/Dialogues/BulkUpdateStatus";
import DeleteDialogue from "components/Dashboard/Beneficiaries/Dialogues/DeleteDialogue";
import ImportDialogue from "components/Dashboard/Beneficiaries/Dialogues/ImportDialogue";
import BeneficiariesTable from "components/tables/Beneficiaries";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown, { IOption } from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

type ModalLabelTypes =
  | "beneficiaries"
  | "delete"
  | "import"
  | "update status"
  | "filter"
  | "";

const BeneficiariesPage = () => {
  usePageTitle("Beneficiaries");

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const initialFilter = {
    project: "",

    status: "",

    provider: "",

    riskLevel: "",
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

  const [editMode, setEditMode] = useState(false);

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
  };

  // download evidence function

  const { exportEvidence, isPending: isDownloadingEvidence } =
    useExportEvidenceMutation();

  const handleDownloadEvidence = () => {
    exportEvidence({ beneficiaryIds: selectedIds });
  };

  // export beneficiaries

  const { exportBeneficiaries, isPending: isExportingBeneficiaries } =
    useExportBeneficiaries();

  const handleExportBeneficiaries = () => {
    exportBeneficiaries({
      beneficiaryIds: selectedIds.length ? selectedIds : [-1],
    });
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "beneficiaries":
        return (
          <BeneficiariesDialogue
            id={beneficiaryId as number}
            editMode={editMode}
            isVisible={modal === "beneficiaries"}
            handleClose={close}
          />
        );

      case "delete":
        return (
          <DeleteDialogue
            id={beneficiaryId as number}
            isVisible={modal === "delete"}
            handleClose={close}
          />
        );

      case "update status":
        return (
          <BulkUpdateStatus
            ids={selectedIds}
            isVisible={modal === "update status"}
            handleClose={close}
          />
        );

      case "import":
        return (
          <ImportDialogue isVisible={modal === "import"} handleClose={close} />
        );

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
  }, [modal, beneficiaryId, selectedIds, editMode, filters]);

  return (
    <>
      {renderModal()}

      <div className="flex h-full flex-col space-y-2.5">
        <div className="flex flex-col items-center gap-2.5 md:flex-row md:justify-between lg:items-start">
          <div className="flex w-full flex-col flex-wrap items-start gap-2.5 lg:w-auto lg:flex-row">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="w-full md:w-auto">
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search beneficiaries"
                  containerClass="w-full lg:max-w-[286px]"
                  onClear={() => setSearch("")}
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModal("filter");
                }}
                className="flex-shrink-0 xl:hidden"
              >
                <img src={filter} alt="filter" />
              </button>
            </div>

            <div className="hidden xl:block">
              <Filters filters={filters} setFilters={setFilters} />
            </div>
          </div>

          <div className="flex w-full flex-shrink-0 grid-cols-1 flex-wrap gap-2.5 md:w-auto">
            {selectedIds.length > 0 && IsAuthorized([Beneficiaries.EXECUTE]) ? (
              <>
                {IsAuthorized([Beneficiaries.UPDATE])}
                <Button
                  onClick={handleDownloadEvidence}
                  buttonType="secondary"
                  disabled={isDownloadingEvidence}
                >
                  Download Evidence
                </Button>
                <Button
                  onClick={handleExportBeneficiaries}
                  buttonType="secondary"
                  disabled={isExportingBeneficiaries}
                >
                  Export CSV
                </Button>
              </>
            ) : (
              <>
                {IsAuthorized([Beneficiaries.EXECUTE]) && (
                  <Button
                    onClick={handleExportBeneficiaries}
                    buttonType="secondary"
                    disabled={isExportingBeneficiaries}
                  >
                    Export CSV
                  </Button>
                )}
                {IsAuthorized([Beneficiaries.IMPORT]) && (
                  <Button
                    eventName="Import Beneficiaries"
                    buttonType="secondary"
                    onClick={() => setModal("import")}
                  >
                    Import beneficiaries
                  </Button>
                )}

                {IsAuthorized([Beneficiaries.CREATE]) && (
                  <Button
                    eventName="Add Beneficiary"
                    onClick={() => {
                      setModal("beneficiaries");

                      setEditMode(true);
                    }}
                  >
                    Add beneficiary
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <BeneficiariesTable
            list={beneficiariesList?.items || []}
            isLoading={isLoading}
            setChecked={setSelectedIds}
          />

          {!!beneficiariesList?.items?.length && (
            <div className="flex w-full items-center justify-end">
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                total={beneficiariesList?.totalSize as number}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BeneficiariesPage;

interface IFilterProps {
  filters: IBeneficiariesFilter;

  setFilters: Dispatch<SetStateAction<IBeneficiariesFilter>>;
}

const Filters = ({ filters, setFilters }: IFilterProps) => {
  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],

    queryFn: () => projectService.list({ listAll: true }),
  });

  const projects: IOption[] = useMemo(
    () =>
      projectsList?.items.map((item) => ({
        label: item.name,

        value: item.id.toString(),
      })) || [],
    [projectsList]
  );

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations"],

    queryFn: () =>
      organizationService.list({
        listAll: true,

        page: 1,

        filters: { type: "provider" },
      }),

    enabled: IsAuthorized([Organizations.LIST]),
  });

  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items.map((item) => ({
        label: item.name,

        value: item.id!.toString(),
      })) || [],

    [organizationList]
  );

  return (
    <div className="grid w-full grid-cols-1 flex-wrap gap-2.5 xl:flex xl:flex-row">
      <Dropdown
        value={findLabelFromOptions(projects, filters.project as string)}
        loading={projectLoading}
        options={projects}
        placeholder="Projects"
        className="xl:w-[166px]"
        handleSelect={(val) =>
          setFilters((prev) => ({ ...prev, project: val as string }))
        }
      />

      <Dropdown
        options={BENEFICIARY_STATUS}
        placeholder="Status"
        className="xl:w-[166px]"
        value={filters.status}
        handleSelect={(val) =>
          setFilters((prev) => ({ ...prev, status: val as string }))
        }
      />

      {IsAuthorized([Organizations.LIST]) && (
        <Dropdown
          loading={orgLoading}
          options={organizations}
          placeholder="Provider"
          className="xl:w-[166px]"
          value={findLabelFromOptions(
            organizations,

            filters.provider as string
          )}
          handleSelect={(val) => {
            setFilters((prev) => ({
              ...prev,
              provider: val as string,
            }));
          }}
        />
      )}

      <div className="flex w-full items-center gap-2.5 xl:w-auto">
        <Dropdown
          options={RISK_LEVEL}
          placeholder="Risk Level"
          className="xl:w-[166px]"
          value={filters.riskLevel}
          handleSelect={(val) =>
            setFilters((prev) => ({
              ...prev,
              riskLevel: val as string,
            }))
          }
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
          className="hidden flex-shrink-0 xl:block"
        >
          <img src={closeFilter} alt="close-filter" />
        </button>
      </div>
    </div>
  );
};
