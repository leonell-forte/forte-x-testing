import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useMemo, useState } from "react";

import { useTagPartnerMutation } from "lib/mutations/projects";
import { IsAuthorized, Projects } from "lib/role-permissions";
import { IProjectOrganization } from "lib/types/projects";

import Button from "components/ui/button";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

import OrganizationDialogue from "../../Organizations/Dialogues/OrganizationDialogue";
import TagExistingDialogue from "../Dialogues/TagExistingDialogue";

type ModalLabelType = "partner" | "tag" | "";

interface IProps {
  projectId: number;
}

const Partners = ({ projectId }: IProps) => {
  const { data, isLoading } = useQuery<{ items: IProjectOrganization[] }>({
    queryKey: ["project-organizations", projectId],

    queryFn: () => projectService.getOrganizations(projectId),
  });

  const [orgId, setOrgId] = useState<number | null>(null);

  const [modal, setModal] = useState<ModalLabelType>("");

  const close = () => {
    setOrgId(null);
    setModal("");
  };

  const partners = useMemo(
    () => data?.items.filter((item) => !!item.id),

    [data?.items]
  );

  const { tagPartners, isPending } = useTagPartnerMutation(projectId, close);

  const onSubmit = async (organizationIds: number[]) => {
    await tagPartners(organizationIds);
  };

  const renderModal = (modal: ModalLabelType) => {
    switch (modal) {
      case "partner":
        return (
          <OrganizationDialogue
            orgId={orgId?.toString()}
            isVisible={modal === "partner"}
            handleClose={close}
            addSuccessCallback={(id) => {
              onSubmit([id]);
            }}
          />
        );

      case "tag":
        return (
          <TagExistingDialogue
            isVisible={modal === "tag"}
            handleClose={close}
            title="Add partners to project"
            handleAdd={onSubmit}
            isPending={isPending}
          />
        );
    }
  };

  return (
    <>
      {renderModal(modal)}

      <div className="space-y-2.5">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="text-[24px] font-semibold">Partners</p>

          {IsAuthorized([Projects.UPDATE]) && (
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <Button onClick={() => setModal("tag")} buttonType="secondary">
                Tag existing partner
              </Button>

              <Button onClick={() => setModal("partner")}>
                Add new partner
              </Button>
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <Cards.Container
            isLoading={isLoading}
            className="!grid-cols-1 md:!grid-cols-2"
          >
            {partners?.map((item, index) => {
              const {
                name,

                registeredName,

                registeredAddress,

                registrationNumber,

                regions,

                type,

                status,

                users,

                projects,

                contracts,

                id,
              } = item;
              return (
                <Cards.Card
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal("partner");
                    setOrgId(id);
                  }}
                  key={index}
                  title={name}
                >
                  <Cards.Group cols={2}>
                    <Cards.Details
                      label="Registered name"
                      value={registeredName}
                    />
                    <Cards.Details
                      label="Registered address"
                      value={registeredAddress}
                    />
                    <Cards.Details
                      label="Registration"
                      value={registrationNumber}
                    />
                    <Cards.Details label="Regions" value={regions.join(", ")} />
                    <Cards.Details label="Type" value={type} capitalize />
                    <Cards.Details label="Status" value={status} capitalize />
                    <Cards.Details label="Users" value={users} />
                    <Cards.Details label="Projects" value={projects} />
                    <Cards.Details label="Contracts" value={contracts} />
                  </Cards.Group>
                </Cards.Card>
              );
            })}
          </Cards.Container>
        </div>
        <div className="hidden lg:block">
          <Table.Container isEmpty={!partners?.length} isLoading={isLoading}>
            <Table.Head>
              <Table.Row>
                {HEADERS.map((item, index) => {
                  return <Table.Header key={index}>{item}</Table.Header>;
                })}
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {partners?.map((item, index) => {
                const {
                  name,

                  registeredName,

                  registeredAddress,

                  registrationNumber,

                  regions,

                  type,

                  status,

                  users,

                  projects,

                  contracts,

                  id,
                } = item;

                return (
                  <Table.Row
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal("partner");
                      setOrgId(id);
                    }}
                    key={index}
                  >
                    <Table.Data>{name}</Table.Data>

                    <Table.Data>{registeredName}</Table.Data>

                    <Table.Data>{registeredAddress}</Table.Data>

                    <Table.Data>{registrationNumber}</Table.Data>

                    <Table.Data>{regions?.join(", ")}</Table.Data>

                    <Table.Data className="capitalize">{type}</Table.Data>

                    <Table.Data className="capitalize">{status}</Table.Data>

                    <Table.Data>{users}</Table.Data>

                    <Table.Data>{projects}</Table.Data>

                    <Table.Data>{contracts}</Table.Data>
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

export default Partners;

const HEADERS = [
  "Organization",
  "Registered Name",
  "Registered Address",
  "Registration",
  "Region",
  "Type",
  "Status",
  "Users",
  "Projects",
  "Contracts",
];
