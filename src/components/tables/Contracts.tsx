import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import React from "react";
import { FaTrash as Trash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Pencil } from "assets/images/icons/pencil.svg";

import { useDeleteContractMutation } from "lib/mutations/contracts";
import { Contracts, IsAuthorized } from "lib/role-permissions";
import { IContract } from "lib/types/contracts";
import { getStatusVariant } from "lib/utils";

import { showSetupContractModal } from "components/Dashboard/Contracts/SetupContract";
import { useProfile } from "components/ProfileContext";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TContractsTable = {
  list: IContract[];
  isLoading?: boolean;
  orgId?: string;
  projectId?: number;
};

const ContractsTable = ({
  list,
  isLoading = false,
  orgId,
  projectId,
}: TContractsTable) => {
  const navigate = useNavigate();
  const { isProviderUser } = useProfile();

  const [contractId, setContractId] = useState<number | null>(null);

  const contracts: IContract[] = useMemo(
    () =>
      list.map((item) => ({
        ...item,
        documentName: item.document?.toString(),
      })) || [],

    [list]
  );

  const { deleteContract } = useDeleteContractMutation(
    String(contractId),
    undefined,
    orgId,
    projectId
  );

  const { open } = useCustomPrompt();

  const handleDeleteContract = (id: number) => {
    setContractId(id);
    open({
      title: "Delete Contract",
      subText:
        "Are you sure that you want to delete this contract? When you delete a contract, its beneficiaries will no longer be related to the contract.",
      onYes: () => deleteContract(String(id)),
      yesLabel: "Proceed",
    });
  };

  return (
    <>
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
                  IsAuthorized([Contracts.UPDATE, Contracts.NAVIGATE])
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
                  {!isProviderUser && (
                    <Cards.Details label="Provider" value={provider?.name} />
                  )}
                  <Cards.Details
                    label="Status"
                    value={status?.toLowerCase()}
                    capitalize
                  />
                  <Cards.Details label="Project" value={project} />
                  <Cards.Details label="Document" value={documentName} />
                </Cards.Group>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  {IsAuthorized([Contracts.DELETE]) && status === "draft" && (
                    <button
                      id={id?.toString()}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        showSetupContractModal({
                          contract: item,
                        });
                      }}
                    >
                      <Pencil
                        fill="white"
                        className="h-auto w-4 transition-all group-hover:fill-mint"
                      />
                    </button>
                  )}

                  {IsAuthorized([Contracts.DELETE]) && (
                    <button
                      id={id?.toString()}
                      type="button"
                      onClick={() => handleDeleteContract(id!)}
                      className="group"
                    >
                      <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />
                    </button>
                  )}
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
        <Table.Container
          emptyConfig={{
            title: "No contracts yet.",
            description: "Add a contract by clicking the ‘Add’ button above.",
            status: !contracts.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.filter((key) => {
                if (isProviderUser) return key !== "Provider";
                return true;
              }).map((key, headerIndex) => {
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

                noOfBeneficiaries,
              } = item;

              return (
                <Table.Row
                  onClick={
                    IsAuthorized([Contracts.UPDATE, Contracts.NAVIGATE])
                      ? (e) => {
                          e.stopPropagation();
                          navigate(`/contracts/${id}`);
                        }
                      : undefined
                  }
                  key={index}
                  ariaLabel={`Contract name: ${name}`}
                >
                  <Table.Data>{id}</Table.Data>

                  <Table.Data>{name}</Table.Data>

                  <Table.Data>{project}</Table.Data>

                  {!isProviderUser && <Table.Data>{provider?.name}</Table.Data>}
                  <Table.Data>
                    {noOfBeneficiaries} / {targetNoOfBenefeciaries}
                  </Table.Data>

                  <Table.Data className="capitalize">
                    <Status variant={getStatusVariant(status)}>
                      {capitalize(status)}
                    </Status>
                  </Table.Data>

                  <Table.Data>
                    <div className="flex justify-end gap-2">
                      {IsAuthorized([Contracts.DELETE]) && (
                        <button
                          id={id?.toString()}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            showSetupContractModal({
                              contract: item,
                            });
                          }}
                          className="group h-6 w-6"
                        >
                          <Pencil
                            fill="white"
                            className="h-auto w-4 ring-white ring-offset-1 transition-all group-hover:fill-mint group-focus:fill-mint group-focus:ring-1"
                            aria-hidden="true"
                            role="presentation"
                          />
                          <span className="sr-only">Edit {name}</span>
                        </button>
                      )}
                      {IsAuthorized([Contracts.DELETE]) &&
                        status === "draft" && (
                          <button
                            id={id?.toString()}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContract(id!);
                            }}
                            className="group h-6 w-6"
                          >
                            <Trash
                              className="h-auto w-4 ring-white ring-offset-1 transition-all group-hover:fill-mint group-focus:fill-mint group-focus:ring-1"
                              aria-hidden="true"
                              role="presentation"
                            />
                            <span className="sr-only">Delete {name}</span>
                          </button>
                        )}
                    </div>
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
