import { useState } from "react";

import { IOrganization } from "lib/types/organizations";

import OrganizationDialogue from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

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
      <div className="table-breakpoint:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((item, index) => {
            const {
              id,
              name,
              registeredName,
              regions,
              type,
              status,
              registrationNumber,
            } = item;
            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();

                  handleEditOrg(id!);
                }}
                isLoading={isLoading}
                key={index}
                title={name}
              >
                <Cards.Group cols={2}>
                  <Cards.Details
                    label="Registered name"
                    value={registeredName}
                  />
                  <Cards.Details
                    label="Registration number"
                    value={registrationNumber}
                  />
                  <Cards.Details label="Regions" value={regions.join(", ")} />
                  <Cards.Details label="Type" value={type} capitalize />
                  <Cards.Details label="Status" value={status} capitalize />
                </Cards.Group>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>
      <div className="hidden table-breakpoint:block">
        <Table.Container isEmpty={!list} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}
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
                registrationNumber,
              } = item;
              return (
                <Table.Row
                  onClick={(e) => {
                    e.stopPropagation();

                    handleEditOrg(id!);
                  }}
                  key={bodyIndex}
                >
                  <Table.Data className="w-[140px]">{name}</Table.Data>

                  <Table.Data className="w-[180px]">
                    {registeredName}
                  </Table.Data>

                  <Table.Data className="w-[100px]">
                    {registrationNumber}
                  </Table.Data>

                  <Table.Data className="w-[260px]">
                    {regions?.join(", ")}
                  </Table.Data>

                  <Table.Data className="w-[140px] capitalize">
                    {type}
                  </Table.Data>

                  <Table.Data className="w-[100px]">
                    <p className="truncate capitalize">{status}</p>
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
  "Registration",
  "Region",
  "Type",
  "Status",
];
