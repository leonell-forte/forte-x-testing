import { useCallback, useMemo, useState } from "react";
import { FaTrash as Trash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { Contracts, IsAuthorized } from "lib/role-permissions";
import { IContract } from "lib/types/contracts";
import { getStatusVariant } from "lib/utils";

import DeleteDialogue from "components/Dashboard/Contracts/Dialogues/DeleteDialogue";
import Button from "components/ui/button";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TContractsTable = {
  list: IContract[];
  isLoading?: boolean;
};

const ContractsTable = ({ list, isLoading = false }: TContractsTable) => {
  const navigate = useNavigate();
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

  const handleDeleteContract = (id: number) => {
    setModal("delete");

    setContractId(id);
  };

  return (
    <>
      {renderDialog()}
      <div className="lg:hidden">
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

                        navigate(`/contracts/${id}`);
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
      <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
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

                targetNoOfBenefeciaries,
              } = item;

              return (
                <Table.Row
                  onClick={
                    IsAuthorized([Contracts.UPDATE])
                      ? (e) => {
                          e.stopPropagation();

                          navigate(`/contracts/${id}`);
                        }
                      : undefined
                  }
                  key={index}
                >
                  <Table.Data>{id}</Table.Data>

                  <Table.Data>{name}</Table.Data>

                  <Table.Data>{project}</Table.Data>

                  <Table.Data>{provider?.name}</Table.Data>

                  <Table.Data>{targetNoOfBenefeciaries}</Table.Data>

                  <Table.Data className="capitalize">
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>

                  <Table.Data className="ml-auto">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default ContractsTable;

const TABLE_HEADER = [
  "ID",
  "Contract name",
  "Project",
  "Provider",
  "# of Beneficiaries",
  "Status",
];
