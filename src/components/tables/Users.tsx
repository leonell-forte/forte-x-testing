import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useCallback, useMemo, useState } from "react";

import pencil from "assets/images/icons/pencil.svg";

import { useProfile } from "lib/hooks";
import { IsAuthorized, Users } from "lib/role-permissions";
import { IUser } from "lib/types/users";

import UserDialogue from "components/Dashboard/Users/Dialogues/UserDialogue";
import Button from "components/ui/button";
import Table from "components/ui/table";

type TUsersTable = {
  list: IUser[];
  isLoading?: boolean;
};

const UsersTable = ({ list, isLoading = false }: TUsersTable) => {
  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],

    queryFn: () => organizationService.list({ page: 1, listAll: true }),
  });

  const profile = useProfile();

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

  const showEdit = useCallback(
    (id: string) => {
      if (!profile?.role?.includes("user")) {
        return IsAuthorized([Users.UPDATE]);
      }
      if (
        profile?.role?.includes("user") &&
        IsAuthorized([Users.UPDATE]) &&
        String(profile.id) === id
      ) {
        return true;
      }
    },
    [profile]
  );

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

      <div className="pr-4">
        <Table.Container isEmpty={!list.length} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return (
                  <Table.Header className="h-[64px]" key={headerIndex}>
                    {key}
                  </Table.Header>
                );
              })}

              <Table.Header className="h-[64px]"></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list.map((item: IUser, bodyIndex: number) => {
              const {
                id,
                firstName,
                lastName,
                email,
                phoneNumber,
                role,
                organization,
              } = item;

              const formattedRole = (role?.split(".")?.[1] || role)
                ?.split("-")
                .join(" ");

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
                    <p className="w-[80px] truncate capitalize">
                      {formattedRole}
                    </p>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[150px] truncate">{organization}</p>
                  </Table.Data>

                  <Table.Data>
                    {showEdit(String(id)) && (
                      <div className="flex justify-end">
                        <Button
                          eventName="Edit User"
                          id={String(id)}
                          buttonType="default"
                          type="button"
                          onClick={() => handleEditUser(item)}
                          className="p-[3px]"
                        >
                          <img alt="pencil" src={pencil} />
                        </Button>
                      </div>
                    )}
                  </Table.Data>
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
  "Organization",
];
