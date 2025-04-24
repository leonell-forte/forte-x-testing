import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import { useState } from "react";

import { IsAuthorized, Projects } from "lib/role-permissions";

import { showImportBeneficiariesModal } from "components/Dashboard/Beneficiaries/Dialogues/ImportDialogue";
import Button from "components/ui/button";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

import BeneficiariesDialogue from "../../Beneficiaries/Dialogues/BeneficiariesDialogue";
import TagExistingDialogue from "../Dialogues/TagExistingDialogue";

type ModalLabelType = "beneficiaries" | "tag" | "import" | "";

interface IProps {
  projectId?: string;
}

const Beneficiaries = ({ projectId }: IProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["beneficiaries", projectId],

    queryFn: () =>
      beneficiariesService.list({ filters: { project: projectId } }),
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
            projectId={Number(projectId)}
            isVisible={modal === "beneficiaries"}
            handleClose={close}
            editMode
          />
        );

      case "tag":
        return (
          <TagExistingDialogue
            isVisible={modal === "tag"}
            handleClose={close}
            title="Add beneficiaries to project"
          />
        );
    }
  };
  return (
    <>
      {renderModal(modal)}

      <div className="space-y-2.5">
        <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="text-[24px] font-semibold">Beneficiaries</p>

          {IsAuthorized([Projects.UPDATE]) && (
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <Button
                eventName="Import Beneficiaries"
                onClick={() => showImportBeneficiariesModal()}
                buttonType="secondary"
              >
                Import beneficiaries
              </Button>

              <Button onClick={() => setModal("beneficiaries")}>
                Add new beneficiaries
              </Button>
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <Cards.Container isLoading={isLoading}>
            {data?.items.map((item, index) => {
              const {
                firstName,

                lastName,

                provider,

                email,

                program,

                phoneNumber,

                contract,
              } = item;
              return (
                <Cards.Card title={`${firstName} ${lastName}`} key={index}>
                  <Cards.Group cols={2}>
                    <Cards.Details label="Provider" value={provider} />
                    <Cards.Details label="Email" value={email} />
                    <Cards.Details label="Phone number" value={phoneNumber} />
                    <Cards.Details label="Contract" value={contract} />
                    <Cards.Details label="Program" value={program} />
                  </Cards.Group>
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
              status: !data?.items.length,
            }}
            isLoading={isLoading}
          >
            <Table.Head>
              <Table.Row>
                {HEADERS.map((item, index) => {
                  return <Table.Header key={index}>{item}</Table.Header>;
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

                  program,

                  phoneNumber,

                  contract,
                } = item;

                return (
                  <Table.Row key={index}>
                    <Table.Data>{firstName}</Table.Data>

                    <Table.Data>{lastName}</Table.Data>

                    <Table.Data>{provider}</Table.Data>

                    <Table.Data>{email}</Table.Data>

                    <Table.Data>{phoneNumber}</Table.Data>

                    <Table.Data>{contract}</Table.Data>

                    <Table.Data>{program}</Table.Data>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Container>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
