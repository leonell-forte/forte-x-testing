import Button from "../../components/ui/button";
import Dropdown from "../../components/ui/dropdown";
import Pagination from "../../components/ui/pagination";
import SearchInput from "../../components/ui/search-input";
import Table from "../../components/ui/table";
import { useMemo, useState } from "react";
import pencil from "../../assets/images/icons/pencil.svg";
import { IUser } from "./types";
import UserDialogue from "../../components/Dashboard/Users/Dialogues/UserDialogue";
// import { filterBySearch } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import userService from "../../api/users";
import Spinner from "../../components/ui/spinner/spinner";
import organizationService from "../../api/organization";
import { IOrganization } from "../Organizations/types";
import { ROLES } from "../../lib/constants";

const UsersPage = () => {
  const [page, setPage] = useState(1);

  const { data: userList, isLoading: userLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => userService.list(page),
  });

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.list(page, true),
  });

  const [modal, setModal] = useState<"user" | null>(null);

  const [role, setRole] = useState("");

  const [organization, setOrganization] = useState<string[]>([]);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<string>("");

  const users = useMemo(() => userList?.items || [], [userList]);

  const organizations = useMemo(
    () => organizationList?.items || [],
    [organizationList]
  );

  // const filteredList: IUser[] = useMemo(() => {
  //   return filterBySearch(users as any, search);
  // }, [search]);

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
              Add User
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
              value: item.id,
            }))}
            readOnly
            isArray
          />
        </div>
        <div className="space-y-[18px]">
          {userLoading ? (
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
                        {`${firstName} ${lastName}`} {id}
                      </Table.Data>
                      <Table.Data>{email}</Table.Data>
                      <Table.Data>{phoneNumber}</Table.Data>
                      <Table.Data>{role}</Table.Data>
                      <Table.Data>{organization}</Table.Data>
                      <Table.Data>
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
  "User’s full name",
  "Email",
  "Phone",
  "Role",
  "Organization",
];
