import { useCallback, useMemo, useState } from "react";

import bin from "assets/images/icons/bin.svg";
import pencil from "assets/images/icons/pencil.svg";

import { DEFAULT_DATE_FORMAT } from "lib/constants";
import { IContract } from "lib/types/contracts";
import { formatDate } from "lib/utils";

import ContractDialogue from "components/Dashboard/Contracts/Dialogues/ContractDialogue";
import DeleteDialogue from "components/Dashboard/Contracts/Dialogues/DeleteDialogue";
import Button from "components/ui/button";
import Table from "components/ui/table";

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
      <div className="pr-4">
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

                parties,

                targetNoOfBenefeciaries,

                startDate,

                endDate,

                documentName,

                outcomenames,
              } = item;

              return (
                <Table.Row key={index}>
                  <Table.Data>
                    <p className="w-[20px] truncate">{id}</p>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[150px] truncate">{name}</p>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[150px] truncate">{parties?.join(", ")}</p>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[100px] truncate capitalize">
                      {status?.toLowerCase()}
                    </p>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[140px] truncate">{project}</p>
                  </Table.Data>

                  <Table.Data>{outcomenames?.join(", ")}</Table.Data>

                  <Table.Data>{targetNoOfBenefeciaries}</Table.Data>

                  <Table.Data>0</Table.Data>

                  <Table.Data>
                    {formatDate(startDate, DEFAULT_DATE_FORMAT)}
                  </Table.Data>

                  <Table.Data>
                    {formatDate(endDate, DEFAULT_DATE_FORMAT)}
                  </Table.Data>

                  <Table.Data>{documentName}</Table.Data>

                  <Table.Data>
                    <div className="flex justify-end">
                      <Button
                        eventName={
                          status === "DRAFT" ? "Edit Contract" : "View Contract"
                        }
                        id={id?.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => handleEditContract(id!)}
                        className="p-[3px]"
                      >
                        <img alt="pencil" src={pencil} />
                      </Button>

                      <Button
                        eventName="Delete Contract"
                        id={id?.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => handleDeleteContract(id!)}
                        className="p-[3px]"
                      >
                        <img alt="bin" src={bin} />
                      </Button>
                    </div>
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
  "Name",
  "Parties",
  "Status",
  "Project",
  "Outcome(s)",
  "Target beneficiaries",
  "Actual beneficiaries ",
  "Start date",
  "End date",
  "Document",
];
