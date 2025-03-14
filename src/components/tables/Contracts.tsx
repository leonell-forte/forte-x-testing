import { useCallback, useMemo, useState } from "react";
import { FaTrash as Trash } from "react-icons/fa6";

import { Contracts, IsAuthorized } from "lib/role-permissions";
import { IContract } from "lib/types/contracts";

import ContractDialogue from "components/Dashboard/Contracts/Dialogues/ContractDialogue";
import DeleteDialogue from "components/Dashboard/Contracts/Dialogues/DeleteDialogue";
import Button from "components/ui/button";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TContractsTable = {
  list: IContract[];
  isLoading?: boolean;
};

const ContractsTable = ({ list, isLoading = false }: TContractsTable) => {
  const [contractId, setContractId] = useState<number | null>(null);

  const contracts: IContract[] = useMemo(
    () =>
      list.map((item) => ({
        ...item,
        documentName: item.document?.toString(),
      })) || [],

    [list]
  );

  const [modal, setModal] = useState<"contract" | "delete" | null>(null);

  const close = () => {
    setContractId(null);

    setModal(null);
  };

  const renderDialog = useCallback(() => {
    switch (modal) {
      case "contract":
        return (
          <ContractDialogue
            id={contractId!}
            isVisible={modal === "contract"}
            handleClose={close}
          />
        );

      case "delete":
        return (
          <DeleteDialogue
            id={contractId?.toString() || ""}
            isVisible={modal === "delete"}
            handleClose={close}
          />
        );
    }
  }, [modal, contractId]);

  const handleEditContract = (id: number) => {
    setModal("contract");

    setContractId(id);
  };

  const handleDeleteContract = (id: number) => {
    setModal("delete");

    setContractId(id);
  };

  return (
    <>
      {renderDialog()}
      <div className="table-breakpoint:hidden">
        <Cards.Container isLoading={isLoading}>
          {contracts.map((item, index) => {
            const {
              id,

              name,

              project,

              status,

              provider,

              documentName,
            } = item;
            return (
              <Cards.Card
                onClick={
                  IsAuthorized([Contracts.UPDATE])
                    ? (e) => {
                        e.stopPropagation();

                        handleEditContract(id!);
                      }
                    : undefined
                }
                title={`Contract ID: ${id}`}
                key={index}
              >
                <Cards.Group cols={2}>
                  <Cards.Details label="Contract name" value={name} />
                  <Cards.Details label="Provider" value={provider?.name} />
                  <Cards.Details
                    label="Status"
                    value={status?.toLowerCase()}
                    capitalize
                  />
                  <Cards.Details label="Project" value={project} />
                  <Cards.Details label="Document" value={documentName} />
                </Cards.Group>

                <div className="absolute bottom-3 right-0">
                  {IsAuthorized([Contracts.DELETE]) && (
                    <Button
                      eventName="Delete Contract"
                      id={id?.toString()}
                      buttonType="default"
                      type="button"
                      onClick={() => handleDeleteContract(id!)}
                      className="group"
                    >
                      <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />
                    </Button>
                  )}
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>
      <div className="hidden table-breakpoint:block">
        <Table.Container isEmpty={!contracts.length} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}

              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {contracts?.map((item, index) => {
              const {
                id,

                name,

                project,

                status,

                provider,

                documentName,
              } = item;

              return (
                <Table.Row
                  onClick={
                    IsAuthorized([Contracts.UPDATE])
                      ? (e) => {
                          e.stopPropagation();

                          handleEditContract(id!);
                        }
                      : undefined
                  }
                  key={index}
                >
                  <Table.Data className="w-[40px]">{id}</Table.Data>

                  <Table.Data className="w-[120px]">{name}</Table.Data>

                  <Table.Data className="w-[140px]">
                    {provider?.name}
                  </Table.Data>

                  <Table.Data className="w-[90px] capitalize">
                    {status?.toLowerCase()}
                  </Table.Data>

                  <Table.Data className="w-[120px]">{project}</Table.Data>

                  <Table.Data className="w-[190px]">{documentName}</Table.Data>

                  <Table.Data className="ml-auto w-[40px]">
                    {IsAuthorized([Contracts.DELETE]) && (
                      <div className="flex justify-end">
                        <Button
                          eventName="Delete Contract"
                          id={id?.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => handleDeleteContract(id!)}
                          className="group p-[3px]"
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

export default ContractsTable;

const TABLE_HEADER = [
  "ID",
  "Contract name",
  "Provider",
  "Status",
  "Project",
  "Document",
];
