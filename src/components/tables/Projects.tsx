import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import bin from "assets/images/icons/bin.svg";
import pencil from "assets/images/icons/pencil.svg";

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

  const renderModal = useCallback(() => {
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
      {renderModal()}

      <div className="pr-4">
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
              const { id, name, outcomes, contracts, providers } = item;
              return (
                <Table.Row key={bodyIndex}>
                  <Table.Data>
                    <Link to={`/projects/${id}`}>
                      <p className="w-[220px] truncate">{name}</p>
                    </Link>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[220px] truncate">
                      {providers?.map((item) => item).join(", ") || "-"}
                    </p>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[220px] truncate">
                      {outcomes?.map((item) => item.name).join(", ")}
                    </p>
                  </Table.Data>

                  <Table.Data>
                    <p className="w-[220px] truncate">
                      {contracts?.map((item) => item).join(", ") || "-"}
                    </p>
                  </Table.Data>

                  <Table.Data>-</Table.Data>

                  <Table.Data>
                    <div className="flex justify-end">
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

                      <Button
                        eventName="Edit User"
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
