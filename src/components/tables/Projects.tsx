import { useCallback, useState } from "react";
import { FaTrash as Trash } from "react-icons/fa6";
import { RiPencilFill as Pencil } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Sort } from "assets/images/icons/sort.svg";

import { IsAuthorized, Projects } from "lib/role-permissions";
import { IProject, ProjectSortLabel } from "lib/types/projects";
import { formatCurrency, getCurrencyCode, getStatusVariant } from "lib/utils";

import DeleteDialogue from "components/Dashboard/Projects/Dialogues/DeleteDialogue";
import { showProjectDialogue } from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import Button from "components/ui/button";
import ReferenceLink from "components/ui/reference-link/ReferenceLink";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Status from "components/ui/status";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TProjectTable = {
  list: IProject[];
  isLoading?: boolean;
  funderId?: number;
  handleSort?: (label: ProjectSortLabel) => void;
};

const ProjectsTable = ({
  list,
  isLoading = false,
  funderId,
  handleSort,
}: TProjectTable) => {
  const navigate = useNavigate();

  const [modal, setModal] = useState<"delete" | null>(null);

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const handleCloseModal = () => {
    setModal(null);

    setSelectedProject(null);
  };

  const renderDialog = useCallback(() => {
    switch (modal) {
      case "delete":
        return (
          <DeleteDialogue
            funderId={funderId}
            isVisible={modal === "delete"}
            project={selectedProject!}
            handleClose={handleCloseModal}
          />
        );
    }
  }, [modal, selectedProject, funderId]);

  return (
    <>
      {renderDialog()}

      <div className="lg:hidden">
        <Cards.Container isLoading={isLoading}>
          {list.map((item, index) => {
            const {
              id,
              name,
              funder,
              budget,
              contractsCount,
              beneficiariesCount,
              milestonesCount,
              currency,
            } = item;

            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();

                  navigate(`/projects/${id}`);
                }}
                key={index}
                title={name}
              >
                <Cards.Group cols={2}>
                  <Cards.Details label="Funder" value={funder?.name || "-"} />
                  <Cards.Details
                    label="Budget"
                    value={`${formatCurrency(Number(budget as string), getCurrencyCode(currency))}`}
                  />

                  <Cards.Details
                    label="# of Contracts"
                    value={contractsCount?.toString() || "0"}
                  />
                  <Cards.Details
                    label="# of Beneficiaries"
                    value={beneficiariesCount?.toString() || "0"}
                  />
                  <Cards.Details
                    label="# of Milestones"
                    value={milestonesCount?.toString() || "0"}
                  />
                  <Cards.Details
                    label="Status"
                    value={
                      <Status variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Status>
                    }
                  />
                </Cards.Group>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {IsAuthorized([Projects.UPDATE]) && (
                    <Button
                      eventName="Edit Project"
                      id={id.toString()}
                      buttonType="default"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showProjectDialogue({ projectId: item.id.toString() });
                      }}
                      className="icon group"
                    >
                      <Pencil className="h-auto w-5 transition-all group-hover:fill-mint" />
                    </Button>
                  )}

                  {IsAuthorized([Projects.DELETE]) && (
                    <Button
                      eventName="Delete Project"
                      id={id.toString()}
                      buttonType="default"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal("delete");
                        setSelectedProject(item);
                      }}
                      className="icon group"
                    >
                      <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />
                    </Button>
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
            title: "No projects yet.",
            description: "Add a project by clicking the ‘Add’ button above.",
            status: !list.length,
          }}
          isLoading={isLoading}
        >
          <Table.Head>
            <Table.Row>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Project Name</span>
                  <button
                    onClick={() => handleSort?.(ProjectSortLabel.PROJECT)}
                  >
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>
                <div className="flex items-center gap-2">
                  <span>Funder</span>
                  <button onClick={() => handleSort?.(ProjectSortLabel.FUNDER)}>
                    <Sort className="w-4 fill-white" />
                  </button>
                </div>
              </Table.Header>
              <Table.Header>Status</Table.Header>
              <Table.Header>Budget</Table.Header>
              <Table.Header># of Contracts</Table.Header>
              <Table.Header># of Beneficiaries</Table.Header>
              <Table.Header># of Milestones</Table.Header>

              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list.map((item: IProject, bodyIndex: number) => {
              const {
                id,
                name,
                funder,
                beneficiariesCount,
                contractsCount,
                milestonesCount,
                budget,
                currency,
              } = item;

              return (
                <Table.Row
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/projects/${id}`);
                  }}
                  key={bodyIndex}
                  ariaLabel={`${name} Project`}
                >
                  <Table.Data>{name}</Table.Data>

                  <Table.Data>
                    <ReferenceLink hrefLink={`/funders/${funder?.id}`}>
                      {funder?.name}
                    </ReferenceLink>
                  </Table.Data>

                  <Table.Data>
                    <Status variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Status>
                  </Table.Data>

                  <Table.Data>
                    {formatCurrency(Number(budget), getCurrencyCode(currency))}
                  </Table.Data>

                  <Table.Data>{contractsCount}</Table.Data>

                  <Table.Data>{beneficiariesCount}</Table.Data>

                  <Table.Data>{milestonesCount}</Table.Data>

                  <Table.Data>
                    <div className="flex justify-end gap-4 px-4">
                      {IsAuthorized([Projects.UPDATE]) && (
                        <Button
                          disableRipple
                          eventName="Edit Project"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() =>
                            showProjectDialogue({
                              projectId: id.toString(),
                            })
                          }
                          className="icon group"
                        >
                          <Pencil
                            className="h-auto w-5 transition-all group-hover:fill-mint group-focus:fill-mint"
                            aria-hidden="true"
                            role="presentation"
                          />
                          <span className="sr-only">Edit {name}</span>
                        </Button>
                      )}

                      {IsAuthorized([Projects.DELETE]) && (
                        <Button
                          disableRipple
                          eventName="Delete Project"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => {
                            setModal("delete");
                            setSelectedProject(item);
                          }}
                          className="icon group"
                        >
                          <Trash
                            className="h-auto w-4 transition-all group-hover:fill-mint group-focus:fill-mint"
                            aria-hidden="true"
                            role="presentation"
                          />{" "}
                          <span className="sr-only">Delete {name}</span>
                        </Button>
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

export default ProjectsTable;
