import React from "react";
import { ChangeEvent, useCallback, useState } from "react";

import bin from "assets/images/icons/bin.svg";
import pencil from "assets/images/icons/pencil.svg";

import { DEFAULT_DATE_FORMAT } from "lib/constants";
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

  const close = () => {
    setModal("");

    setBeneficiaryId(null);

    setSelectedIds([]);

    if (setChecked) setChecked([]);
  };

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
  }, [beneficiaryId, editMode, modal]);

  return (
    <>
      {renderDialog()}
      <div className="pr-4">
        <Table.Container isLoading={isLoading} isEmpty={!list?.length}>
          <Table.Head>
            <Table.Row>
              {setChecked ? (
                <Table.Header small>
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
                <Table.Header small>First Name</Table.Header>
              )}

              <Table.Header small>Last name</Table.Header>

              <Table.Header small>Provider</Table.Header>

              <Table.Header small>Email</Table.Header>

              <Table.Header small>Phone number</Table.Header>

              <Table.Header small>Contract</Table.Header>

              <Table.Header small>Program</Table.Header>

              <Table.Header small>Risk level</Table.Header>

              <Table.Header small>Status</Table.Header>

              <Table.Header small> Start date</Table.Header>

              <Table.Header small> End date</Table.Header>

              <Table.Header small>Evidence</Table.Header>

              <Table.Header small></Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {list?.map((item, index) => {
              const {
                firstName,

                lastName,

                provider,

                email,

                contractId,

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
                <Table.Row key={index}>
                  <Table.Data small>
                    <div className="flex items-center gap-2">
                      {setChecked ? (
                        <div className="w-6">
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
                      <button
                        onClick={() => {
                          setBeneficiaryId(id);

                          setModal("beneficiaries");

                          setEditMode(false);
                        }}
                        className={cn(
                          "outline-none",
                          setChecked ? "translate-x-[-8px]" : ""
                        )}
                      >
                        {firstName}
                      </button>
                    </div>
                  </Table.Data>

                  <Table.Data small>{lastName}</Table.Data>

                  <Table.Data small>{provider}</Table.Data>

                  <Table.Data small>{email}</Table.Data>

                  <Table.Data small>{phoneNumber}</Table.Data>

                  <Table.Data small>Contract {contractId}</Table.Data>

                  <Table.Data small>{program}</Table.Data>

                  <Table.Data small className="capitalize">
                    {riskLevel}
                  </Table.Data>

                  <Table.Data small>{status}</Table.Data>

                  <Table.Data small>
                    {formatDate(cohortStartDate, DEFAULT_DATE_FORMAT)}
                  </Table.Data>

                  <Table.Data small>
                    {formatDate(cohortEndDate, DEFAULT_DATE_FORMAT)}
                  </Table.Data>

                  <Table.Data small>
                    {evidences?.map((item) => item.file.filename).join(", ")}
                  </Table.Data>

                  <Table.Data small>
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
