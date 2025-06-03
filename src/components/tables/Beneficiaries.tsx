import React from "react";
import { ChangeEvent, useCallback, useState } from "react";
import { BsPencilSquare as Update } from "react-icons/bs";
import { FaTrash as Trash } from "react-icons/fa6";
import { LuDownload as Download } from "react-icons/lu";
import { TbFileExport as Export } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import {
  useDeleteBeneficiaryMutation,
  useExportBeneficiaries,
  useExportEvidenceMutation,
} from "lib/mutations/beneficiaries";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { IBeneficiaries } from "lib/types/beneficiaries";
import { cn, getStatusVariant } from "lib/utils";

import { showBulkUpdateStatusModal } from "components/Dashboard/Beneficiaries/Dialogues/BulkUpdateStatusV2";
import { useProfile } from "components/ProfileContext";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import Checkbox from "components/ui/checkbox";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";
import { toast } from "components/ui/toast/Toast";
import { Toolbar } from "components/ui/toolbar/Toolbar";

type TBeneficiariesTable = {
  list: IBeneficiaries[];
  isLoading?: boolean;
  setChecked?: React.Dispatch<React.SetStateAction<number[]>>;
  funderId?: string;
  providerId?: string;
  projectId?: string;
  contractId?: string;
};

const BeneficiariesTable = ({
  list,
  isLoading = false,
  setChecked,
  funderId,
  providerId,
  projectId,
  contractId,
}: TBeneficiariesTable) => {
  const navigate = useNavigate();

  const { isProviderUser } = useProfile();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let temp = [] as any;
      if (e.target.checked) {
        temp = (list || []).map((item) => item.id);
      }
      setSelectedIds(temp);
      if (setChecked) setChecked(temp);
    },
    [list, setChecked]
  );

  const { open } = useCustomPrompt();

  const { deleteBeneficiary } = useDeleteBeneficiaryMutation(
    undefined,
    funderId,
    providerId,
    projectId,
    contractId
  );

  const handleDelete = (beneId: number) => {
    open({
      title: "Delete Beneficiary",
      subText:
        "Are you sure that you want to delete this beneficiary? When you delete a beneficiary, all evidence documents and other information are deleted too.",
      onYes: () => deleteBeneficiary(beneId),
      yesLabel: "Proceed",
    });
  };

  const { exportEvidence } = useExportEvidenceMutation();

  const handleDownloadEvidence = async () => {
    const filteredIds = selectedIds.filter(
      (id) => !!list.find((item) => item.id === id)?.evidences?.length
    );

    if (!filteredIds.length) {
      toast({
        title: "No evidences found",
        variant: "danger",
      });
      return;
    }
    await exportEvidence({ beneficiaryIds: filteredIds });
    setSelectedIds([]);
  };

  const { exportBeneficiaries } = useExportBeneficiaries();

  const handleExportBeneficiaries = async () => {
    await exportBeneficiaries({
      beneficiaryIds: selectedIds.length ? selectedIds : [-1],
    });
    setSelectedIds([]);
  };

  const handleBulkUpdate = () => {
    showBulkUpdateStatusModal({
      ids: selectedIds,
      successCb: () => setSelectedIds([]),
    });
  };

  return (
    <>
      <div className="lg:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((item, index) => {
            const {
              firstName,

              lastName,

              contract,

              provider,

              email,

              id,

              status,
            } = item;

            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/beneficiaries/${id}`);
                }}
                key={index}
                title={`${firstName} ${lastName}`}
              >
                {setChecked && IsAuthorized([Beneficiaries.UPDATE]) && (
                  <div className="absolute right-[2px] top-4">
                    <Checkbox
                      checked={selectedIds.includes(id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [...prev, id]);
                          setChecked((prev) => [...prev, id]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((item) => item !== id)
                          );
                          setChecked((prev) =>
                            prev.filter((item) => item !== id)
                          );
                        }
                      }}
                    />
                  </div>
                )}

                <Cards.Group cols={2} className="w-[85%]">
                  <Cards.Details label="Email" value={email} />
                  <Cards.Details label="Contract" value={contract} />
                  {!isProviderUser && (
                    <Cards.Details label="Provider" value={provider} />
                  )}

                  <Cards.Details
                    label="Status"
                    value={
                      <Status variant={getStatusVariant(status)}>
                        {status}
                      </Status>
                    }
                  />
                </Cards.Group>

                <div className="absolute bottom-3 right-0">
                  {IsAuthorized([Beneficiaries.DELETE]) && (
                    <div className="flex justify-end">
                      <Button
                        eventName="Delete Beneficiary"
                        id={id.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => handleDelete(id)}
                        className="group"
                      >
                        <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />
                      </Button>
                    </div>
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
            title: "No beneficiaries yet.",
            description:
              "Add a beneficiary by clicking the ‘Add’ button above.",
            status: !list?.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              {setChecked ? (
                <Table.Header className="!pl-2">
                  {IsAuthorized([Beneficiaries.UPDATE]) ? (
                    <div className="pl-2">
                      <Checkbox
                        checked={
                          list?.length !== 0 &&
                          selectedIds.length === list.length
                        }
                        label="Name"
                        labelClass="!text-white text-base font-semibold translate-x-[-4px]"
                        onChange={handleSelectAll}
                        tabIndex={-1}
                      />
                    </div>
                  ) : (
                    "Name"
                  )}
                </Table.Header>
              ) : (
                <Table.Header>Name</Table.Header>
              )}

              <Table.Header>Email</Table.Header>

              <Table.Header>Contract</Table.Header>

              {!isProviderUser && <Table.Header>Provider</Table.Header>}

              <Table.Header>Status</Table.Header>

              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {list?.map((item, index) => {
              const {
                firstName,

                lastName,

                provider,

                email,

                id,

                contract,

                status,
              } = item;

              return (
                <Table.Row
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/beneficiaries/${id}`);
                  }}
                  ariaLabel={`Beneficiary name: ${firstName} ${lastName}`}
                >
                  <Table.Data className="!px-4">
                    <div className="flex items-center gap-2">
                      {setChecked && IsAuthorized([Beneficiaries.UPDATE]) ? (
                        <div
                          className="w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            tabIndex={-1}
                            labelClass="text-[14px]"
                            checked={selectedIds.includes(id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, id]);
                                setChecked((prev) => [...prev, id]);
                              } else {
                                setSelectedIds((prev) =>
                                  prev.filter((item) => item !== id)
                                );
                                setChecked((prev) =>
                                  prev.filter((item) => item !== id)
                                );
                              }
                            }}
                          />
                        </div>
                      ) : null}
                      <p
                        className={cn(
                          "translate-y-[1px] truncate text-left font-[300] outline-none",
                          setChecked ? "translate-x-[-8px]" : ""
                        )}
                      >
                        {firstName} {lastName}
                      </p>
                    </div>
                  </Table.Data>

                  <Table.Data>{email}</Table.Data>

                  <Table.Data>{contract}</Table.Data>

                  {!isProviderUser && <Table.Data>{provider}</Table.Data>}

                  <Table.Data className="capitalize">
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>

                  <Table.Data className="ml-auto">
                    {IsAuthorized([Beneficiaries.DELETE]) && (
                      <div className="flex justify-end">
                        <Button
                          eventName="Delete Beneficiary"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="group"
                        >
                          <Trash
                            className="h-auto w-5 transition group-hover:fill-mint group-focus:fill-mint group-focus:outline-white"
                            aria-hidden="true"
                            role="presentation"
                          />
                          <span className="sr-only">
                            Delete {firstName} {lastName}
                          </span>
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
      <Toolbar
        selectedCount={selectedIds.length}
        onDelete={() => setSelectedIds([])}
        actions={[
          {
            label: "Update Status",
            onClick: () => handleBulkUpdate(),
            icon: (
              <Update className="h-4 w-4 transition group-hover:fill-mint" />
            ),
          },
          {
            label: "Download Evidence",
            onClick: () => handleDownloadEvidence(),
            icon: (
              <Download className="h-4 w-4 transition group-hover:stroke-mint" />
            ),
          },
          {
            label: "Export CSV",
            onClick: () => handleExportBeneficiaries(),
            icon: (
              <Export className="h-4 w-4 transition group-hover:stroke-mint" />
            ),
          },
        ]}
      />
    </>
  );
};

export default BeneficiariesTable;
