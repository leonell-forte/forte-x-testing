import Button from "../../components/ui/button";
import Dropdown from "../../components/ui/dropdown";
import Pagination from "../../components/ui/pagination";
import SearchInput from "../../components/ui/search-input";
import Table from "../../components/ui/table";
import { useMemo, useState } from "react";
import pencil from "../../assets/images/icons/pencil.svg";
import { IUser } from "./types";
import UserDialogue from "../../components/Dashboard/Users/Dialogues/UserDialogue";
import { useQuery } from "@tanstack/react-query";
import userService from "../../api/users";
import organizationService from "../../api/organization";
import { IOrganization } from "../Organizations/types";
import { ROLES } from "../../lib/constants";
import { useDebounce } from "../../lib/hooks";
import closeFilter from "../../assets/images/icons/close-filter.svg";

const UsersPage = () => {
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

    queryFn: () => organizationService.list(1, true),
  });

  const [modal, setModal] = useState<"user" | null>(null);

  const [selectedUser, setSelectedUser] = useState<string>("");

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
          userId={selectedUser}
          isVisible={modal === "user"}
          handleClose={() => {
            setSelectedUser("");
            setModal(null);
          }}
          page={page}
        />
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between w-full gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[286px]"
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
            handleSelect={(val) => setRole(val)}
            placeholder="Role"
            className="max-w-[166px]"
            options={ROLES}
          />

          <Dropdown
            loading={orgLoading}
            value={organization}
            handleSelect={(val) => {
              if (organization.includes(val))
                setOrganization((prev) => prev.filter((item) => item !== val));
              else setOrganization((prev) => [...prev, val]);
            }}
            placeholder="Organization"
            className="max-w-[166px]"
            options={organizations.map((item: IOrganization) => ({
              label: item.registeredName,
              value: item.registeredName,
            }))}
            readOnly
            isMultiSelect
          />

          <button onClick={handleRemoveFilters}>
            <img src={closeFilter} alt="close-filter" />
          </button>
        </div>

        <div className="space-y-[18px]">
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
                    <Table.Data>{firstName}</Table.Data>

                    <Table.Data>{lastName}</Table.Data>

                    <Table.Data>{email}</Table.Data>

                    <Table.Data>{phoneNumber}</Table.Data>

                    <Table.Data>
                      <p className="capitalize">{role}</p>
                    </Table.Data>

                    <Table.Data>{organization}</Table.Data>

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

          <div className="flex justify-end absolute bottom-4 right-2">
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
