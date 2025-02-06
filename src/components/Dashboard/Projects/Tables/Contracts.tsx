import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import { useState } from "react";

import pencil from "assets/images/icons/pencil.svg";

import { IsAuthorized, Projects } from "lib/role-permissions";
import { formatDate } from "lib/utils";

import Button from "components/ui/button";
import Table from "components/ui/table";

import ContractDialogue from "../../Contracts/Dialogues/ContractDialogue";
import TagExistingDialogue from "../Dialogues/TagExistingDialogue";

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
          />
        );
    }
  };

  return (
    <>
      {renderModal(modal)}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[24px] font-semibold">Contracts</p>

          {IsAuthorized([Projects.UPDATE]) && (
            <div className="flex gap-2.5">
              <Button onClick={() => setModal("contract")}>
                Add new contract
              </Button>
            </div>
          )}
        </div>

        <Table.Container
          isLoading={isLoading}
          isEmpty={!contractList?.items.length}
        >
          <Table.Head>
            <Table.Row>
              {HEADERS.map((item, index) => {
                return (
                  <Table.Header small key={index}>
                    {item}
                  </Table.Header>
                );
              })}

              <Table.Header small></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {contractList?.items.map((item, index) => {
              const {
                id,

                parties,

                name,

                targetNoOfBenefeciaries,

                status,

                startDate,

                endDate,

                outcomenames,
              } = item;

              return (
                <Table.Row key={index}>
                  <Table.Data small className="h-[56px] w-[100px] py-1">
                    {id}
                  </Table.Data>

                  <Table.Data small className="h-[56px] w-[100px] py-1">
                    {name}
                  </Table.Data>

                  <Table.Data small className="h-[56px] w-[150px] py-1">
                    {parties?.join(", ")}
                  </Table.Data>

                  <Table.Data small className="h-[56px] w-[150px] py-1">
                    {outcomenames?.join(", ")}
                  </Table.Data>

                  <Table.Data small className="h-[56px] w-[80px] py-1">
                    <p>{targetNoOfBenefeciaries}</p>
                  </Table.Data>

                  <Table.Data small className="h-[56px] w-[120px] py-1">
                    <p className="capitalize">{status?.toLowerCase()}</p>
                  </Table.Data>

                  <Table.Data small className="h-[56px] w-[120px] py-1">
                    <p>{formatDate(startDate, "LL-dd-yyyy")}</p>
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    <p>{formatDate(endDate, "LL-dd-yyyy")}</p>
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(id!.toString())}
                      >
                        <img src={pencil} alt="" />
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
  "ID",
  "Contract",
  "Parties",
  "Outcome(s)",
  "Beneficiaries",
  "Status",
  "Start date",
  "End date",
];
