import { useCallback, useState } from "react";
import { FaTrash as Trash } from "react-icons/fa6";
import { RiPencilFill as Pencil } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

import { ReactComponent as LinkIcon } from "assets/images/icons/link.svg";

import { IsAuthorized, Projects } from "lib/role-permissions";
import { IProject } from "lib/types/projects";

import DeleteDialogue from "components/Dashboard/Projects/Dialogues/DeleteDialogue";
import { showProjectDialogue } from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import Button from "components/ui/button";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TProjectTable = {
  list: IProject[];
  isLoading?: boolean;
  funderId?: number;
};

const ProjectsTable = ({
  list,
  isLoading = false,
  funderId,
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
            const { id, name, outcomes, providers } = item;

            return (
              <Cards.Card
                onClick={(e) => {
                  e.stopPropagation();

                  navigate(`/projects/${id}`);
                }}
                key={index}
                title={name}
              >
                <Cards.Group>
                  <Cards.Details
                    label="Providers"
                    value={providers?.map((item) => item).join(", ") || "-"}
                  />
                  <Cards.Details
                    label="Outcomes"
                    value={outcomes?.map((item) => item.name).join(", ")}
                  />
                </Cards.Group>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {IsAuthorized([Projects.UPDATE]) && (
                    <Button
                      eventName="Edit Project"
                      id={id.toString()}
                      buttonType="default"
                      type="button"
                      onClick={() =>
                        showProjectDialogue({ projectId: item.id.toString() })
                      }
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
                      onClick={() => {
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
              {TABLE_HEADER.map((key, headerIndex) => {
                return <Table.Header key={headerIndex}>{key}</Table.Header>;
              })}

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
              } = item;

              return (
                <Table.Row
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/projects/${id}`);
                  }}
                  key={bodyIndex}
                >
                  <Table.Data>{name}</Table.Data>

                  <Table.Data>
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      to={`/funders/${funder?.id}`}
                      className="flex items-center gap-2"
                    >
                      <p>{funder?.name}</p>
                      <LinkIcon />
                    </Link>
                  </Table.Data>

                  <Table.Data>$ {budget}</Table.Data>

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
                          <Pencil className="h-auto w-5 transition-all group-hover:fill-mint" />
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
                          <Trash className="h-auto w-4 transition-all group-hover:fill-mint" />{" "}
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

const TABLE_HEADER = [
  "Project Name",
  "Funder  ",
  "Budget",
  "# of Contracts",
  "# of Beneficiaries",
  "# of Milestones",
];
