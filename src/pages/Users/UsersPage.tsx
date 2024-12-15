import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import userService from "api/users";
import { useMemo, useState } from "react";

import closeFilter from "assets/images/icons/close-filter.svg";
import pencil from "assets/images/icons/pencil.svg";

import { ROLES } from "lib/constants";
import { useDebounce, usePageTitle } from "lib/hooks";
import { IOrganization } from "lib/types/organizations";
import { IUser } from "lib/types/users";

import UserDialogue from "components/Dashboard/Users/Dialogues/UserDialogue";
import Button from "components/ui/button";
import Dropdown from "components/ui/dropdown";
import HorizontalScroller from "components/ui/horizontal-scroller";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";
import Table from "components/ui/table";

const UsersPage = () => {
  usePageTitle("Users");

  const [page, setPage] = useState(1);

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

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user.id!.toString());

    setModal("user");
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
        <div className="flex w-full items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[286px]"
            onClear={() => setSearch("")}
          />

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
        </div>

        <div className="flex items-center gap-[18px]">
          <p className="text-[20px] font-medium">Filter by</p>

          <Dropdown
            value={role}
            handleSelect={(val) => setRole(val as string)}
            placeholder="Role"
            className="max-w-[166px]"
            options={ROLES}
            noHelperText
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
            noHelperText
          />

          <button onClick={handleRemoveFilters}>
            <img src={closeFilter} alt="close-filter" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="overflow-scroll pr-4">
            <Table.Container isEmpty={!users.length} isLoading={userLoading}>
              <Table.Head>
                <Table.Row>
                  {TABLE_HEADER.map((key, headerIndex) => {
                    return <Table.Header key={headerIndex}>{key}</Table.Header>;
                  })}

                  <Table.Header></Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {users.map((item: IUser, bodyIndex: number) => {
                  const {
                    id,
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    role,
                    organization,
                  } = item;

                  return (
                    <Table.Row key={bodyIndex}>
                      <Table.Data>
                        <p className="w-[120px] truncate">{firstName}</p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[120px] truncate">{lastName}</p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[190px] truncate">{email}</p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[150px] truncate">{phoneNumber}</p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[80px] truncate capitalize">{role}</p>
                      </Table.Data>

                      <Table.Data>
                        <p className="w-[150px] truncate">{organization}</p>
                      </Table.Data>

                      <Table.Data>
                        <div className="flex justify-end">
                          <Button
                            eventName="Edit User"
                            id={id}
                            buttonType="default"
                            type="button"
                            onClick={() => handleEditUser(item)}
                            className="p-[3px]"
                          >
                            <img alt="pencil" src={pencil} />
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
            <HorizontalScroller />

            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={userList?.totalSize}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;

const TABLE_HEADER = [
  "First name",
  "Last name",
  "Email",
  "Phone",
  "Role",
  "Organization",
];
