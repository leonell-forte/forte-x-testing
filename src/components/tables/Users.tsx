import { useCallback, useState } from "react";
import { FaTrash as Trash } from "react-icons/fa6";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import { IsAuthorized, Users } from "lib/role-permissions";
import { IUser } from "lib/types/users";

import DeleteDialogue from "components/Dashboard/Users/Dialogues/DeleteDialogue";
import UserDialogue from "components/Dashboard/Users/Dialogues/UserDialogue";
import Button from "components/ui/button";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TUsersTable = {
  list: IUser[];
  isLoading?: boolean;
};

const UsersTable = ({ list, isLoading = false }: TUsersTable) => {
  const { rawList: organizations } = useOrganizationList({
    listAll: true,
  });

  const [modal, setModal] = useState<"user" | "delete" | null>(null);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user.id!.toString());

    setModal("user");
  };

  const handleDelete = (id: string) => {
    setModal("delete");
    setSelectedUser(id);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "user":
        return (
          <UserDialogue
            organizations={organizations?.items || []}
            userId={selectedUser!}
            isVisible={modal === "user"}
            handleClose={() => {
              setSelectedUser(null);
              setModal(null);
            }}
          />
        );

      case "delete":
        return (
          <DeleteDialogue
            isVisible
            id={selectedUser!}
            handleClose={() => {
              setModal(null);
              setSelectedUser(null);
            }}
          />
        );
    }
  }, [modal, selectedUser, organizations]);

  return (
    <>
      {renderModal()}

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
              id,
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

                <div className="absolute bottom-3 right-0">
                  {IsAuthorized([Users.DELETE]) && (
                    <div className="flex justify-end">
                      <Button
                        eventName="Delete Beneficiary"
                        id={id?.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => {
                          handleDelete(id!);
                        }}
                        className="group"
                      >
                        <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />
                      </Button>
                    </div>
                  )}
                </div>
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
                id,
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
                  <Table.Data className="ml-auto w-[50px]">
                    {IsAuthorized([Users.DELETE]) && (
                      <div className="flex justify-end">
                        <Button
                          eventName="Delete Beneficiary"
                          id={id?.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => {
                            handleDelete(id!);
                          }}
                          className="group"
                        >
                          <Trash className="h-auto w-5 transition-all group-hover:fill-mint" />
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
  "Status",
  "Organization",
  "",
];
