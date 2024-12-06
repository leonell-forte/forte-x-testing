import Dropdown, { IOption } from "../../components/ui/dropdown";
import Button from "../../components/ui/button";
import SearchInput from "../../components/ui/search-input";
import { useCallback, useMemo, useState } from "react";
import closeFilter from "../../assets/images/icons/close-filter.svg";
import Table from "../../components/ui/table";
import Checkbox from "../../components/ui/checkbox";
import Pagination from "../../components/ui/pagination";
import pencil from "../../assets/images/icons/pencil.svg";
import bin from "../../assets/images/icons/bin.svg";
import BeneficiariesDialogue from "../../components/Dashboard/Beneficiaries/Dialogues/BeneficiariesDialogue";
import DeleteDialogue from "../../components/Dashboard/Beneficiaries/Dialogues/DeleteDialogue";
import ImportDialogue from "../../components/Dashboard/Beneficiaries/Dialogues/ImportDialogue";
import DatePicker from "../../components/ui/date-picker";
import { useDebounce, usePageTitle } from "../../lib/hooks";
import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "../../api/beneficiaries";
import HorizontalScroller from "../../components/ui/horizontal-scroller";
import { findLabelFromOptions, formatDate } from "../../lib/utils";
import projectService from "../../api/projects";
import {
  BENEFICIARY_STATUS,
  DEFAULT_DATE_FORMAT,
  RISK_LEVEL,
} from "../../lib/constants";
import organizationService from "../../api/organization";
import { IBeneficiariesFilter } from "@/lib/types/beneficiaries";

const BeneficiariesPage = () => {
  usePageTitle("Beneficiaries");

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState<IBeneficiariesFilter>({
    project: "",
  });

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search],
  );

  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<
    "beneficiaries" | "delete" | "import" | ""
  >("");

  const [beneficiaryId, setBeneficiaryId] = useState<number | null>(null);

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
    [projectsList],
  );

  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items.map((item) => ({
        label: item.name,

        value: item.id!.toString(),
      })) || [],

    [organizationList],
  );

  const close = () => {
    setModal("");

    setBeneficiaryId(null);
  };

  const handleDelete = (id: number) => {
    setModal("delete");

    setBeneficiaryId(id);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "beneficiaries":
        return (
          <BeneficiariesDialogue
            id={beneficiaryId as number}
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

      case "import":
        return (
          <ImportDialogue
            isVisible={modal === "import"}
            handleClose={close}
          />
        );
    }
  }, [modal, beneficiaryId]);

  return (
    <>
      {renderModal()}

      <div className="space-y-2.5">
        <div className="flex justify-between items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beneficiaries"
            className="max-w-[286px]"
            onClear={() => setSearch("")}
          />

          <div className="space-x-2.5">
            <Button
              eventName="Import Beneficiaries"
              buttonType="secondary"
              onClick={() => setModal("import")}
            >
              Import beneficiaries
            </Button>

            <Button
              eventName="Add Beneficiary"
              onClick={() => setModal("beneficiaries")}
            >
              Add beneficiaries
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-[20px] font-medium flex-shrink-0">Filter by</p>

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
              handleSelect={() => {}}
            />

            <Dropdown
              noHelperText
              loading={orgLoading}
              options={organizations}
              placeholder="Provider"
              className="max-w-[166px]"
              handleSelect={() => {}}
            />

            <Dropdown
              noHelperText
              options={RISK_LEVEL}
              placeholder="Risk Level"
              className="max-w-[166px]"
              handleSelect={() => {}}
            />

            {/* <Dropdown
              noHelperText
              options={[]}
              placeholder="Program"
              className="max-w-[166px]"
            /> */}

            <div className="max-w-[166px]">
              <DatePicker noHelperText />
            </div>

            <button
              onClick={() => {}}
              className="flex-shrink-0"
            >
              <img
                src={closeFilter}
                alt="close-filter"
              />
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
                      label="First name"
                      labelClass="!text-black text-[14px]"
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
                        <Checkbox
                          label={firstName}
                          labelClass="text-[14px]"
                        />
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
                            }}
                          >
                            <img
                              alt="pencil"
                              src={pencil}
                            />
                          </Button>

                          <Button
                            eventName="Delete Beneficiary"
                            id={id.toString()}
                            buttonType="default"
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="p-[3px]"
                          >
                            <img
                              alt="pencil"
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
              total={beneficiariesList?.totalSize as number}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BeneficiariesPage;
