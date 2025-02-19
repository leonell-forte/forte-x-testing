import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useMemo, useState } from "react";

import { IsAuthorized, Users } from "lib/role-permissions";
import { IUser } from "lib/types/users";

import UserDialogue from "components/Dashboard/Users/Dialogues/UserDialogue";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TUsersTable = {
  list: IUser[];
  isLoading?: boolean;
};

const UsersTable = ({ list, isLoading = false }: TUsersTable) => {
  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],

    queryFn: () => organizationService.list({ page: 1, listAll: true }),
  });

  const [modal, setModal] = useState<"user" | null>(null);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const organizations = useMemo(
    () => organizationList?.items || [],

    [organizationList]
  );

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

      <div className="table-breakpoint:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((item, index) => {
            const {
              firstName,
              lastName,
              email,
              phoneNumber,
              role,
              organization,
              status,
            } = item;

            const formattedRole = (role?.split(".")?.[1] || role)
              ?.split("-")
              .join(" ");

            return (
              <Cards.Card
                title={`${firstName} ${lastName}`}
                onClick={
                  IsAuthorized([Users.UPDATE])
                    ? (e) => {
                        e.stopPropagation();
                        handleEditUser(item);
                      }
                    : undefined
                }
                key={index}
              >
                <Cards.Group cols={2}>
                  <Cards.Details label="Email" value={email} />
                  <Cards.Details label="Phone number" value={phoneNumber} />
                  <Cards.Details
                    label="Role"
                    value={formattedRole}
                    capitalize
                  />
                  <Cards.Details label="Status" value={status} capitalize />
                  <Cards.Details label="Organization" value={organization} />
                </Cards.Group>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden table-breakpoint:block">
        <Table.Container isEmpty={!list.length} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list.map((item: IUser, bodyIndex: number) => {
              const {
                firstName,
                lastName,
                email,
                phoneNumber,
                role,
                organization,
                status,
              } = item;

              const formattedRole = (role?.split(".")?.[1] || role)
                ?.split("-")
                .join(" ");

              return (
                <Table.Row
                  onClick={
                    IsAuthorized([Users.UPDATE])
                      ? (e) => {
                          e.stopPropagation();
                          handleEditUser(item);
                        }
                      : undefined
                  }
                  key={bodyIndex}
                >
                  <Table.Data className="w-[140px]">{firstName}</Table.Data>

                  <Table.Data className="w-[140px]">{lastName}</Table.Data>

                  <Table.Data className="w-[200px]">{email}</Table.Data>

                  <Table.Data className="w-[100px]">{phoneNumber}</Table.Data>

                  <Table.Data className="w-[80px] capitalize">
                    {formattedRole}
                  </Table.Data>

                  <Table.Data className="w-[80px] capitalize">
                    {status}
                  </Table.Data>

                  <Table.Data>{organization}</Table.Data>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
      </div>
    </>
  );
};

export default UsersTable;

const TABLE_HEADER = [
  "First name",
  "Last name",
  "Email",
  "Phone",
  "Role",
  "Status",
  "Organization",
];
