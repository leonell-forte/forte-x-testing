import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import userService from "api/users";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { BiSlider as SliderIcon } from "react-icons/bi";
import { TbFilterX as FilterIcon } from "react-icons/tb";

import { ROLES } from "lib/constants";
import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import { IsAuthorized, Users } from "lib/role-permissions";
import { IOrganization } from "lib/types/organizations";
import { IUser } from "lib/types/users";

import UserDialogue from "components/Dashboard/Users/Dialogues/UserDialogue";
import UsersTable from "components/tables/Users";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

const UsersPage = () => {
  usePageTitle("Users");

  const { page, setPage } = usePage();

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [organization, setOrganization] = useState<string[]>([]);

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search]
  );

  const { data: userList, isLoading: userLoading } = useQuery({
    queryKey: ["users", page, debouncedSearch, role, organization],

    queryFn: () => userService.list(page, debouncedSearch, role, organization),
  });

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations"],

    queryFn: () => organizationService.list({ page: 1, listAll: true }),
  });

  const [modal, setModal] = useState<"user" | "filter" | null>(null);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const users: IUser[] = useMemo(() => userList?.items || [], [userList]);

  const organizations = useMemo(
    () => organizationList?.items || [],

    [organizationList]
  );

  const close = () => {
    setSelectedUser(null);
    setModal(null);

    setPage(1);
  };

  const handleRemoveFilters = () => {
    setRole("");

    setOrganization([]);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "user":
        return (
          <UserDialogue
            organizations={organizations}
            userId={selectedUser!}
            isVisible={modal === "user"}
            handleClose={close}
          />
        );

      case "filter":
        return (
          <Dialogue
            title="Filters"
            isVisible={modal === "filter"}
            handleClose={close}
          >
            <div className="space-y-6">
              <Filters
                organization={organization}
                setOrganization={setOrganization}
                role={role}
                setRole={setRole}
                organizations={organizations}
                orgLoading={orgLoading}
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
                  <Button onClick={close}>Apply</Button>
                </div>
              </div>
            </div>
          </Dialogue>
        );
    }
    // eslint-disable-next-line
  }, [modal, orgLoading, organization, organizations, role, selectedUser]);

  return (
    <>
      {renderModal()}

      <div className="flex h-full flex-col space-y-2.5">
        <div className="flex flex-col justify-between gap-2.5 sm:flex-row">
          <div className="flex flex-col flex-wrap gap-2.5 sm:flex-row">
            <div className="flex gap-2">
              <div className="w-full md:w-auto">
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="md:w-[286px]"
                  onClear={() => setSearch("")}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModal("filter");
                }}
                className="group flex-shrink-0 md:hidden"
              >
                <SliderIcon className="h-auto w-6 transition-all group-hover:fill-mint" />
              </button>
            </div>

            <div className="hidden md:block">
              <Filters
                organization={organization}
                setOrganization={setOrganization}
                role={role}
                setRole={setRole}
                organizations={organizations}
                orgLoading={orgLoading}
                handleRemoveFilters={handleRemoveFilters}
              />
            </div>
          </div>

          {IsAuthorized([Users.CREATE]) && (
            <Button
              eventName="Add User"
              onClick={() => {
                setModal("user");
              }}
            >
              Add user
            </Button>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <UsersTable list={users} isLoading={userLoading} />

          {!!users.length && (
            <div className="flex w-full items-center justify-end">
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                total={userList?.totalSize as number}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersPage;

interface IFilterProps {
  organization: string[];
  setOrganization: Dispatch<SetStateAction<string[]>>;
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
  organizations: IOrganization[];
  orgLoading?: boolean;
  handleRemoveFilters: () => void;
}

const Filters = ({
  organization,
  setOrganization,
  role,
  setRole,
  organizations,
  orgLoading,
  handleRemoveFilters,
}: IFilterProps) => {
  return (
    <div className="flex flex-col gap-2.5 md:flex-row">
      <Dropdown
        value={role}
        handleSelect={(val) => setRole(val as string)}
        placeholder="Role"
        className="md:w-[166px]"
        options={ROLES}
      />

      <Dropdown
        enableSearch
        loading={orgLoading}
        value={organization}
        handleSelect={(val) => {
          setOrganization(val as string[]);
        }}
        placeholder="Organization"
        className="md:w-[166px]"
        options={organizations
          .map((item: IOrganization) => ({
            label: item.name,
            value: item.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))}
        isMultiSelect
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
