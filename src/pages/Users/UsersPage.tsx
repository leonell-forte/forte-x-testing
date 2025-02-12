import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import userService from "api/users";
import { useMemo, useState } from "react";

import closeFilter from "assets/images/icons/close-filter.svg";

import { ROLES } from "lib/constants";
import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import { IsAuthorized, Users } from "lib/role-permissions";
import { IOrganization } from "lib/types/organizations";
import { IUser } from "lib/types/users";

import UserDialogue from "components/Dashboard/Users/Dialogues/UserDialogue";
import UsersTable from "components/tables/Users";
import Button from "components/ui/button";
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

  const [modal, setModal] = useState<"user" | null>(null);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const users: IUser[] = useMemo(() => userList?.items || [], [userList]);

  const organizations = useMemo(
    () => organizationList?.items || [],

    [organizationList]
  );

  const handleRemoveFilters = () => {
    setRole("");

    setOrganization([]);
  };

  return (
    <>
      {modal === "user" && (
        <UserDialogue
          organizations={organizations}
          userId={selectedUser!}
          isVisible={modal === "user"}
          handleClose={() => {
            setSelectedUser(null);
            setModal(null);
          }}
        />
      )}

      <div className="space-y-2.5">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[286px]"
            onClear={() => setSearch("")}
          />

          {IsAuthorized([Users.CREATE]) && (
            <div className="flex items-center gap-6">
              <Button
                eventName="Add User"
                onClick={() => {
                  setModal("user");
                }}
              >
                Add user
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-[18px]">
          <p className="text-[20px] font-medium">Filter by</p>

          <Dropdown
            value={role}
            handleSelect={(val) => setRole(val as string)}
            placeholder="Role"
            className="max-w-[166px]"
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
            className="max-w-[166px]"
            options={organizations.map((item: IOrganization) => ({
              label: item.name,
              value: item.name,
            }))}
            readOnly
            isMultiSelect
          />

          <button onClick={handleRemoveFilters}>
            <img src={closeFilter} alt="close-filter" />
          </button>
        </div>

        <div className="space-y-4">
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
