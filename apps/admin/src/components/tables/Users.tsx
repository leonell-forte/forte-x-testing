import { useCallback, useState } from "react";
import { FaTrash as Trash } from "react-icons/fa6";

import Sort from "@/assets/images/icons/sort.svg?react";
import DeleteDialogue from "@/components/Dashboard/Users/Dialogues/DeleteDialogue";
import UserDialogue from "@/components/Dashboard/Users/Dialogues/UserDialogue";
import Button from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area/ScrollArea";
import Table from "@/components/ui/table";
import Cards from "@/components/ui/table-card";
import { IsAuthorized, Users } from "@/lib/role-permissions";
import { IUser, UserSortLabel } from "@/lib/types/users";

type TUsersTable = {
  list: IUser[];
  isLoading?: boolean;
  handleSort?: (sort: UserSortLabel) => void;
};

const UsersTable = ({ list, isLoading = false, handleSort }: TUsersTable) => {
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
  }, [modal, selectedUser]);

  return (
    <>
      {renderModal()}

      <div className="lg:hidden">
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
                        eventName="Delete Users"
                        id={id?.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => {
                          handleDelete(id!);
                        }}
                        className="group"
                      >
                        <Trash className="group-hover:fill-mint h-auto w-4 transition-all" />
                      </Button>
                    </div>
                  )}
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
        <Table.Container
          emptyConfig={{
            title: "No users yet.",
            description: "Add a user by clicking the ‘Add’ button above.",
            status: !list.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              <Table.Header>
                {" "}
                <div className="flex items-center gap-2">
                  <span>First name</span>
                  <button onClick={() => handleSort?.(UserSortLabel.FIRSTNAME)}>
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Last name</span>
                  <button onClick={() => handleSort?.(UserSortLabel.LASTNAME)}>
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Email</span>
                  <button onClick={() => handleSort?.(UserSortLabel.EMAIL)}>
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>Phone</Table.Header>
              <Table.Header>Role</Table.Header>
              <Table.Header>Status</Table.Header>
              <Table.Header>Organization</Table.Header>
              <Table.Header></Table.Header>
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
                  ariaLabel={`User: ${firstName} ${lastName}`}
                  key={bodyIndex}
                >
                  <Table.Data>{firstName}</Table.Data>

                  <Table.Data>{lastName}</Table.Data>

                  <Table.Data>{email}</Table.Data>

                  <Table.Data>{phoneNumber}</Table.Data>

                  <Table.Data className="capitalize">
                    {formattedRole}
                  </Table.Data>

                  <Table.Data className="capitalize">{status}</Table.Data>

                  <Table.Data>{organization}</Table.Data>
                  <Table.Data className="ml-auto">
                    {IsAuthorized([Users.DELETE]) && (
                      <div className="flex justify-end">
                        <Button
                          eventName="Delete User"
                          id={id?.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => {
                            handleDelete(id!);
                          }}
                          className="group"
                        >
                          <Trash
                            className="group-hover:fill-mint group-focus:fill-mint h-auto w-5 transition group-focus:outline-white"
                            aria-hidden="true"
                            role="presentation"
                          />
                          <span className="sr-only">
                            Delete {firstName} {lastName}
                          </span>
                        </Button>
                      </div>
                    )}
                  </Table.Data>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default UsersTable;
