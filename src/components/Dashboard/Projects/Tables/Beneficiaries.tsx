import Table from "../../../ui/table";
import Button from "../../../ui/button";
import { useState } from "react";
import TagExistingDialogue from "../Dialogues/TagExistingDialogue";
import BeneficiariesDialogue from "../../Beneficiaries/Dialogues/BeneficiariesDialogue";
import ImportDialogue from "../../Beneficiaries/Dialogues/ImportDialogue";
import { useQuery } from "@tanstack/react-query";
import beneficiariesServce from "../../../../api/beneficiaries";

type ModalLabelType = "beneficiaries" | "tag" | "import" | "";

interface IProps {
  id?: string;
}

const Beneficiaries = ({ id }: IProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["beneficiaries", id],

    queryFn: () => beneficiariesServce.list({ filters: { project: id } }),
  });

  const [modal, setModal] = useState<ModalLabelType>("");

  const close = () => {
    setModal("");
  };

  const renderModal = (modal: ModalLabelType) => {
    switch (modal) {
      case "beneficiaries":
        return (
          <BeneficiariesDialogue
            projectId={Number(id)}
            isVisible={modal === "beneficiaries"}
            handleClose={close}
          />
        );

      case "tag":
        return (
          <TagExistingDialogue
            isVisible={modal === "tag"}
            handleClose={close}
            title="Add beneficiaries to project"
            handleAdd={() => {}}
          />
        );

      case "import":
        return (
          <ImportDialogue
            isVisible={modal === "import"}
            handleClose={close}
          />
        );
    }
  };
  return (
    <>
      {renderModal(modal)}

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[24px]">Beneficiaries</p>

          <div className="flex gap-2.5">
            <Button
              onClick={() => setModal("import")}
              buttonType="secondary"
            >
              Import beneficiaries
            </Button>

            {/* <Button
              onClick={() => setModal("tag")}
              buttonType="secondary"
            >
              Tag existing beneficiaries
            </Button> */}

            <Button onClick={() => setModal("beneficiaries")}>
              Add new beneficiaries
            </Button>
          </div>
        </div>

        <Table.Container
          isLoading={isLoading}
          isEmpty={!data?.items.length}
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
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {data?.items.map((item, index) => {
              const {
                firstName,

                lastName,

                provider,

                email,

                contractId,

                cohortName,

                phone,
              } = item;

              return (
                <Table.Row key={index}>
                  <Table.Data className="h-[56px] py-1">{firstName}</Table.Data>

                  <Table.Data className="h-[56px] py-1">{lastName}</Table.Data>

                  <Table.Data className="h-[56px] py-1">{provider}</Table.Data>

                  <Table.Data className="h-[56px] py-1">{email}</Table.Data>

                  <Table.Data className="h-[56px] py-1">{phone}</Table.Data>

                  <Table.Data className="h-[56px] py-1">
                    Contaract {contractId}
                  </Table.Data>

                  <Table.Data className="h-[56px] py-1">
                    {cohortName}
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

export default Beneficiaries;

const HEADERS = [
  "First name",
  "Last name",
  "Partner",
  "Email",
  "Phone number",
  "Contract",
  "Program",
];
