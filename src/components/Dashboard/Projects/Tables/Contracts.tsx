import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import { useState } from "react";

import { DEFAULT_DATE_FORMAT } from "lib/constants";
import { IsAuthorized, Projects } from "lib/role-permissions";
import { Contracts as ContractPermission } from "lib/role-permissions";
import { formatDate } from "lib/utils";

import Button from "components/ui/button";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

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
        <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="text-[24px] font-semibold">Contracts</p>

          {IsAuthorized([Projects.UPDATE]) && (
            <div className="flex w-full flex-col sm:w-auto sm:flex-row">
              <Button onClick={() => setModal("contract")}>
                Add new contract
              </Button>
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <Cards.Container isLoading={isLoading}>
            {contractList?.items.map((item, index) => {
              const {
                id,

                provider,

                name,

                targetNoOfBenefeciaries,

                status,

                startDate,

                endDate,

                outcomenames,
              } = item;
              return (
                <Cards.Card
                  onClick={
                    IsAuthorized([ContractPermission.UPDATE])
                      ? (e) => {
                          e.stopPropagation();

                          handleEdit(id!.toString());
                        }
                      : undefined
                  }
                  key={index}
                  title={name}
                >
                  <Cards.Group cols={2}>
                    <Cards.Details label="Provider" value={provider.name} />
                    <Cards.Details
                      label="Outcomes"
                      value={outcomenames?.join(", ")}
                    />

                    <Cards.Details
                      label="Beneficiaries"
                      value={targetNoOfBenefeciaries.toString()}
                    />
                    <Cards.Details
                      label="Status"
                      value={status.toLowerCase()}
                      capitalize
                    />
                    <Cards.Details
                      label="Start date"
                      value={formatDate(startDate || "", DEFAULT_DATE_FORMAT)}
                    />
                    <Cards.Details
                      label="End date"
                      value={formatDate(endDate || "", DEFAULT_DATE_FORMAT)}
                    />
                  </Cards.Group>
                </Cards.Card>
              );
            })}
          </Cards.Container>
        </div>
        <div className="hidden lg:block">
          <Table.Container
            isLoading={isLoading}
            isEmpty={!contractList?.items.length}
          >
            <Table.Head>
              <Table.Row>
                {HEADERS.map((item, index) => {
                  return <Table.Header key={index}>{item}</Table.Header>;
                })}
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {contractList?.items.map((item, index) => {
                const {
                  id,

                  provider,

                  name,

                  targetNoOfBenefeciaries,

                  status,

                  startDate,

                  endDate,

                  outcomenames,
                } = item;
                return (
                  <Table.Row
                    onClick={
                      IsAuthorized([ContractPermission.UPDATE])
                        ? (e) => {
                            e.stopPropagation();

                            handleEdit(id!.toString());
                          }
                        : undefined
                    }
                    key={index}
                  >
                    <Table.Data className="w-[100px]">{id}</Table.Data>

                    <Table.Data className="w-[100px]">{name}</Table.Data>

                    <Table.Data className="w-[150px]">
                      {provider.name}
                    </Table.Data>

                    <Table.Data className="w-[150px]">
                      {outcomenames?.join(", ")}
                    </Table.Data>

                    <Table.Data className="w-[80px]">
                      {targetNoOfBenefeciaries}
                    </Table.Data>

                    <Table.Data className="w-[120px] capitalize">
                      {status?.toLowerCase()}
                    </Table.Data>

                    <Table.Data className="w-[120px]">
                      {formatDate(startDate, "LL-dd-yyyy")}
                    </Table.Data>

                    <Table.Data className="w-[120px]">
                      {formatDate(endDate, "LL-dd-yyyy")}
                    </Table.Data>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Container>
        </div>
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
