import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useMemo, useState } from "react";

import { useProfile } from "lib/hooks";
import { useTagPartnerMutation } from "lib/mutations/projects";
import { Projects, isAuthorized } from "lib/role-permissions";
import { IProjectOrganization } from "lib/types/projects";

import Button from "components/ui/button";
import Input from "components/ui/input";
import Table from "components/ui/table";

import OrganizationDialogue from "../../Organizations/Dialogues/OrganizationDialogue";
import TagExistingDialogue from "../Dialogues/TagExistingDialogue";

type ModalLabelType = "partner" | "tag" | "";

interface IProps {
  projectId: number;
}

const Partners = ({ projectId }: IProps) => {
  const currentUser = useProfile();

  const { data, isLoading } = useQuery<{ items: IProjectOrganization[] }>({
    queryKey: ["project-organizations", projectId],

    queryFn: () => projectService.getOrganizations(projectId),
  });

  const [editIndex] = useState<number | null>(null);

  const [modal, setModal] = useState<ModalLabelType>("");

  const close = () => {
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
        <div className="flex items-center justify-between">
          <p className="text-[24px] font-semibold">Partners</p>

          {isAuthorized(currentUser?.role, [Projects.UPDATE]) && (
            <div className="flex gap-2.5">
              <Button onClick={() => setModal("tag")} buttonType="secondary">
                Tag existing partner
              </Button>

              <Button onClick={() => setModal("partner")}>
                Add new partner
              </Button>
            </div>
          )}
        </div>

        <Table.Container isEmpty={!partners?.length} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {HEADERS.map((item, index) => {
                return (
                  <Table.Header small key={index}>
                    {item}
                  </Table.Header>
                );
              })}

              <Table.Header small></Table.Header>
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
              } = item;

              const onEdit = index === editIndex;

              return (
                <Table.Row key={index}>
                  <Table.Data small className="h-[56px] py-1">
                    {name}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? <Input noHelperText /> : <p>{registeredName}</p>}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? (
                      <Input noHelperText />
                    ) : (
                      <p>{registeredAddress}</p>
                    )}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? (
                      <Input noHelperText />
                    ) : (
                      <p>{registrationNumber}</p>
                    )}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? (
                      <Input noHelperText />
                    ) : (
                      <p>{regions?.join(", ")}</p>
                    )}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? (
                      <Input noHelperText />
                    ) : (
                      <p className="capitalize">{type}</p>
                    )}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? (
                      <Input noHelperText />
                    ) : (
                      <p className="capitalize">{status}</p>
                    )}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? <Input noHelperText /> : <p>{users}</p>}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? <Input noHelperText /> : <p>{projects}</p>}
                  </Table.Data>

                  <Table.Data small className="h-[56px] py-1">
                    {onEdit ? <Input noHelperText /> : <p>{contracts}</p>}
                  </Table.Data>

                  <Table.Data small></Table.Data>

                  {/* <Table.Data small className="h-[56px] py-1">
                    <div className="flex justify-end gap-1.5">
                      {onEdit ? (
                        <>
                          <Button
                            onClick={() => setEditIndex(null)}
                            buttonType="tertiary"
                          >
                            Cancel
                          </Button>

                          <Button>Save</Button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditIndex(index)}
                          className="flex-shrink-0"
                        >
                          <img src={pencil} alt="" />
                        </button>
                      )}
                    </div>
                  </Table.Data> */}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
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
