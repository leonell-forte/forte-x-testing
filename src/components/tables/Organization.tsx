import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { IOrganization, OrgTypes } from "lib/types/organizations";

import OrganizationDialogue from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TOrganizationTable = {
  list: IOrganization[];
  isLoading?: boolean;
  type?: OrgTypes;
};

const OrganizationTable = ({
  list,
  isLoading = false,
  type,
}: TOrganizationTable) => {
  const [modal, setModal] = useState<"org" | null>(null);

  const [selectedOrg, setSelectedOrg] = useState("");

  const [params, setParams] = useSearchParams();

  const id = params.get("id");

  useEffect(() => {
    if (id) {
      handleEditOrg(id);
    }
  }, [id]);

  const close = () => {
    setParams({});

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
          type={type}
        />
      )}
      <div className="lg:hidden">
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
      <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
        <Table.Container isEmpty={list.length === 0} isLoading={isLoading}>
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
                  <Table.Data>{name}</Table.Data>

                  <Table.Data>{registeredName}</Table.Data>

                  <Table.Data>{registrationNumber}</Table.Data>

                  <Table.Data>{regions?.join(", ")}</Table.Data>

                  <Table.Data className="capitalize">{type}</Table.Data>

                  <Table.Data>
                    <p className="truncate capitalize">{status}</p>
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

export default OrganizationTable;

const TABLE_HEADER = [
  "Organization",
  "Registered Name",
  "Registration Number",
  "Region",
  "Type",
  "Status",
];
