import Dropdown from "../../components/ui/dropdown";
import Button from "../../components/ui/button";
import SearchInput from "../../components/ui/search-input";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import organizationService from "../../api/organization";
import Table from "../../components/ui/table";
import pencil from "../../assets/images/icons/pencil.svg";
import Spinner from "../../components/ui/spinner/spinner";
import { IFilters, IOrganization } from "./types";
import Pagination from "../../components/ui/pagination";
import OrganizationDialogue from "../../components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import { REGIONS, STATUS, TYPES } from "../../lib/constants";
import { useDebounce } from "../../lib/hooks";

const OrganizationsPage = () => {
  const [modal, setModal] = useState<"org" | null>(null);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [selectedOrg, setSelectedOrg] = useState("");

  const [filters, setFilters] = useState<IFilters>({
    region: "",
    status: "",
    type: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    search
  );

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations", page, debouncedSearch],
    queryFn: () => organizationService.list(page, false, debouncedSearch),
  });

  const organizations = useMemo(
    () => organizationList?.items || [],
    [organizationList]
  );

  const close = () => {
    setSelectedOrg("");
    setModal(null);
  };

  const handleEditOrg = (id: string) => {
    setModal("org");
    setSelectedOrg(id);
  };

  const handleSelectFilter = (key: keyof IFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {modal === "org" && (
        <OrganizationDialogue
          orgId={selectedOrg}
          isVisible={modal === "org"}
          handleClose={close}
          page={page}
        />
      )}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between w-full gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!w-[286px]"
            placeholder="Search organizations"
          />

          <div className="flex items-center gap-6">
            <Button
              eventName="Add User"
              onClick={() => {
                setModal("org");
              }}
            >
              Add Organization
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-[18px]">
          <p className="text-[20px] font-medium">Filter by</p>
          <Dropdown
            value={filters.region}
            handleSelect={(val) => {
              handleSelectFilter("region", val);
            }}
            placeholder="Region"
            className="max-w-[166px]"
            options={REGIONS}
          />
          <Dropdown
            value={filters.status}
            handleSelect={(val) => {
              handleSelectFilter("status", val);
            }}
            placeholder="Status"
            className="max-w-[166px]"
            options={STATUS}
          />
          <Dropdown
            value={filters.type}
            handleSelect={(val) => {
              handleSelectFilter("type", val);
            }}
            placeholder="Type"
            className="max-w-[166px]"
            options={TYPES}
          />
        </div>

        <div className="space-y-[18px]">
          {orgLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Table.Container>
              <Table.Head>
                <Table.Row>
                  {TABLE_HEADER.map((key, headerIndex) => {
                    return <Table.Header key={headerIndex}>{key}</Table.Header>;
                  })}
                  <Table.Header></Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {organizations.map((item: IOrganization, bodyIndex: number) => {
                  const {
                    id,
                    name,
                    registeredName,
                    region,
                    type,
                    status,
                    registeredAddress,
                    registrationNumber,
                    noOfProjects,
                    noOfUsers,
                  } = item;
                  return (
                    <Table.Row key={bodyIndex}>
                      <Table.Data>{name}</Table.Data>
                      <Table.Data>{registeredName}</Table.Data>
                      <Table.Data>{registeredAddress}</Table.Data>
                      <Table.Data>{registrationNumber}</Table.Data>
                      <Table.Data>{region}</Table.Data>
                      <Table.Data>{type}</Table.Data>
                      <Table.Data>{status}</Table.Data>
                      <Table.Data>{noOfUsers}</Table.Data>
                      <Table.Data>{noOfProjects}</Table.Data>
                      <Table.Data>-</Table.Data>

                      <Table.Data>
                        <Button
                          eventName="Edit User"
                          id={id}
                          buttonType="default"
                          type="button"
                          onClick={() => handleEditOrg(id!)}
                          className="p-[3px]"
                        >
                          <img alt="pencil" src={pencil} />
                        </Button>
                      </Table.Data>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Container>
          )}

          <div className="flex justify-end absolute bottom-4 right-2">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={organizationList?.totalSize}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationsPage;

const TABLE_HEADER = [
  "Organization",
  "Registered Name",
  "Registered Address",
  "Registration",
  "Region",
  "Type",
  "Status",
  "Users",
  "Projects",
  "Contracts",
];
