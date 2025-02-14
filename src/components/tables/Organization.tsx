import { useState } from "react";

import pencil from "assets/images/icons/pencil.svg";

import { IOrganization } from "lib/types/organizations";

import OrganizationDialogue from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import Button from "components/ui/button";
import Table from "components/ui/table";

type TOrganizationTable = {
  list: IOrganization[];
  isLoading?: boolean;
};

const OrganizationTable = ({ list, isLoading = false }: TOrganizationTable) => {
  const [modal, setModal] = useState<"org" | null>(null);

  const [selectedOrg, setSelectedOrg] = useState("");

  const close = () => {
    setSelectedOrg("");

    setModal(null);
  };

  const handleEditOrg = (id: string) => {
    setModal("org");

    setSelectedOrg(id);
  };

  return (
    <>
      {modal === "org" && (
        <OrganizationDialogue
          orgId={selectedOrg}
          isVisible={modal === "org"}
          handleClose={close}
        />
      )}

      <div className="pr-4">
        <Table.Container isEmpty={!list} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return (
                  <Table.Header
                    className="h-[64px] pl-[18px]"
                    key={headerIndex}
                  >
                    {key}
                  </Table.Header>
                );
              })}

              <Table.Header className="h-[64px]"></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list.map((item: IOrganization, bodyIndex: number) => {
              const {
                id,
                name,
                registeredName,
                regions,
                type,
                status,
                registeredAddress,
                registrationNumber,
                noOfProjects,
                noOfUsers,
                state,
                postalCode,
                country,
              } = item;
              return (
                <Table.Row
                  onClick={(e) => {
                    e.stopPropagation();

                    handleEditOrg(id!);
                  }}
                  key={bodyIndex}
                >
                  <Table.Data className="pl-[18px]">
                    <p className="w-[200px] truncate">{name}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[200px] truncate">{registeredName}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[250px] truncate">
                      {`${registeredAddress}, ${state} ${postalCode} ${country}`}
                    </p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[100px] truncate">{registrationNumber}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[120px] truncate">{regions?.join(", ")}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[60px] truncate capitalize">{type}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[55px] truncate capitalize">{status}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[35px] truncate">{noOfUsers}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[35px] truncate">{noOfProjects}</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <p className="w-[35px] truncate">-</p>
                  </Table.Data>

                  <Table.Data className="pl-[18px]">
                    <Button
                      eventName="Edit User"
                      id={String(id)}
                      buttonType="default"
                      type="button"
                      onClick={() => handleEditOrg(id!)}
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
      </div>
    </>
  );
};

export default OrganizationTable;

const TABLE_HEADER = [
  "Organization",
  "Registered Name",
  "Registered Address",
  "Registration",
  "Region",
  "Type",
  "Status",
  "Users",
  "Projects",
  "Contracts",
];
