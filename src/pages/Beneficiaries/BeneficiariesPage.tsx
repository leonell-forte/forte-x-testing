import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import organizationService from "api/organization";
import projectService from "api/projects";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import bin from "assets/images/icons/bin.svg";
import closeFilter from "assets/images/icons/close-filter.svg";
import pencil from "assets/images/icons/pencil.svg";

import {
  BENEFICIARY_STATUS,
  DEFAULT_DATE_FORMAT,
  RISK_LEVEL,
} from "lib/constants";
import { useDebounce, usePageTitle } from "lib/hooks";
import { useExportEvidenceMutation } from "lib/mutations/beneficiaries";
import { IBeneficiariesFilter } from "lib/types/beneficiaries";
import { findLabelFromOptions, formatDate } from "lib/utils";

import BeneficiariesDialogue from "components/Dashboard/Beneficiaries/Dialogues/BeneficiariesDialogue";
import BulkUpdateStatus from "components/Dashboard/Beneficiaries/Dialogues/BulkUpdateStatus";
import DeleteDialogue from "components/Dashboard/Beneficiaries/Dialogues/DeleteDialogue";
import ImportDialogue from "components/Dashboard/Beneficiaries/Dialogues/ImportDialogue";
import Button from "components/ui/button";
import Checkbox from "components/ui/checkbox";
// import DatePicker from "components/ui/date-picker";
import Dropdown, { IOption } from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";
import Table from "components/ui/table";

type ModalLabelTypes =
  | "beneficiaries"
  | "delete"
  | "import"
  | "update status"
  | "";

const BeneficiariesPage = () => {
  usePageTitle("Beneficiaries");

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState<IBeneficiariesFilter>({
    project: "",

    status: "",

    provider: "",

    riskLevel: "",

    // startDate: "",
  });

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search]
  );

  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<ModalLabelTypes>("");

  const [editMode, setEditMode] = useState(false);

  const [beneficiaryId, setBeneficiaryId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: beneficiariesList, isLoading } = useQuery({
    queryKey: ["beneficiaries", debouncedSearch, page, filters],

    queryFn: () =>
      beneficiariesService.list({ search: debouncedSearch, page, filters }),
  });

  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],

    queryFn: () => projectService.list({ listAll: true }),
  });

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations"],

    queryFn: () =>
      organizationService.list({
        listAll: true,

        page: 1,

        filters: { type: "provider" },
      }),
  });

  const projects: IOption[] = useMemo(
    () =>
      projectsList?.items.map((item) => ({
        label: item.name,

        value: item.id.toString(),
      })) || [],
    [projectsList]
  );

  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items.map((item) => ({
        label: item.name,

        value: item.id!.toString(),
      })) || [],

    [organizationList]
  );

  const close = () => {
    setModal("");

    setBeneficiaryId(null);

    setSelectedIds([]);
  };

  const handleDelete = (id: number) => {
    setModal("delete");

    setBeneficiaryId(id);
  };

  // download evidence function

  const { exportEvidence, isPending: isDownloadingEvidence } =
    useExportEvidenceMutation();

  const handleDownloadEvidence = () => {
    exportEvidence({ beneficiaryIds: selectedIds });
  };

  const handleSelectAll = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedIds((beneficiariesList?.items || []).map((item) => item.id));
      } else setSelectedIds([]);
    },

    [beneficiariesList]
  );

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
    }
  }, [modal, beneficiaryId, selectedIds, editMode]);

  return (
    <>
      {renderModal()}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beneficiaries"
            className="max-w-[286px]"
            onClear={() => setSearch("")}
          />

          <div className="space-x-2.5">
            {selectedIds.length > 0 ? (
              <>
                <Button
                  onClick={() => setModal("update status")}
                  buttonType="secondary"
                  eventName="Update Beneficiary Status"
                >
                  Update status
                </Button>
                <Button
                  onClick={handleDownloadEvidence}
                  buttonType="secondary"
                  disabled={isDownloadingEvidence}
                >
                  Download Evidence
                </Button>
              </>
            ) : (
              <>
                <Button
                  eventName="Import Beneficiaries"
                  buttonType="secondary"
                  onClick={() => setModal("import")}
                >
                  Import beneficiaries
                </Button>
                <Button
                  eventName="Add Beneficiary"
                  onClick={() => {
                    setModal("beneficiaries");

                    setEditMode(true);
                  }}
                >
                  Add beneficiaries
                </Button>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <p className="flex-shrink-0 text-[20px] font-medium">Filter by</p>

            <Dropdown
              noHelperText
              value={findLabelFromOptions(projects, filters.project as string)}
              loading={projectLoading}
              options={projects}
              placeholder="Projects"
              className="max-w-[166px]"
              handleSelect={(val) =>
                setFilters((prev) => ({ ...prev, project: val as string }))
              }
            />

            <Dropdown
              noHelperText
              options={BENEFICIARY_STATUS}
              placeholder="Status"
              className="max-w-[166px]"
              value={filters.status}
              handleSelect={(val) =>
                setFilters((prev) => ({ ...prev, status: val as string }))
              }
            />

            <Dropdown
              noHelperText
              loading={orgLoading}
              options={organizations}
              placeholder="Provider"
              className="max-w-[166px]"
              value={findLabelFromOptions(
                organizations,

                filters.provider as string
              )}
              handleSelect={(val) => {
                setFilters((prev) => ({ ...prev, provider: val as string }));
              }}
            />

            <Dropdown
              noHelperText
              options={RISK_LEVEL}
              placeholder="Risk Level"
              className="max-w-[166px]"
              value={filters.riskLevel}
              handleSelect={(val) =>
                setFilters((prev) => ({ ...prev, riskLevel: val as string }))
              }
            />

            {/* <Dropdown
              noHelperText
              options={[]}
              placeholder="Program"
              className="max-w-[166px]"
            /> */}

            {/* removing for now
            <div className="max-w-[166px]">
              <DatePicker
                noHelperText
                value={new Date(filters.startDate as string)}
                onChange={(date) => {
                  setFilters((prev) => ({
                    ...prev,

                    startDate: formatDate(date as Date, "yyyy-LL-dd"),
                  }));
                }}
              />
            </div> */}

            <button
              onClick={() =>
                setFilters({
                  project: "",

                  status: "",

                  provider: "",

                  riskLevel: "",
                })
              }
              className="flex-shrink-0"
            >
              <img src={closeFilter} alt="close-filter" />
            </button>
          </div>
        </div>

        <div className="space-y-[18px] overflow-scroll">
          <div className="pr-4">
            <Table.Container
              isLoading={isLoading}
              isEmpty={!beneficiariesList?.items?.length}
            >
              <Table.Head>
                <Table.Row>
                  <Table.Header small>
                    <Checkbox
                      checked={
                        beneficiariesList?.items?.length !== 0 &&
                        selectedIds.length === beneficiariesList?.items.length
                      }
                      label="First name"
                      labelClass="!text-black text-[14px]"
                      onChange={handleSelectAll}
                    />
                  </Table.Header>

                  <Table.Header>Last name</Table.Header>

                  <Table.Header>Provider</Table.Header>

                  <Table.Header>Email</Table.Header>

                  <Table.Header>Phone number</Table.Header>

                  <Table.Header>Contract</Table.Header>

                  <Table.Header>Program</Table.Header>

                  <Table.Header>Risk level</Table.Header>

                  <Table.Header>Status</Table.Header>

                  <Table.Header>Cohort start date</Table.Header>

                  <Table.Header>Cohort end date</Table.Header>

                  <Table.Header></Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {beneficiariesList?.items?.map((item, index) => {
                  const {
                    firstName,

                    lastName,

                    provider,

                    email,

                    contractId,

                    id,

                    cohortEndDate,

                    cohortName,

                    cohortStartDate,

                    riskLevel,

                    status,

                    phone,
                  } = item;

                  return (
                    <Table.Row key={index}>
                      <Table.Data>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            labelClass="text-[14px]"
                            checked={selectedIds.includes(id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, id]);
                              } else
                                setSelectedIds((prev) =>
                                  prev.filter((item) => item !== id)
                                );
                            }}
                          />
                          <button
                            onClick={() => {
                              setBeneficiaryId(id);

                              setModal("beneficiaries");

                              setEditMode(false);
                            }}
                            className="translate-x-[-8px] outline-none"
                          >
                            {firstName}
                          </button>
                        </div>
                      </Table.Data>

                      <Table.Data>{lastName}</Table.Data>

                      <Table.Data>{provider}</Table.Data>

                      <Table.Data>{email}</Table.Data>

                      <Table.Data>{phone}</Table.Data>

                      <Table.Data>Contract {contractId}</Table.Data>

                      <Table.Data>{cohortName}</Table.Data>

                      <Table.Data className="capitalize">
                        {riskLevel}
                      </Table.Data>

                      <Table.Data className="capitalize">{status}</Table.Data>

                      <Table.Data>
                        {formatDate(cohortStartDate, DEFAULT_DATE_FORMAT)}
                      </Table.Data>

                      <Table.Data>
                        {formatDate(cohortEndDate, DEFAULT_DATE_FORMAT)}
                      </Table.Data>

                      <Table.Data>
                        <div className="flex justify-end">
                          <Button
                            eventName="Update Beneficiary"
                            id={id.toString()}
                            buttonType="default"
                            type="button"
                            className="p-[3px]"
                            onClick={() => {
                              setModal("beneficiaries");

                              setBeneficiaryId(id);

                              setEditMode(true);
                            }}
                          >
                            <img alt="pencil" src={pencil} />
                          </Button>

                          <Button
                            eventName="Delete Beneficiary"
                            id={id.toString()}
                            buttonType="default"
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="p-[3px]"
                          >
                            <img alt="pencil" src={bin} />
                          </Button>
                        </div>
                      </Table.Data>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Container>
          </div>

          <div className="flex w-full items-center justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={beneficiariesList?.totalSize as number}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BeneficiariesPage;
