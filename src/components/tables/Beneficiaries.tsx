import React from "react";
import { ChangeEvent, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import bin from "assets/images/icons/bin.svg";

import { DEFAULT_DATE_FORMAT } from "lib/constants";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { IBeneficiaries } from "lib/types/beneficiaries";
import { cn, formatDate } from "lib/utils";

import BeneficiariesDialogue from "components/Dashboard/Beneficiaries/Dialogues/BeneficiariesDialogue";
import DeleteDialogue from "components/Dashboard/Beneficiaries/Dialogues/DeleteDialogue";
import Button from "components/ui/button";
import Checkbox from "components/ui/checkbox";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

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
      <div className="min-[1350px]:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((item, index) => {
            const {
              firstName,

              lastName,

              provider,

              email,

              id,

              cohortEndDate,

              cohortStartDate,

              status,

              evidences,

              phoneNumber,
            } = item;

            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();

                  setBeneficiaryId(id);

                  setModal("beneficiaries");

                  setEditMode(false);
                }}
                key={index}
                title={`${firstName} ${lastName}`}
              >
                {setChecked && (
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
                  <Cards.Details label="Phone number" value={phoneNumber} />
                  <Cards.Details label="Provider" value={provider} />
                  <Cards.Details label="Status" value={status} capitalize />
                  <Cards.Details
                    label="Start date"
                    value={formatDate(
                      cohortStartDate || "",
                      DEFAULT_DATE_FORMAT
                    )}
                  />
                  <Cards.Details
                    label="End date"
                    value={formatDate(cohortEndDate || "", DEFAULT_DATE_FORMAT)}
                  />
                </Cards.Group>

                <div className="mt-4 flex w-[85%] flex-col">
                  <p className="text-[12px]">Evidences</p>
                  {!evidences?.length
                    ? "No uploaded evidence yet"
                    : evidences?.map((item, index) => {
                        return (
                          <Link
                            key={index}
                            className="truncate underline-offset-4 hover:underline"
                            target="_blank"
                            to={item.file.fileUrl}
                            download
                          >
                            {item.file.filename}
                          </Link>
                        );
                      })}
                </div>

                <div className="absolute bottom-3 right-0">
                  {IsAuthorized([Beneficiaries.DELETE]) && (
                    <div className="flex justify-end">
                      <Button
                        eventName="Delete Beneficiary"
                        id={id.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => handleDelete(id)}
                      >
                        <img alt="pencil" src={bin} />
                      </Button>
                    </div>
                  )}
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>
      <div className="hidden min-[1350px]:block">
        <Table.Container isLoading={isLoading} isEmpty={!list?.length}>
          <Table.Head>
            <Table.Row>
              {setChecked ? (
                <Table.Header className="!pl-4">
                  <Checkbox
                    dark
                    checked={
                      list?.length !== 0 && selectedIds.length === list.length
                    }
                    label="First name"
                    labelClass="!text-black text-[14px] font-[450]"
                    onChange={handleSelectAll}
                  />
                </Table.Header>
              ) : (
                <Table.Header>First Name</Table.Header>
              )}

              <Table.Header>Last name</Table.Header>

              <Table.Header>Email</Table.Header>

              <Table.Header>Phone number</Table.Header>

              <Table.Header>Provider</Table.Header>

              <Table.Header>Status</Table.Header>

              <Table.Header>Start date</Table.Header>

              <Table.Header>End date</Table.Header>

              <Table.Header>Evidence</Table.Header>

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

                cohortEndDate,

                cohortStartDate,

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
                  <Table.Data className="w-[100px] !pl-4">
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
                          "translate-y-[1px] truncate text-left font-[300] outline-none",
                          setChecked ? "translate-x-[-8px]" : ""
                        )}
                      >
                        {firstName}
                      </p>
                    </div>
                  </Table.Data>

                  <Table.Data className="w-[100px]">{lastName}</Table.Data>

                  <Table.Data className="w-[130px]">{email}</Table.Data>

                  <Table.Data className="w-[120px]">{phoneNumber}</Table.Data>

                  <Table.Data className="w-[140px]">{provider}</Table.Data>

                  <Table.Data className="w-[90px] capitalize">
                    {status.toLowerCase()}
                  </Table.Data>

                  <Table.Data className="w-[110px]">
                    {formatDate(cohortStartDate || "", DEFAULT_DATE_FORMAT)}
                  </Table.Data>

                  <Table.Data className="w-[110px]">
                    {formatDate(cohortEndDate || "", DEFAULT_DATE_FORMAT)}
                  </Table.Data>

                  <Table.Data className="w-[150px]">
                    {evidences?.map((item) => item.file.filename).join(", ")}
                  </Table.Data>

                  <Table.Data className="ml-auto w-[50px]">
                    {IsAuthorized([Beneficiaries.DELETE]) && (
                      <div className="flex justify-end">
                        <Button
                          eventName="Delete Beneficiary"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => handleDelete(id)}
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
