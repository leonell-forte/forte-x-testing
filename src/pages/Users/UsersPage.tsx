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
import Loader from "../../components/ui/Loader/loader";

const UsersPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => userService.list(page),
  });

  const [modal, setModal] = useState<"user" | null>(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const users = useMemo(() => data?.data.items || [], [data]);

  // const filteredList: IUser[] = useMemo(() => {
  //   return filterBySearch(users as any, search);
  // }, [search]);

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setModal("user");
  };

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <>
      <UserDialogue
        user={selectedUser}
        isVisible={modal === "user"}
        handleClose={() => setModal(null)}
      />
      <div className="space-y-1.5">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-[18px]">
            <p className="text-[20px]">Filter by</p>
            <Dropdown
              placeholder="Select filter"
              className="max-w-[211px]"
              options={filters}
            />
          </div>

          <div className="flex items-center gap-6">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[286px]"
            />
            <Button eventName="Add User" onClick={() => setModal("user")}>
              Add User
            </Button>
          </div>
        </div>
        <div className="space-y-[18px]">
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
                    <Table.Data>{`${firstName} ${lastName}`}</Table.Data>
                    <Table.Data>{email}</Table.Data>
                    <Table.Data>{phoneNumber}</Table.Data>
                    <Table.Data>{role}</Table.Data>
                    <Table.Data>{organization}</Table.Data>
                    <Table.Data>
                      <Button
                        eventName="Edit User"
                        id={id.toString()}
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

          <div className="flex justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={users.length}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;

const filters = [
  {
    label: "Test",
    value: "test",
  },
];

const TABLE_HEADER = [
  "User’s full name",
  "Email",
  "Phone",
  "Role",
  "Organization",
];
