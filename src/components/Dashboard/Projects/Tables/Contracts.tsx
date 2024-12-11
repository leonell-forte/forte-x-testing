import Table from "../../../../components/ui/table";
import pencil from "../../../../assets/images/icons/pencil.svg";
import { useState } from "react";
import Button from "../../../../components/ui/button";
import ContractDialogue from "../../Contracts/Dialogues/ContractDialogue";
import TagExistingDialogue from "../Dialogues/TagExistingDialogue";
import { useQuery } from "@tanstack/react-query";
import contractService from "../../../../api/contract";
import { formatDate } from "../../../../lib/utils";

type ModalLabelType = "contract" | "tag" | "";

interface IProps {
  projectId?: number;
}

const Contracts = ({ projectId }: IProps) => {
  const { data: contractList, isLoading } = useQuery({
    queryKey: ["contracts", 1, ""],

    queryFn: () =>
      contractService.list({
        page: 1,

        search: "",

        filters: null,

        projectId,
      }),
  });

  const [selectedContract, setSelectedContract] = useState("");

  const [modal, setModal] = useState<ModalLabelType>("");

  const close = () => {
    setModal("");

    setSelectedContract("");
  };

  const handleEdit = (id: string) => {
    setSelectedContract(id);

    setModal("contract");
  };

  const renderModal = (modal: ModalLabelType) => {
    switch (modal) {
      case "contract":
        return (
          <ContractDialogue
            id={Number(selectedContract)}
            isVisible={modal === "contract"}
            handleClose={close}
            projectId={projectId}
          />
        );

      case "tag":
        return (
          <TagExistingDialogue
            isVisible={modal === "tag"}
            handleClose={close}
            title="Add contracts to project"
            handleAdd={() => {}}
          />
        );
    }
  };

  return (
    <>
      {renderModal(modal)}

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[24px]">Contracts</p>

          <div className="flex gap-2.5">
            <Button onClick={() => setModal("contract")}>
              Add new contract
            </Button>
          </div>
        </div>

        <Table.Container
          isLoading={isLoading}
          isEmpty={!contractList?.items.length}
        >
          <Table.Head>
            <Table.Row>
              {HEADERS.map((item, index) => {
                return (
                  <Table.Header
                    small
                    key={index}
                  >
                    {item}
                  </Table.Header>
                );
              })}

              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {contractList?.items.map((item, index) => {
              const {
                id,

                outcomes,

                targetNoOfBenefeciaries,

                status,

                startDate,

                endDate,
              } = item;

              return (
                <Table.Row key={index}>
                  <Table.Data className="h-[56px] py-1 w-[100px]">
                    Contract {id}
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1 w-[150px]">
                    {/* {parties} */}
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1 w-[150px]">
                    <p>outcomes</p>
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1 w-[80px]">
                    <p>{targetNoOfBenefeciaries}</p>
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1 w-[120px]">
                    <p className="capitalize">{status?.toLowerCase()}</p>
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1 w-[120px]">
                    <p>{formatDate(startDate, "LL-dd-yyyy")}</p>
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1">
                    <p>{formatDate(endDate, "LL-dd-yyyy")}</p>
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(id!.toString())}
                      >
                        <img
                          src={pencil}
                          alt=""
                        />
                      </button>
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

export default Contracts;

const HEADERS = [
  "Contract",
  "Parties",
  "Outcome(s)",
  "Beneficiaries",
  "Status",
  "Start date",
  "End date",
];
