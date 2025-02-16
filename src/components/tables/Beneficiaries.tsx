import React from "react";
import { ChangeEvent, useCallback, useState } from "react";

import bin from "assets/images/icons/bin.svg";
import pencil from "assets/images/icons/pencil.svg";

import { DEFAULT_DATE_FORMAT } from "lib/constants";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { IBeneficiaries } from "lib/types/beneficiaries";
import { cn, formatDate } from "lib/utils";

import BeneficiariesDialogue from "components/Dashboard/Beneficiaries/Dialogues/BeneficiariesDialogue";
import DeleteDialogue from "components/Dashboard/Beneficiaries/Dialogues/DeleteDialogue";
import Button from "components/ui/button";
import Checkbox from "components/ui/checkbox";
import Table from "components/ui/table";

type ModalLabelTypes =
  | "beneficiaries"
  | "delete"
  | "import"
  | "update status"
  | "";

type TBeneficiariesTable = {
  list: IBeneficiaries[];
  isLoading?: boolean;
  setChecked?: React.Dispatch<React.SetStateAction<number[]>>;
};

const BeneficiariesTable = ({
  list,
  isLoading = false,
  setChecked,
}: TBeneficiariesTable) => {
  const [modal, setModal] = useState<ModalLabelTypes>("");
  const [editMode, setEditMode] = useState(false);

  const [beneficiaryId, setBeneficiaryId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const close = useCallback(() => {
    setModal("");

    setBeneficiaryId(null);

    setSelectedIds([]);

    if (setChecked) setChecked([]);
  }, [setChecked]);

  const handleDelete = (id: number) => {
    setModal("delete");

    setBeneficiaryId(id);
  };

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

  const renderDialog = useCallback(() => {
    switch (modal) {
      case "beneficiaries":
        return (
          <BeneficiariesDialogue
            id={beneficiaryId as number}
            editMode={editMode}
            isVisible={modal === "beneficiaries"}
            handleClose={close}
          />
        );

      case "delete":
        return (
          <DeleteDialogue
            id={beneficiaryId as number}
            isVisible={modal === "delete"}
            handleClose={close}
          />
        );
    }
  }, [beneficiaryId, editMode, modal, close]);

  return (
    <>
      {renderDialog()}
      <div className="pr-4">
        <Table.Container isLoading={isLoading} isEmpty={!list?.length}>
          <Table.Head>
            <Table.Row>
              {setChecked ? (
                <Table.Header small className="!h-[60px] !pl-[26px] !pr-12">
                  <Checkbox
                    checked={
                      list?.length !== 0 && selectedIds.length === list.length
                    }
                    label="First name"
                    labelClass="!text-black text-[14px]"
                    onChange={handleSelectAll}
                  />
                </Table.Header>
              ) : (
                <Table.Header small className="!h-[60px] !pr-12">
                  First Name
                </Table.Header>
              )}

              <Table.Header small className="!h-[60px] !pr-12">
                Last name
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Provider
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Email
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Phone number
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Contract
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Program
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Risk level
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Status
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Start date
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                End date
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12">
                Evidence
              </Table.Header>

              <Table.Header small className="!h-[60px] !pr-12"></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {list?.map((item, index) => {
              const {
                firstName,

                lastName,

                provider,

                email,

                contract,

                id,

                cohortEndDate,

                program,

                cohortStartDate,

                riskLevel,

                status,

                evidences,

                phoneNumber,
              } = item;

              return (
                <Table.Row
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();

                    setBeneficiaryId(id);

                    setModal("beneficiaries");

                    setEditMode(false);
                  }}
                >
                  <Table.Data small className="!h-[64px] !pl-[26px]">
                    <div className="flex items-center gap-2">
                      {setChecked ? (
                        <div
                          className="w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
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
                          "w-[143px] truncate text-left outline-none",
                          setChecked ? "translate-x-[-8px]" : ""
                        )}
                      >
                        {firstName}
                      </p>
                    </div>
                  </Table.Data>

                  <Table.Data small className="!h-[64px">
                    <p className="w-[143px] truncate">{lastName}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[134px] truncate">{provider}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[184px] truncate">{email}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[184px] truncate">{phoneNumber}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[134px] truncate">{contract}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[134px] truncate">{program}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px] capitalize">
                    <p className="w-[84px] truncate">{riskLevel}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[134px] truncate">{status}</p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[104px] truncate">
                      {formatDate(cohortStartDate || "", DEFAULT_DATE_FORMAT)}
                    </p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[104px] truncate">
                      {formatDate(cohortEndDate || "", DEFAULT_DATE_FORMAT)}
                    </p>
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    <p className="w-[234px] truncate">
                      {evidences?.map((item) => item.file.filename).join(", ")}
                    </p>{" "}
                  </Table.Data>

                  <Table.Data small className="!h-[64px]">
                    {IsAuthorized([
                      Beneficiaries.UPDATE,
                      Beneficiaries.DELETE,
                    ]) && (
                      <div className="flex justify-end">
                        <Button
                          eventName="Update Beneficiary"
                          id={id?.toString()}
                          buttonType="default"
                          type="button"
                          className="p-[3px]"
                          onClick={() => {
                            setModal("beneficiaries");

                            setBeneficiaryId(id);

                            setEditMode(true);
                          }}
                        >
                          <img alt="pencil" src={pencil} />
                        </Button>

                        <Button
                          eventName="Delete Beneficiary"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="p-[3px]"
                        >
                          <img alt="pencil" src={bin} />
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

export default BeneficiariesTable;
