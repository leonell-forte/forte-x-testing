import evidenceService from "api/evidence";
import { ChangeEvent, useCallback, useState } from "react";
import { BsPencilSquare as Update } from "react-icons/bs";
import { HiEllipsisHorizontal as Ellipsis } from "react-icons/hi2";
import { LuDownload as Download } from "react-icons/lu";

import {
  useBulkDownloadEvidenceMutation,
  useDeleteEvidence,
} from "lib/mutations/evidences";
import { IsAuthorized } from "lib/role-permissions";
import { Evidences } from "lib/role-permissions";
import { MainEvidence } from "lib/types/evidence";
import { MILESTONE_TYPES } from "lib/types/milestones";
import { cn, getStatusVariant } from "lib/utils";

import { showBulkUpdateStatusModal } from "components/Dashboard/Evidence/modals/BulkUpdateStatus";
import { showViewEvidenceModal } from "components/Dashboard/Milestones/modals/ViewEvidence";
import { useProfile } from "components/ProfileContext";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Checkbox from "components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu/DropdownMenu";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";
import { toast } from "components/ui/toast/Toast";
import { Toolbar } from "components/ui/toolbar/Toolbar";

interface IProps {
  list: MainEvidence[];
  isLoading: boolean;
}

const MainEvidencesTable = ({ list, isLoading }: IProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { isProviderUser } = useProfile();

  const { open } = useCustomPrompt();
  const { deleteEvidence } = useDeleteEvidence();

  const { bulkDownloadEvidence } = useBulkDownloadEvidenceMutation();

  const handleBulkDownload = async () => {
    toast({
      title: "Downloading files...",
      variant: "info",
      duration: 1750,
    });
    await bulkDownloadEvidence({ ids: selectedIds });
    setSelectedIds([]);
  };

  const handleDelete = (beneId: number, id: number) => {
    open({
      title: "Delete Evidence",
      subText:
        "Deleting this document will unlink and delete this document from its milestone.",
      onYes: () => deleteEvidence({ beneficiaryId: beneId, evidenceId: id }),
      yesLabel: "Proceed",
    });
  };

  const handleSelectAll = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let temp = [] as any;
      if (e.target.checked) {
        temp = (list || []).map((item) => item.id);
      }
      setSelectedIds(temp);
    },
    [list]
  );

  const dropDownItems = [
    {
      label: "Update Status",
      value: "update-status",
      permission: Evidences.UPDATE,
      show: !isProviderUser,
    },
    {
      label: "Details",
      value: "details",
      permission: Evidences.UPDATE,
      show: isProviderUser,
    },
    {
      label: "Download",
      value: "download",
      permission: Evidences.DOWNLOAD,
      show: true,
    },
    {
      label: "Delete",
      value: "delete",
      permission: Evidences.DELETE,
      show: true,
    },
  ];

  const handleDropdownAction = (action: string, evidence: MainEvidence) => {
    switch (action) {
      case "update-status":
        showViewEvidenceModal({
          milestoneId: evidence.milestoneId as string,
          evidenceId: evidence.id,
          beneficiaryId: evidence.beneficiary?.id,
          status: evidence.status,
        });
        break;
      case "details":
        showViewEvidenceModal({
          milestoneId: evidence.milestoneId as string,
          evidenceId: evidence.id,
          beneficiaryId: evidence.beneficiary?.id,
          status: evidence.status,
        });
        break;
      case "download":
        evidenceService.getFile(
          evidence.filename.fileUrl,
          evidence.filename.filename
        );
        break;
      case "delete":
        handleDelete(evidence.beneficiary?.id, evidence.id);
        break;
    }
  };

  const dropDownComponent = (evidence: MainEvidence) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group mt-1">
            <Ellipsis className="m-auto h-auto w-8 group-hover:fill-mint" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={1}>
          {dropDownItems
            .filter((item) => item.show)
            .map((item, index) => {
              if (!IsAuthorized([item.permission])) return null;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownAction(item.value, evidence);
                  }}
                >
                  {item.label}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      <div className="lg:hidden">
        <Cards.Container>
          {list.map((item, index) => {
            const {
              filename,
              beneficiary,
              type,
              outcome,
              milestoneId,
              status,
              id,
            } = item;

            return (
              <Cards.Card
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("details fn here");
                }}
              >
                <div className="absolute right-5 top-4 flex items-center">
                  {dropDownComponent(item)}
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 font-semibold">
                    {IsAuthorized([Evidences.UPDATE]) && !isProviderUser && (
                      <div className="w-4 translate-y-[-2px]">
                        <Checkbox
                          checked={selectedIds.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [...prev, id]);
                            } else {
                              setSelectedIds((prev) =>
                                prev.filter((item) => item !== id)
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                    {filename?.filename}
                  </p>

                  <Cards.Group
                    onClick={(e) => {
                      e.stopPropagation();
                      showViewEvidenceModal({
                        milestoneId: milestoneId!,
                        evidenceId: id,
                        beneficiaryId: beneficiary.id,
                        status,
                      });
                    }}
                  >
                    <Cards.Details
                      label="Beneficiary"
                      value={
                        beneficiary?.firstName + " " + beneficiary?.lastName
                      }
                    />
                    <Cards.Details
                      label="Type"
                      value={type ? MILESTONE_TYPES[type] : "-"}
                    />
                    <Cards.Details label="Outcome" value={outcome || "-"} />
                    <Cards.Details
                      label="Milestone ID"
                      value={milestoneId || "-"}
                    />
                    <Cards.Details
                      label="Status"
                      value={
                        <Status variant={getStatusVariant(status)}>
                          {status}
                        </Status>
                      }
                      capitalize
                    />
                  </Cards.Group>
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
        <Table.Container
          emptyConfig={{
            title: "No evidences yet.",
            status: !list.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              <Table.Header
                className={cn(
                  IsAuthorized([Evidences.UPDATE]) && !isProviderUser
                    ? "!pl-2"
                    : ""
                )}
              >
                {IsAuthorized([Evidences.UPDATE]) && !isProviderUser ? (
                  <div className="pl-2">
                    <Checkbox
                      checked={
                        list?.length !== 0 && selectedIds.length === list.length
                      }
                      label="Evidence file"
                      labelClass="!text-white text-base font-semibold translate-x-[-4px]"
                      onChange={handleSelectAll}
                      tabIndex={-1}
                    />
                  </div>
                ) : (
                  "Evidence file"
                )}
              </Table.Header>
              {HEADERS.map((item, index) => {
                return <Table.Header key={index}>{item}</Table.Header>;
              })}
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {list.map((item, index) => {
              const {
                filename,
                beneficiary,
                type,
                outcome,
                milestoneId,
                status,
                id,
              } = item;
              return (
                <Table.Row
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    showViewEvidenceModal({
                      milestoneId: milestoneId!,
                      evidenceId: id,
                      beneficiaryId: beneficiary.id,
                      status,
                    });
                  }}
                >
                  <Table.Data className="!px-4">
                    <div className="flex items-center gap-2">
                      {IsAuthorized([Evidences.UPDATE]) && !isProviderUser ? (
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
                              } else {
                                setSelectedIds((prev) =>
                                  prev.filter((item) => item !== id)
                                );
                              }
                            }}
                          />
                        </div>
                      ) : null}
                      <p className="translate-x-[-8px] translate-y-[1px] truncate text-left font-[300] outline-none">
                        {filename?.filename}
                      </p>
                    </div>
                  </Table.Data>

                  <Table.Data>
                    {beneficiary?.firstName + " " + beneficiary?.lastName}
                  </Table.Data>

                  <Table.Data>{type ? MILESTONE_TYPES[type] : "-"}</Table.Data>

                  <Table.Data>{outcome || "-"}</Table.Data>

                  <Table.Data>{milestoneId || "-"}</Table.Data>

                  <Table.Data>
                    <Status variant={getStatusVariant(status)}>{status}</Status>
                  </Table.Data>

                  <Table.Data>{dropDownComponent(item)}</Table.Data>
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
            onClick: () => {
              showBulkUpdateStatusModal({
                ids: selectedIds,
                successCb: () => setSelectedIds([]),
              });
            },
            icon: (
              <Update className="h-4 w-4 transition group-hover:fill-mint" />
            ),
          },
          {
            label: "Download",
            onClick: handleBulkDownload,
            icon: (
              <Download className="h-4 w-4 transition group-hover:stroke-mint" />
            ),
          },
        ]}
      />
    </>
  );
};

export default MainEvidencesTable;

const HEADERS = [
  "Beneficiary Name",
  "Type",
  "Outcome name",
  "Milestone ID",
  "Status",
  "",
];
