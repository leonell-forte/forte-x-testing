import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import bin from "assets/images/icons/bin.svg";
import pencil from "assets/images/icons/pencil.svg";

import { IsAuthorized, Projects } from "lib/role-permissions";
import { IProject } from "lib/types/projects";

import DeleteDialogue from "components/Dashboard/Projects/Dialogues/DeleteDialogue";
import ProjectDialogue from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import Button from "components/ui/button";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

type TProjectTable = {
  list: IProject[];
  isLoading?: boolean;
};

const ProjectsTable = ({ list, isLoading = false }: TProjectTable) => {
  const navigate = useNavigate();

  const [modal, setModal] = useState<"project" | "delete" | null>(null);

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const handleEditUser = (item: IProject) => {
    setModal("project");

    setSelectedProject(item);
  };

  const handleCloseModal = () => {
    setModal(null);

    setSelectedProject(null);
  };

  const renderDialog = useCallback(() => {
    switch (modal) {
      case "project":
        return (
          <ProjectDialogue
            projectId={(selectedProject?.id || "") as string}
            isVisible={modal === "project"}
            handleClose={handleCloseModal}
          />
        );

      case "delete":
        return (
          <DeleteDialogue
            isVisible={modal === "delete"}
            project={selectedProject!}
            handleClose={handleCloseModal}
          />
        );
    }
  }, [modal, selectedProject]);

  return (
    <>
      {renderDialog()}

      <div className="table-breakpoint:hidden">
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
                <div className="flex items-end gap-2.5">
                  <div className="w-full overflow-hidden">
                    <p className="truncate">
                      {providers?.map((item) => item).join(", ") || "-"}
                    </p>
                    <p className="truncate">
                      {outcomes.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex">
                    {IsAuthorized([Projects.UPDATE]) && (
                      <Button
                        eventName="Edit Project"
                        id={id.toString()}
                        buttonType="default"
                        type="button"
                        onClick={() => handleEditUser(item)}
                        className="!mx-[-12px]"
                      >
                        <img
                          alt="pencil"
                          src={pencil}
                          className="h-3.5 sm:h-auto"
                        />
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
                        className="!mx-[-12px]"
                      >
                        <img
                          alt="pencil"
                          src={bin}
                          className="h-3.5 sm:h-auto"
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden table-breakpoint:block">
        <Table.Container isEmpty={!list.length} isLoading={isLoading}>
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
              const { id, name, outcomes, providers } = item;

              return (
                <Table.Row
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/projects/${id}`);
                  }}
                  key={bodyIndex}
                >
                  <Table.Data className="w-[220px]">{name}</Table.Data>

                  <Table.Data className="w-[220px]">
                    {providers?.map((item) => item).join(", ") || "-"}
                  </Table.Data>

                  <Table.Data className="w-[220px]">
                    {outcomes.map((item) => item.name).join(", ")}
                  </Table.Data>

                  <Table.Data>
                    <div className="flex justify-end">
                      {IsAuthorized([Projects.UPDATE]) && (
                        <Button
                          eventName="Edit Project"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => handleEditUser(item)}
                          className="!mx-[-12px]"
                        >
                          <img alt="pencil" src={pencil} />
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
                          className="!mx-[-12px]"
                        >
                          <img alt="pencil" src={bin} />
                        </Button>
                      )}
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

export default ProjectsTable;

const TABLE_HEADER = ["Project", "Partners", "Outcomes"];
