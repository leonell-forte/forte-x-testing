import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ReactComponent as Pencil } from "assets/images/icons/pencil.svg";

import { IOrganization, OrgTypes } from "lib/types/organizations";
import { getStatusVariant } from "lib/utils";

import OrganizationDialogue, {
  showOrganizationDialogue,
} from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
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
  const navigate = useNavigate();
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
            const { id, name, registeredName, regions, type, status } = item;
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
        <Table.Container
          emptyConfig={{
            title: `No organizations yet.`,
            description: `Add an organization by clicking the ‘Add’ button above.`,
            status: !list.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              <Table.Header>{`${capitalize(type)} Name`}</Table.Header>
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}
              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list.map((item: IOrganization, bodyIndex: number) => {
              const { id, name, regions, status, registrationNumber } = item;
              return (
                <Table.Row
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/${type}s/${id}`);
                  }}
                  key={bodyIndex}
                >
                  <Table.Data>{name}</Table.Data>

                  <Table.Data>{registrationNumber}</Table.Data>

                  <Table.Data># of contracts</Table.Data>

                  <Table.Data># of beneficiaries</Table.Data>

                  <Table.Data>{regions?.join(", ")}</Table.Data>

                  <Table.Data>
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>

                  <Table.Data>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showOrganizationDialogue({ orgId: id, type });
                      }}
                    >
                      <Pencil fill="white" width={16} />
                    </button>
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
  "Registration #",
  "# of Contracts",
  "# of Beneficiaries",
  "Region",
  "Status",
];
