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

      <div className="pr-4">
        <Table.Container isEmpty={!list.length} isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {TABLE_HEADER.map((key, headerIndex) => {
                return (
                  <Table.Header
                    className="h-[64px] pl-[14px]"
                    key={headerIndex}
                  >
                    {key}
                  </Table.Header>
                );
              })}

              <Table.Header className="h-[64px]"></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {list.map((item: IProject, bodyIndex: number) => {
              const { id, name, outcomes, contracts, providers } = item;
              return (
                <Table.Row
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/projects/${id}`);
                  }}
                  key={bodyIndex}
                >
                  <Table.Data className="pl-[14px]">
                    <p className="w-[220px] truncate">{name}</p>
                  </Table.Data>

                  <Table.Data className="pl-[14px]">
                    <p className="w-[220px] truncate">
                      {providers?.map((item) => item).join(", ") || "-"}
                    </p>
                  </Table.Data>

                  <Table.Data className="pl-[14px]">
                    <p className="w-[220px] truncate">
                      {outcomes?.map((item) => item.name).join(", ")}
                    </p>
                  </Table.Data>

                  <Table.Data className="pl-[14px]">
                    <p className="w-[220px] truncate">
                      {contracts?.map((item) => item).join(", ") || "-"}
                    </p>
                  </Table.Data>

                  <Table.Data className="pl-[14px]">-</Table.Data>

                  <Table.Data className="pl-[14px]">
                    <div className="flex justify-end">
                      {IsAuthorized([Projects.UPDATE]) && (
                        <Button
                          eventName="Edit Project"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => handleEditUser(item)}
                          className="p-[3px]"
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
                          className="p-[3px]"
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

const TABLE_HEADER = [
  "Projects",
  "Partners",
  "Outcomes",
  "Contracts",
  "Beneficiaries",
];
